const fs = require('fs');
const path = require('path');
const productData = require('../js/product-data.js');

const rootDir = path.join(__dirname, '..');

function slugify(text) {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-가-힣]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

const idToSlug = {};
productData.forEach(p => {
    idToSlug[p.id] = p.slug || slugify(p.title) || p.id.toString();
});

function walkSync(dir, filelist = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            // skip node_modules, .git, etc.
            if (!filepath.includes('node_modules') && !filepath.includes('.git') && !filepath.includes('.gemini')) {
                filelist = walkSync(filepath, filelist);
            }
        } else {
            if (filepath.endsWith('.html') || filepath.endsWith('.js')) {
                filelist.push(filepath);
            }
        }
    }
    return filelist;
}

const files = walkSync(rootDir);
let replaceCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Replace static links: href="...pages/detail.html?id=123" -> href="...pages/products/slug.html"
    const regex1 = /(href|onclick)="([^"]*?)pages\/detail\.html\?id=(\d+)"/g;
    content = content.replace(regex1, (match, attr, prefix, idStr) => {
        const id = parseInt(idStr, 10);
        const slug = idToSlug[id];
        if (slug) {
            changed = true;
            return `${attr}="${prefix}pages/products/${slug}.html"`;
        }
        return match;
    });

    // Replace absolute links like https://www.alpine-korea.co.kr/pages/detail.html?id=123
    const regex2 = /https?:\/\/(?:www\.)?alpine-korea\.co\.kr\/pages\/detail\.html\?id=(\d+)/g;
    content = content.replace(regex2, (match, idStr) => {
        const id = parseInt(idStr, 10);
        const slug = idToSlug[id];
        if (slug) {
            changed = true;
            return `https://www.alpine-korea.co.kr/pages/products/${slug}.html`;
        }
        return match;
    });

    // We also need to fix `window.location.href='pages/products/${slugify(product.title) || product.id}.html'` in index.html
    // Oh wait, in JS template literals: pages/products/${slugify(product.title) || product.id}.html
    const regex3 = /pages\/detail\.html\?id=\$\{([a-zA-Z0-9_.]+)\.id\}/g;
    content = content.replace(regex3, (match, varName) => {
        changed = true;
        return `pages/products/\${slugify(${varName}.title) || ${varName}.id}.html`;
    });

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated links in: ${file.replace(rootDir, '')}`);
        replaceCount++;
    }
});

console.log(`Updated links in ${replaceCount} files.`);
