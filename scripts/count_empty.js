const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_LOCAL_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://183.101.105.167:8000';
const supabaseKey = process.env.NEXT_PUBLIC_LOCAL_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZ2pnd29yc2VsdmthYXRkZnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MTE4MTUsImV4cCI6MjA4NzM4NzgxNX0.GUiDsLVI3UNZdr8i5aQtSYkt44vqbrZ1OcuoYWzp7us';
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
