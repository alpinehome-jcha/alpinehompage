const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tlgjgworselvkaatdftz.supabase.co';
const supabaseKey = 'sb_publishable_BU3f4Oon_hKsgWO-9h7Haw_pbXJGgyO';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    const { data, error } = await supabase
        .from('price_list')
        .select('*');
        
    if (error) {
        console.error('Error:', error);
        return;
    }
    
    const emptyRows = data.filter(d => !d.product || d.product.trim() === '');
    console.log(`Total rows: ${data.length}`);
    console.log(`Explicitly empty rows: ${emptyRows.length}`);
    
    if (emptyRows.length > 0) {
        // Group empty rows by category to see where they are
        const cats = {};
        emptyRows.forEach(r => {
            cats[r.category] = (cats[r.category] || 0) + 1;
        });
        console.log("Empty rows by category:", cats);
    }
}

checkData();
