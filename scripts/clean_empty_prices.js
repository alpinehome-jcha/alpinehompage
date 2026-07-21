const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_LOCAL_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://183.101.105.167:8000';
const supabaseKey = process.env.NEXT_PUBLIC_LOCAL_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZ2pnd29yc2VsdmthYXRkZnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MTE4MTUsImV4cCI6MjA4NzM4NzgxNX0.GUiDsLVI3UNZdr8i5aQtSYkt44vqbrZ1OcuoYWzp7us';
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanData() {
    const { data, error } = await supabase
        .from('price_list')
        .select('*');
        
    if (error) {
        console.error('Error fetching data:', error);
        return;
    }
    
    // Find empty rows where product is totally empty (or only whitespace)
    const emptyRows = data.filter(d => !d.product || d.product.trim() === '');
    console.log(`Found ${emptyRows.length} empty rows to delete.`);
    
    if (emptyRows.length > 0) {
        const idsToDelete = emptyRows.map(r => r.id);
        
        // Delete them in batches of 100
        let deletedCount = 0;
        for (let i = 0; i < idsToDelete.length; i += 100) {
            const batchIds = idsToDelete.slice(i, i + 100);
            const { error: delError } = await supabase
                .from('price_list')
                .delete()
                .in('id', batchIds);
                
            if (delError) {
                console.error('Error deleting batch:', delError);
            } else {
                deletedCount += batchIds.length;
                console.log(`Deleted ${deletedCount}/${idsToDelete.length} rows...`);
            }
        }
        
        console.log(`Cleanup complete. Deleted ${deletedCount} empty rows.`);
    } else {
        console.log('No empty rows found. Database is clean.');
    }
}

cleanData();
