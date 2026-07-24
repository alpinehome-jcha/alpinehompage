const fs = require('fs');
const path = require('path');

// Read the product-data.js file
const jsFilePath = path.join(__dirname, 'product-data.js');
let content = fs.readFileSync(jsFilePath, 'utf8');

// Extract the initialProductData array string
const match = content.match(/const\s+initialProductData\s*=\s*(\[[\s\S]*?\]);\s*const\s+PRODUCT_DATA_VERSION/);
if (!match) {
    console.error("Could not find initialProductData in product-data.js");
    process.exit(1);
}

// Safely evaluate the array
let productData = [];
try {
    productData = eval(match[1]);
} catch (e) {
    console.error("Error parsing product data:", e);
    process.exit(1);
}

const queries = [];

productData.forEach(p => {
    // Escape single quotes for SQL
    const escapeSql = (str) => {
        if (str === null || str === undefined) return 'NULL';
        return "'" + String(str).replace(/'/g, "''") + "'";
    };

    const id = p.id;
    const category = escapeSql(p.category);
    const title = escapeSql(p.title);
    const desc = escapeSql(p.desc);
    const desc_bottom = escapeSql(p.desc_bottom);
    const price = p.price || 0;
    const image = escapeSql(p.image);
    
    let detailBlocksStr = 'NULL';
    if (p.detailBlocks && Array.isArray(p.detailBlocks)) {
        detailBlocksStr = escapeSql(JSON.stringify(p.detailBlocks)) + "::jsonb";
    }

    let attachmentsStr = 'NULL';
    if (p.attachments && Array.isArray(p.attachments)) {
        attachmentsStr = escapeSql(JSON.stringify(p.attachments)) + "::jsonb";
    }
    
    let manualUrlStr = 'NULL';
    if (p.manualUrl) {
        manualUrlStr = escapeSql(p.manualUrl);
    }

    const query = `INSERT INTO "alpine-home".products (id, category, title, description, desc_bottom, price, image, detail_blocks, attachments, manual_url) VALUES (${id}, ${category}, ${title}, ${desc}, ${desc_bottom}, ${price}, ${image}, ${detailBlocksStr}, ${attachmentsStr}, ${manualUrlStr}) ON CONFLICT (id) DO NOTHING;`;
    
    queries.push(query);
});

// Write to a SQL file
const sqlFilePath = path.join(__dirname, 'insert_products.sql');
fs.writeFileSync(sqlFilePath, queries.join('\n\n'), 'utf8');
console.log(`Successfully generated SQL for ${queries.length} products to insert_products.sql!`);
