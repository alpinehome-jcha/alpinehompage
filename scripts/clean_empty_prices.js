const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_LOCAL_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
    console.error("NEXT_PUBLIC_LOCAL_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY가 .env.local에 설정되어 있어야 합니다.");
    process.exit(1);
}
// service_role 키는 RLS/권한 우회 필요(관리 스크립트 전용) + alpine-home이 실제 운영 스키마
const supabase = createClient(supabaseUrl, supabaseKey, { db: { schema: "alpine-home" } });

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
