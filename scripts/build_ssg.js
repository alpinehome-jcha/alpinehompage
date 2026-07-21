const fs = require('fs');
const path = require('path');
const productData = require('../js/product-data.js');

const rootDir = path.join(__dirname, '..');
const pagesDir = path.join(rootDir, 'pages');
const productsDir = path.join(pagesDir, 'products');

// Ensure products directory exists
if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
}

// Ensure support subdirectories exist safely
['product', 'install', 'promo'].forEach(dir => {
    const p = path.join(rootDir, 'support', dir);
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

const templatePath = path.join(pagesDir, 'detail.html');
const templateHtml = fs.readFileSync(templatePath, 'utf8');

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-가-힣]+/g, '')  // Remove non-word chars (allow Korean)
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end
}

// Converts URLs in plain text to clickable <a> links
function linkify(text) {
    if (!text) return '';
    const urlRegex = /(https?:\/\/[^\s\n<>"]+)/g;
    return text.replace(urlRegex, url => `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#007bff; word-break:break-all;">${url}</a>`);
}

function generateProductHtml(product) {
    const slug = slugify(product.title) || product.id.toString();
    const cleanDesc = (product.desc || '').replace(/"/g, '&quot;').replace(/\n/g, ' ');
    const ogImage = product.image ? `https://alpine-korea.co.kr/${product.image.replace('../', '').replace(/^\//, '')}` : '';
    const encodedSlug = encodeURIComponent(slug);
    const pageUrl = `https://alpine-korea.co.kr/pages/products/${encodedSlug}.html`;

    const seoTags = `
    <!-- SEO_META_TAGS -->
    <meta name="description" content="${cleanDesc}">
    <meta property="og:title" content="${product.title} | 알파인 코리아">
    <meta property="og:description" content="${cleanDesc}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:type" content="product">
    <link rel="canonical" href="${pageUrl}">
    <script>
        window.STATIC_PRODUCT_ID = ${product.id};
    </script>
    `;

    // We replace the SEO placeholder and title
    let html = templateHtml.replace(/<!-- SEO_META_TAGS -->\s*<title>.*?<\/title>/s, `${seoTags}\n    <title>${product.title} | 알파인(ALPINE Korea)</title>`);

    // We need to fix relative links from pages/ to pages/products/
    // detail.html uses `../css/` and `../assets/`. From `pages/products/`, these should be `../../css/` and `../../assets/`.
    // We only replace exact strings for safety.
    html = html.replace(/href="\.\.\//g, 'href="../../');
    html = html.replace(/src="\.\.\//g, 'src="../../');
    
    // Updated regex to include dots, underscores, dashes, and Korean characters (가-힣)
    // Matches local links like about.html and converts them to ../about.html
    html = html.replace(/href="([a-zA-Z0-9_\-\.\/가-힣]+)\.html"/g, 'href="../$1.html"');

    const priceDisplay = '₩' + product.price.toLocaleString();

    let blocksHTML = '';
    if (product.detailBlocks && product.detailBlocks.length > 0) {
        product.detailBlocks.forEach(block => {
            if (block.type === 'text') {
                blocksHTML += `
                            <div class="detail-content-item">
                                <p class="detail-content-text">${linkify(block.value)}</p>
                            </div>
                `;
            } else if (block.type === 'image') {
                const imgPath = block.value.startsWith('http') ? block.value : '../../' + block.value.replace('../', '');
                blocksHTML += `
                            <div class="detail-content-item">
                                <img src="${imgPath}" alt="Product Detail" loading="lazy" onerror="this.style.display='none'">
                            </div>
                `;
            } else if (block.type === 'html') {
                blocksHTML += `
                            <div class="detail-content-item" style="overflow-x: auto; max-width: 1000px; margin: 0 auto 30px;">
                                ${block.value}
                            </div>
                `;
            }
        });
    } else {
        if (product.detailImage) {
            const imgPath = product.detailImage.startsWith('http') ? product.detailImage : '../../' + product.detailImage.replace('../', '');
            blocksHTML += `
                        <div class="detail-content-item">
                            <img src="${imgPath}" alt="Detail Image">
                        </div>
            `;
        }
        if (product.detailDesc) {
            blocksHTML += `
                        <div class="detail-content-item">
                            <p class="detail-content-text">${product.detailDesc}</p>
                        </div>
            `;
        }
    }

    let attachmentsHTML = '';
    if (product.attachments && product.attachments.length > 0) {
        attachmentsHTML += `<div style="margin-top: 20px; padding-top: 20px; border-top: 1px dashed #ddd;">`;
        attachmentsHTML += `<strong style="display: block; margin-bottom: 10px; color: #555;">Downloads:</strong>`;
        attachmentsHTML += `<div style="display: flex; flex-direction: column; gap: 8px;">`;
        product.attachments.forEach(att => {
            const attPath = att.url.startsWith('http') ? att.url : '../../' + att.url.replace('../', '');
            attachmentsHTML += `
                        <a href="${attPath}" download target="_blank" style="display: flex; align-items: center; font-size: 0.95rem; text-decoration: none; color: #007bff; transition: color 0.2s;">
                            <span style="margin-right: 8px;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            </span>
                            ${att.name}
                        </a>
            `;
        });
        attachmentsHTML += `</div></div>`;
    }

    const mainImgPath = product.image.startsWith('http') ? product.image : '../../' + product.image.replace('../', '');

    const productHtmlContent = `
                <div class="detail-header">
                    <div class="detail-main-image" style="position: relative;">
                        ${product.soldOut ? '<div style="position: absolute; top: 20px; right: 20px; background: rgba(220, 53, 69, 0.9); color: #fff; padding: 10px 20px; font-weight: bold; border-radius: 5px; font-size: 1.2rem; border: 2px solid #fff;">SOLD OUT</div>' : ''}
                        <img src="${mainImgPath}" alt="${product.title}">
                    </div>
                    <div class="detail-info">
                        <div class="detail-category">${product.category}</div>
                        <h1 class="detail-title">${product.title}</h1>
                        <p class="detail-summary">${product.desc}</p>
                        <div class="detail-price">
                            ${priceDisplay} 
                            ${product.soldOut ? '<span style="color: #d9534f; font-size: 1rem; margin-left: 10px;">(품절 / SOLD OUT)</span>' : ''}
                        </div>
                        <p class="detail-summary">${product.desc_bottom !== undefined ? product.desc_bottom : product.desc}</p>
                        ${attachmentsHTML}
                    </div>
                </div>
                
                <div class="detail-content">
                    ${blocksHTML || `
                        <div style="text-align: center; color: #999; padding: 40px;">
                            상세 정보가 등록되지 않았습니다.
                        </div>
                    `}
                </div>
    `;

    // Inject static content
    html = html.replace(
        /<!-- PRODUCT_DETAIL_CONTENT_START -->.*?<!-- PRODUCT_DETAIL_CONTENT_END -->/s, 
        `<!-- PRODUCT_DETAIL_CONTENT_START -->\n${productHtmlContent}\n<!-- PRODUCT_DETAIL_CONTENT_END -->`
    );

    const outPath = path.join(productsDir, `${slug}.html`);
    fs.writeFileSync(outPath, html, 'utf8');

    return { slug, url: pageUrl };
}

console.log('Building Static Product Pages...');
const generatedUrls = [];

for (const product of productData) {
    if (product.title) {
        const info = generateProductHtml(product);
        generatedUrls.push(info.url);
        console.log(`Generated: pages/products/${info.slug}.html`);
    }
}

console.log(`Successfully generated ${generatedUrls.length} product pages.`);

// Update Sitemap
const sitemapPath = path.join(rootDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
    let sitemap = fs.readFileSync(sitemapPath, 'utf8');
    const today = new Date().toISOString().split('T')[0];

    // Simple parser: check if URL already exists, if not, append before </urlset>
    let added = 0;
    for (const url of generatedUrls) {
        // Ensure the URL comparison is robust
        if (!sitemap.includes(url)) {
            const urlEntry = `
  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
  </url>`;
            sitemap = sitemap.replace('</urlset>', `${urlEntry}\n</urlset>`);
            added++;
        }
    }

    if (added > 0) {
        fs.writeFileSync(sitemapPath, sitemap, 'utf8');
        console.log(`Added ${added} new product URLs to sitemap.xml`);
    } else {
        console.log('No new URLs to add to sitemap.xml');
    }
}

console.log('Build completed!');
