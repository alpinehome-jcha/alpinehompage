const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tlgjgworselvkaatdftz.supabase.co';
const supabaseKey = 'sb_publishable_BU3f4Oon_hKsgWO-9h7Haw_pbXJGgyO';
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
