const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tlgjgworselvkaatdftz.supabase.co';
const supabaseKey = 'sb_publishable_BU3f4Oon_hKsgWO-9h7Haw_pbXJGgyO';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    const { data, error } = await supabase
        .from('price_list')
        .select('*')
        .order('id', { ascending: true });
        
    if (error) {
        console.error('Error:', error);
        return;
    }
    
    // Group by category+product
    const groups = {};
    data.filter(d => d.product && d.product.trim() !== '').forEach(item => {
        const key = `${item.category}|${item.product_category}|${item.product}`;
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
    });
    
    // Find groups with > 1 item
    const duplicates = Object.values(groups).filter(g => g.length > 1);
    console.log(`There are ${duplicates.length} products that have duplicates.`);
    
    if (duplicates.length > 0) {
        console.log("Example duplicate group 1:");
        console.log(duplicates[0]);
        console.log("Example duplicate group 2:");
        console.log(duplicates[1]);
    }
}

checkData();
