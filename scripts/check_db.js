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
    
    console.log(`Total rows: ${data.length}`);
    
    // Check for duplicates
    const counts = {};
    let duplicates = 0;
    data.forEach(item => {
        const key = `${item.category}|${item.product_category}|${item.product}`;
        if (counts[key]) {
            counts[key]++;
            duplicates++;
        } else {
            counts[key] = 1;
        }
    });
    
    console.log(`Duplicate product entries found: ${duplicates}`);
    
    if (duplicates > 0) {
        // Show some examples of duplicates
        const exampleKey = 'style|F#1 Status|HDS-7909';
        console.log(`Showing duplicates for key: ${exampleKey}`);
        const dupes = data.filter(d => `${d.category}|${d.product_category}|${d.product}` === exampleKey);
        console.log(JSON.stringify(dupes, null, 2));
    }

    
    // Show top 5 sorted by id to see recent additions
    const recent = [...data].sort((a,b) => b.id - a.id).slice(0, 5);
    console.log('Most recent 5 entries:');
    console.log(recent);
}

checkData();
