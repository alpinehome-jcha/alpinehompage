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
