const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_LOCAL_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://183.101.105.167:8000';
const supabaseKey = process.env.NEXT_PUBLIC_LOCAL_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZ2pnd29yc2VsdmthYXRkZnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MTE4MTUsImV4cCI6MjA4NzM4NzgxNX0.GUiDsLVI3UNZdr8i5aQtSYkt44vqbrZ1OcuoYWzp7us';
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
