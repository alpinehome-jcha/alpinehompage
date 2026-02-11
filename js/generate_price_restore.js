const fs = require('fs');

// Read product-data.js
const productContent = fs.readFileSync('d:/안티그래피티 work/alpinehompage/js/product-data.js', 'utf8');

// Extract JSON-like content of initialProductData
// We can't just require it because it's a const declaration, not module.exports.
// So we eval it or parse it.
// Simple way: find the start of array and end.
const start = productContent.indexOf('[');
const end = productContent.lastIndexOf(']');
const jsonStr = productContent.substring(start, end + 1);

let products = [];
try {
    // eval to handle loose JSON (keys without quotes if any, though the file viewed had quotes)
    // But safely, let's try JSON.parse first if it's strict JSON.
    // The viewed file had "id": ... so it looks like JSON.
    products = JSON.parse(jsonStr);
} catch (e) {
    // If simple parse fails (comments, trailing commas), use eval
    // Mocking the variable to capture it
    console.log('JSON parse failed, trying eval substitution');
    // This is risky if file has arbitrary code, but we trust it's data.
    // Let's rely on string manipulation to make it parsable if needed, or just manual extraction.
    // Actually, let's just use a regex to extract fields we need.
}

if (products.length === 0) {
    // Regex fallback
    const regex = /"category":\s*"([^"]+)",[\s\S]*?"title":\s*"([^"]+)",[\s\S]*?"price":\s*([0-9]+)/g;
    let match;
    while ((match = regex.exec(productContent)) !== null) {
        products.push({
            category: match[1],
            title: match[2],
            price: parseInt(match[3])
        });
    }
}

// Generate Price Data items (for 'master' category)
const priceItems = products.map(p => ({
    category: 'master',
    productCategory: p.category,
    product: p.title,
    msrp: p.price,
    distPrice: '-', // Default
    dealerPrice: '-' // Default
}));

// Output the new array content
console.log(JSON.stringify(priceItems, null, 4));
