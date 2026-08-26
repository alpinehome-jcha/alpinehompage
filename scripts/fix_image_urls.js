/**
 * fix_image_urls.js
 * product-data.js 내 raw.githubusercontent.com URL을 로컬 상대경로로 일괄 변환
 */

const fs = require('fs');
const path = require('path');

const RAW_PREFIX = 'https://raw.githubusercontent.com/alpinehome-jcha/alpinehompage/main/';

// product-data.js 로드 (Node.js에서 require 시 localStorage 없으므로 initialProductData 반환)
const productData = require('../js/product-data.js');

function fixUrl(url) {
    if (typeof url === 'string' && url.startsWith(RAW_PREFIX)) {
        return decodeURIComponent(url.slice(RAW_PREFIX.length));
    }
    return url;
}

let fixCount = 0;
const fixedProducts = [];

for (const product of productData) {
    let changed = false;

    // 메인 이미지
    const fixedImage = fixUrl(product.image);
    if (fixedImage !== product.image) {
        console.log(`[FIXED] "${product.title}" image:\n  ${product.image}\n  → ${fixedImage}`);
        product.image = fixedImage;
        fixCount++;
        changed = true;
    }

    // detailBlocks 이미지
    if (product.detailBlocks) {
        for (const block of product.detailBlocks) {
            if (block.type === 'image') {
                const fixedValue = fixUrl(block.value);
                if (fixedValue !== block.value) {
                    console.log(`  [FIXED] block image: ${path.basename(fixedValue)}`);
                    block.value = fixedValue;
                    fixCount++;
                    changed = true;
                }
            }
        }
    }

    fixedProducts.push(product);
}

console.log(`\n총 ${fixCount}개의 URL 변환 완료.`);

if (fixCount === 0) {
    console.log('변환할 URL이 없습니다. 종료.');
    process.exit(0);
}

// product-data.js 재생성 (admin-data-manager.js 의 saveToGitHub 와 동일한 형식)
const version = Date.now();
const jsonStr = JSON.stringify(fixedProducts, null, 4);

let fileContent = `const initialProductData = ${jsonStr};\n`;
fileContent += `const PRODUCT_DATA_VERSION = ${version};\n\n`;
fileContent += `let productData = [];\n`;
fileContent += `if (typeof localStorage !== 'undefined') {\n`;
fileContent += `    const storedVersion = localStorage.getItem('productDataVersion');\n`;
fileContent += `    const stored = localStorage.getItem('productData');\n\n`;
fileContent += `    if (typeof PRODUCT_DATA_VERSION !== 'undefined' && (!storedVersion || parseInt(storedVersion) < PRODUCT_DATA_VERSION)) {\n`;
fileContent += `        // Server has newer version, force update\n`;
fileContent += `        productData = JSON.parse(JSON.stringify(initialProductData));\n`;
fileContent += `        localStorage.setItem('productData', JSON.stringify(productData));\n`;
fileContent += `        localStorage.setItem('productDataVersion', PRODUCT_DATA_VERSION.toString());\n`;
fileContent += `    } else if (stored) {\n`;
fileContent += `        productData = JSON.parse(stored);\n`;
fileContent += `        // Safety Check for empty data\n`;
fileContent += `        if (productData.length === 0 && initialProductData.length > 0) {\n`;
fileContent += `             productData = JSON.parse(JSON.stringify(initialProductData));\n`;
fileContent += `             localStorage.setItem('productData', JSON.stringify(productData));\n`;
fileContent += `             if (typeof PRODUCT_DATA_VERSION !== 'undefined') localStorage.setItem('productDataVersion', PRODUCT_DATA_VERSION.toString());\n`;
fileContent += `        }\n`;
fileContent += `    } else {\n`;
fileContent += `        productData = JSON.parse(JSON.stringify(initialProductData));\n`;
fileContent += `        if (typeof PRODUCT_DATA_VERSION !== 'undefined') localStorage.setItem('productDataVersion', PRODUCT_DATA_VERSION.toString());\n`;
fileContent += `    }\n`;
fileContent += `} else {\n`;
fileContent += `    productData = initialProductData;\n`;
fileContent += `}\n\n`;
fileContent += `if (typeof window !== 'undefined') {\n`;
fileContent += `    window.productData = productData;\n`;
fileContent += `}\n\n`;
fileContent += `if (typeof module !== 'undefined' && module.exports) {\n`;
fileContent += `    module.exports = productData;\n`;
fileContent += `}`;

const outputPath = path.join(__dirname, '../js/product-data.js');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log('\njs/product-data.js 업데이트 완료.');
console.log('이제 커밋 & 푸시하면 SSG 재빌드 + 배포가 자동으로 실행됩니다.');
