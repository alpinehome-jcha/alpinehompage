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
