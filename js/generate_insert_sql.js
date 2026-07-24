const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'product-data.js'), 'utf8');

// Replace declarations to evaluate correctly
let initialProductData;
try {
    eval(content.replace('const initialProductData =', 'initialProductData =').replace('const productData =', 'initialProductData ='));
} catch (e) {
    console.error('Eval failed', e);
    process.exit(1);
}

const batchSize = 10;
const queries = [];

for (let i = 0; i < initialProductData.length; i += batchSize) {
    const batch = initialProductData.slice(i, i + batchSize);
    
    let sql = `SET search_path TO "alpine-home", public;\nINSERT INTO "alpine-home".products (id, category, title, description, desc_bottom, price, image, detail_blocks, sort_order, sub_category, model_name, spec_table, attachments, manual_url) VALUES\n`;
    
    const values = batch.map((p, idx) => {
        let sort_order = i + idx;
        let id = p.id || 'NULL';
        let category = p.category ? `'${p.category.replace(/'/g, "''")}'` : 'NULL';
        let title = p.title ? `'${p.title.replace(/'/g, "''")}'` : 'NULL';
        let description = p.desc ? `'${p.desc.replace(/'/g, "''")}'` : 'NULL';
        let desc_bottom = p.desc_bottom ? `'${p.desc_bottom.replace(/'/g, "''")}'` : 'NULL';
        let price = p.price || 0;
        let image = p.image ? `'${p.image.replace(/'/g, "''")}'` : 'NULL';
        let detail_blocks = p.detailBlocks ? `'${JSON.stringify(p.detailBlocks).replace(/'/g, "''")}'::jsonb` : 'NULL';
        let sub_category = p.sub_category ? `'${p.sub_category.replace(/'/g, "''")}'` : 'NULL';
        let model_name = p.model_name ? `'${p.model_name.replace(/'/g, "''")}'` : 'NULL';
        let spec_table = p.spec_table ? `'${JSON.stringify(p.spec_table).replace(/'/g, "''")}'::jsonb` : 'NULL';
        let attachments = p.attachments ? `'${JSON.stringify(p.attachments).replace(/'/g, "''")}'::jsonb` : 'NULL';
        let manual_url = p.manual_url ? `'${p.manual_url.replace(/'/g, "''")}'` : 'NULL';
        
        return `(${id}, ${category}, ${title}, ${description}, ${desc_bottom}, ${price}, ${image}, ${detail_blocks}, ${sort_order}, ${sub_category}, ${model_name}, ${spec_table}, ${attachments}, ${manual_url})`;
    }).join(',\n');
    
    sql += values + `\nON CONFLICT (id) DO NOTHING;`;
    queries.push(sql);
}

fs.writeFileSync(path.join(__dirname, 'queries.json'), JSON.stringify(queries, null, 2));
console.log(`Successfully generated ${queries.length} queries.`);
