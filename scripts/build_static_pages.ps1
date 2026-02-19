$ErrorActionPreference = "Stop"

# Use Relative Paths based on current location
# Expected execution from project root: d:\안티그래피티 work\alpinehompage
$currentDir = Get-Location
Write-Host "Current Working Directory: $currentDir"

$dataFileRaw = ".\js\install-data.js"
$templateFileRaw = ".\support\install.html"
$outputDirBaseRaw = ".\support\install"

# Resolve absolute paths to ensure .NET methods work
try {
    $dataFile = (Resolve-Path $dataFileRaw).Path
    $templateFile = (Resolve-Path $templateFileRaw).Path
    # For output directory, it might be a folder that exists or not.
    # We resolve the parent and append.
    $outputDirBaseParent = (Resolve-Path ".\support").Path
    $outputDirBase = Join-Path $outputDirBaseParent "install"
    
    Write-Host "Data File: $dataFile"
    Write-Host "Template File: $templateFile"
    Write-Host "Output Dir: $outputDirBase"
}
catch {
    Write-Error "Failed to resolve paths. Make sure you are in the project root."
    Write-Error $_
    exit 1
}

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

# 1. Read Data
Write-Host "Reading data..."
$jsContent = Read-FileContent -Path $dataFile

# Extract JSON array using Regex
if ($jsContent -match 'const initialInstallData = (\[[\s\S]*?\]);') {
    $jsonString = $matches[1]

    try {
        $posts = $jsonString | ConvertFrom-Json
        Write-Host "Loaded $($posts.Count) posts."
    }
    catch {
        Write-Error "Failed to parse JSON content: $_"
        exit 1
    }
}
else {
    Write-Error "Could not find initialInstallData array in $dataFile"
    exit 1
}

# 2. Read Template
Write-Host "Reading template..."
$templateHtml = Read-FileContent -Path $templateFile

# 3. Generate Pages
foreach ($post in $posts) {
    $id = $post.id
    $title = $post.title
    $date = $post.date
    $contentBlocks = $post.contentBlocks
    
    Write-Host "Processing Post $id"

    # Create Directory
    $postDir = Join-Path $outputDirBase $id
    if (!(Test-Path -Path $postDir)) {
        New-Item -ItemType Directory -Force -Path $postDir | Out-Null
    }

    # Prepare Content HTML
    $contentHtml = ""
    if ($contentBlocks) {
        foreach ($block in $contentBlocks) {
            if ($block.type -eq "text") {
                $text = $block.value -replace '(https?://[^\s]+)', '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:#3498db; text-decoration:underline;">$1</a>'
                $text = $text -replace "`n", "<br>"
                $contentHtml += "<div class='view-block-text'>$text</div>`n"
            }
            elseif ($block.type -eq "image") {
                $imgSrc = $block.value
                if ($imgSrc -notmatch "^http") {
                    $imgSrc = "../../$imgSrc"
                }
                $contentHtml += "<div class='view-block-image'><img src='$imgSrc' alt='Image'></div>`n"
            }
        }
    }
    elseif ($post.content) {
        $contentHtml = "<div class='view-block-text'>" + ($post.content -replace "`n", "<br>") + "</div>"
    }

    # Prepare Schema.org JSON-LD
    $desc = $title
    if ($post.content) {
        $desc = $post.content.Substring(0, [Math]::Min($post.content.Length, 150)) + "..."
        $desc = $desc -replace "`r", "" -replace "`n", " " -replace '"', '\"'
    }
    
    # Manually constructing JSON to avoid depth issues or excessive quoting in old PS
    $authorJson = '{"@type": "Organization", "name": "Alpine Korea"}'
    $publisherJson = '{"@type": "Organization", "name": "Alpine Korea", "logo": {"@type": "ImageObject", "url": "https://alpine-korea.co.kr/assets/images/alpine_logo.png"}}'
    
    $schemaJson = "{
        `"@context`": `"https://schema.org`",
        `"@type`": `"TechArticle`",
        `"headline`": `"$title`",
        `"datePublished`": `"$date`",
        `"author`": $authorJson,
        `"publisher`": $publisherJson,
        `"description`": `"$desc`""

    # Add image to schema
    $firstImage = $contentBlocks | Where-Object { $_.type -eq "image" } | Select-Object -First 1
    if ($firstImage) {
        $imgUrl = $firstImage.value
        if ($imgUrl -notmatch "^http") {
            $imgUrl = "https://alpine-korea.co.kr/" + $imgUrl -replace '\\', '/'
        }
        $schemaJson += ", `"image`": `"$imgUrl`""
    }
    $schemaJson += "}"

    
    # Modify HTML
    $pageHtml = $templateHtml

    # 3.1 Adjust Relative Paths
    $pageHtml = $pageHtml -replace '(src|href)="\.\./', '$1="../../'

    # 3.2 Inject Title & Meta
    $pageHtml = $pageHtml -replace '<title>.*?</title>', "<title>$title - Alpine Korea</title>"
    $metaDesc = "<meta name='description' content='$desc'>"
    $pageHtml = $pageHtml -replace '<head>', "<head>`r`n    $metaDesc"

    # 3.3 Inject Schema
    $schemaScript = "<script type='application/ld+json'>$schemaJson</script>"
    $pageHtml = $pageHtml -replace '</head>', "$schemaScript`r`n</head>"

    # 3.4 Inject Content (SSR)
    # Using [regex]::Replace for robust replacement if string methods act up
    $pageHtml = $pageHtml -replace '<!-- Blocks rendered here -->', $contentHtml

    # 3.5 Set Title & Date in DOM
    $pageHtml = $pageHtml -replace '<h2 id="viewTitle" class="view-title">Title</h2>', "<h2 id='viewTitle' class='view-title'>$title</h2>"
    $pageHtml = $pageHtml -replace '<span id="viewDate">Date</span>', "<span id='viewDate'>$date</span>"

    # 3.6 Toggle Display States
    $pageHtml = $pageHtml -replace 'id="boardListSection" class="board-container"', 'id="boardListSection" class="board-container" style="display:none;"'
    $pageHtml = $pageHtml -replace 'id="boardView" class="board-container view-post"', 'id="boardView" class="board-container view-post" style="display:block;"'

    # 3.7 Disable internal routing
    $pageHtml = $pageHtml -replace 'handleRouting\(\);', '// handleRouting(); // Static Page'
    
    # 3.8 Fix "List" button
    $pageHtml = $pageHtml -replace 'onclick="closeView\(\)"', 'onclick="location.href=''../../support/install.html''"'

    # Save File
    $outFile = Join-Path $postDir "index.html"
    Write-FileContent -Path $outFile -Content $pageHtml
}

Write-Host "Done. Generated $( $posts.Count ) pages."
