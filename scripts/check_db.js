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
