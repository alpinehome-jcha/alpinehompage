$ErrorActionPreference = "Stop"

# Use Relative Paths based on current location
$currentDir = Get-Location
Write-Host "Current Working Directory: $currentDir"

# Helper for Reading File
function Read-FileContent {
    param($Path)
    return [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)
}

# Helper for Writing File
function Write-FileContent {
    param($Path, $Content)
    [System.IO.File]::WriteAllText($Path, $Content, [System.Text.Encoding]::UTF8)
}

function Generate-StaticPages {
    param(
        [string]$SectionName,
        [string]$DataFileRelative,
        [string]$TemplateFileRelative,
        [string]$OutputDirRelative,
        [string]$VarName, 
        [string]$Type 
    )

    Write-Host "--------------------------------------------------"
    Write-Host "Starting Generation for: $SectionName"

    # Resolve Paths
    try {
        $dataFile = (Resolve-Path $DataFileRelative).Path
        $templateFile = (Resolve-Path $TemplateFileRelative).Path
        $outputDirParent = (Resolve-Path ".\support").Path
        $outputDirBase = Join-Path $outputDirParent $SectionName # e.g. support/install
        
        # Ensure base dir exists (though usually it does if we resolve parent)
        if (!(Test-Path $outputDirBase)) {
            New-Item -ItemType Directory -Force -Path $outputDirBase | Out-Null
        }

        Write-Host "Data: $dataFile"
        Write-Host "Template: $templateFile"
        Write-Host "Output: $outputDirBase"
    }
    catch {
        Write-Error "Failed to resolve paths for $SectionName. $_"
        return
    }

    # 1. Read Data
    $jsContent = Read-FileContent -Path $dataFile
    $posts = $null

    # Regex to find variable: const varName = [...]; or let varName = [...];
    # We use a flexible regex
    if ($jsContent -match "const $VarName\s*=\s*(\[[\s\S]*?\]);") {
        $jsonString = $matches[1]
    }
    elseif ($jsContent -match "let $VarName\s*=\s*(\[[\s\S]*?\]);") {
        $jsonString = $matches[1]
    }
    else {
        Write-Error "Could not find variable $VarName in $dataFile"
        return
    }

    try {
        $posts = $jsonString | ConvertFrom-Json
        Write-Host "Loaded $($posts.Count) posts."
    }
    catch {
        Write-Error "Failed to parse JSON for ${SectionName}: $_"
        return
    }

    # 2. Read Template
    $templateHtml = Read-FileContent -Path $templateFile

    # 3. Generate Pages
    foreach ($post in $posts) {
        $id = $post.id
        $title = $post.title
        $date = $post.date
        
        # Create Directory
        $postDir = Join-Path $outputDirBase $id
        if (!(Test-Path -Path $postDir)) {
            New-Item -ItemType Directory -Force -Path $postDir | Out-Null
        }

        # Prepare Content HTML & Schema Description
        $contentHtml = ""
        $desc = $title
        $imageForSchema = $null

        if ($Type -eq "block") {
            # Install, Promo (Block-based)
            $contentBlocks = $post.contentBlocks
            if ($contentBlocks) {
                foreach ($block in $contentBlocks) {
                    if ($block.type -eq "text") {
                        $text = $block.value -replace '(https?://[^\s]+)', '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:#3498db; text-decoration:underline;">$1</a>'
                        $text = $text -replace "`n", "<br>"
                        $contentHtml += "<div class='view-block-text'>$text</div>`n"
                    }
                    elseif ($block.type -eq "image") {
                        $imgSrc = $block.value
                        if ($imgSrc -notmatch "^http") { $imgSrc = "../../$imgSrc" }
                        $contentHtml += "<div class='view-block-image'><img src='$imgSrc' alt='Image'></div>`n"
                        if (!$imageForSchema) { $imageForSchema = $imgSrc }
                    }
                }
            }
            elseif ($post.content) {
                # Fallback
                $contentHtml = "<div class='view-block-text'>" + ($post.content -replace "`n", "<br>") + "</div>"
                if ($post.content.Length -gt 0) {
                    $desc = $post.content.Substring(0, [Math]::Min($post.content.Length, 150)) + "..."
                }
            }

            if (!$imageForSchema -and $post.image) { $imageForSchema = $post.image }

        }
        elseif ($Type -eq "simple") {
            # Product (Simple Content + Main Image)
            
            # Main Image logic
            $mainImgHtml = ""
            if ($post.image) {
                $imgSrc = $post.image
                if ($imgSrc -notmatch "^http") { $imgSrc = "../../$imgSrc" }
                $mainImgHtml = "<img id='viewImage' src='$imgSrc' style='max-width:100%; border-radius:4px;'>"
                $imageForSchema = $imgSrc
            }
            else {
                # Hide container if it exists, or empty image
                $mainImgHtml = "<!-- No Image -->" 
                # We can inject style to hide container later
            }

            # Content logic
            if ($post.content) {
                $linkedContent = $post.content -replace '(https?://[^\s]+)', '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:#3498db; text-decoration:underline;">$1</a>'
                $contentHtml = $linkedContent -replace "`n", "<br>"
                $desc = $post.content.Substring(0, [Math]::Min($post.content.Length, 150)) + "..."
            }
        }
        
        # Files logic (Common)
        $filesHtml = ""
        if ($post.files -and $post.files.Length -gt 0) {
            foreach ($f in $post.files) {
                $fPath = $f.path
                if ($fPath -notmatch "^http") { $fPath = "../../$fPath" }
                $filesHtml += "<a href='$fPath' class='file-link' target='_blank' rel='noopener noreferrer'>💾 $($f.name)</a>`n"
            }
            # We need to ensure container is visible
        }

        # Schema JSON Construction
        $descClean = $desc -replace "`r", "" -replace "`n", " " -replace '"', '\"'
        
        $authorJson = '{"@type": "Organization", "name": "Alpine Korea"}'
        $publisherJson = '{"@type": "Organization", "name": "Alpine Korea", "logo": {"@type": "ImageObject", "url": "https://alpine-korea.co.kr/assets/images/alpine_logo.png"}}'
        
        $schemaJson = "{
            `"@context`": `"https://schema.org`",
            `"@type`": `"TechArticle`",
            `"headline`": `"$title`",
            `"datePublished`": `"$date`",
            `"author`": $authorJson,
            `"publisher`": $publisherJson,
            `"description`": `"$descClean`""

        if ($imageForSchema) {
            $absImg = $imageForSchema -replace '^\.\./\.\./', 'https://alpine-korea.co.kr/' -replace '\\', '/'
            if ($absImg -notmatch "^http") { $absImg = "https://alpine-korea.co.kr/" + $absImg } # fallback
            $schemaJson += ", `"image`": `"$absImg`""
        }
        $schemaJson += "}"

        # Modify HTML
        $pageHtml = $templateHtml

        # 3.1 Adjust Relative Paths
        $pageHtml = $pageHtml -replace '(src|href)="\.\./', '$1="../../'

        # 3.2 Inject Title & Meta
        $pageHtml = $pageHtml -replace '<title>.*?</title>', "<title>$title - Alpine Korea</title>"
        $metaDesc = "<meta name='description' content='$descClean'>"
        $pageHtml = $pageHtml -replace '<head>', "<head>`r`n    $metaDesc"

        # 3.3 Inject Schema
        $schemaScript = "<script type='application/ld+json'>$schemaJson</script>"
        $pageHtml = $pageHtml -replace '</head>', "$schemaScript`r`n</head>"

        # 3.4 Inject Content & Fields
        $pageHtml = $pageHtml -replace '<h2 id="viewTitle" class="view-title">Title</h2>', "<h2 id='viewTitle' class='view-title'>$title</h2>"
        $pageHtml = $pageHtml -replace '<h2 id=''viewTitle'' class=''view-title''>Title</h2>', "<h2 id='viewTitle' class='view-title'>$title</h2>" # quote variation check
        $pageHtml = $pageHtml -replace '<span id="viewDate">Date</span>', "<span id='viewDate'>$date</span>"

        if ($Type -eq "block") {
            # Install & Promo
            $pageHtml = $pageHtml -replace '<!-- Blocks rendered here -->', $contentHtml
            # Also inject files if list exists
            if ($filesHtml) {
                $pageHtml = $pageHtml -replace '<div id="fileLinks"></div>', "<div id='fileLinks'>$filesHtml</div>"
                $pageHtml = $pageHtml -replace 'id="viewFiles" class="view-files" style="display:none;"', 'id="viewFiles" class="view-files" style="display:block;"'
            }
        }
        elseif ($Type -eq "simple") {
            # Product
            # Content
            $pageHtml = $pageHtml -replace '<div id="viewContent" class="view-content">Content</div>', "<div id='viewContent' class='view-content'>$contentHtml</div>"
             
            # Image
            if ($post.image) {
                # Replace the whole img tag or container content
                # Template: <img id="viewImage" src="" style="max-width:100%; border-radius:4px;">
                # Use Regex to replace the img tag or src attribute
                $pageHtml = $pageHtml -replace 'src="" style="max-width:100%; border-radius:4px;"', "src='$imgSrc' style='max-width:100%; border-radius:4px;'"
            }
            else {
                # Hide container
                $pageHtml = $pageHtml -replace 'id="viewImageContainer" style="margin-bottom:20px;"', 'id="viewImageContainer" style="margin-bottom:20px; display:none;"'
            }

            # Files
            if ($filesHtml) {
                $pageHtml = $pageHtml -replace '<div id="fileLinks"></div>', "<div id='fileLinks'>$filesHtml</div>"
                $pageHtml = $pageHtml -replace 'id="viewFiles" class="view-files" style="display:none;"', 'id="viewFiles" class="view-files" style="display:block;"'
            }
        }

        # 3.6 Toggle Display States
        $pageHtml = $pageHtml -replace 'id="boardListSection" class="board-container"', 'id="boardListSection" class="board-container" style="display:none;"'
        $pageHtml = $pageHtml -replace 'id="boardView" class="board-container view-post"', 'id="boardView" class="board-container view-post" style="display:block;"'

        # 3.7 Disable internal routing
        $pageHtml = $pageHtml -replace 'handleRouting\(\);', '// handleRouting(); // Static Page'
        
        # 3.8 Fix "List" button
        # Different pages have different filenames
        $listPageName = "$SectionName.html"
        $locationStr = 'onclick="location.href=''../../support/' + $listPageName + '''"'
        $pageHtml = $pageHtml -replace 'onclick="closeView\(\)"', $locationStr

        # Save File
        $outFile = Join-Path $postDir "index.html"
        Write-FileContent -Path $outFile -Content $pageHtml
    }
}

# Run for Install
Generate-StaticPages -SectionName "install" -DataFileRelative ".\js\install-data.js" -TemplateFileRelative ".\support\install.html" -OutputDirRelative ".\support\install" -VarName "initialInstallData" -Type "block"

# Run for Product
Generate-StaticPages -SectionName "product" -DataFileRelative ".\js\support-product-data.js" -TemplateFileRelative ".\support\product.html" -OutputDirRelative ".\support\product" -VarName "initialSupportProductData" -Type "simple"

# Run for Promo
Generate-StaticPages -SectionName "promo" -DataFileRelative ".\js\promo-data.js" -TemplateFileRelative ".\support\promo.html" -OutputDirRelative ".\support\promo" -VarName "initialPromoData" -Type "block"

Write-Host "All Sections Generated."
