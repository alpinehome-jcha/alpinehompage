const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tlgjgworselvkaatdftz.supabase.co';
const supabaseKey = 'sb_publishable_BU3f4Oon_hKsgWO-9h7Haw_pbXJGgyO';
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to escape CSV fields
function escapeCSV(val) {
    if (val === null || val === undefined) {
        return '';
    }
    let str = String(val);
    // Replace double quotes with double-double quotes
    str = str.replace(/"/g, '""');
    // If it contains comma, double quote, or newline, wrap it in double quotes
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str}"`;
    }
    return str;
}

async function exportDealersToCSV() {
    console.log('Fetching dealer data from Supabase...');
    const { data: dealers, error } = await supabase
        .from('dealers')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error('Error fetching dealers:', error);
        return;
    }

    console.log(`Fetched ${dealers.length} dealers. Formatting to CSV...`);

    // Define CSV headers
    const headers = [
        'ID',
        '구분(Category)',
        '대리점명(Name)',
        '뱃지(Badge)',
        '지역(Region)',
        '주소(Address)',
        '전화번호(Phone)',
        '설명(Description)',
        '아이디(Username)',
        '위도(Latitude)',
        '경도(Longitude)',
        '홈페이지(Homepage)',
        '등록일시(Created At)',
        '수정일시(Updated At)'
    ];

    const rows = [headers];

    dealers.forEach(d => {
        rows.push([
            d.id,
            d.category,
            d.name,
            d.badge,
            d.region,
            d.address,
            d.phone,
            d.desc,
            d.username,
            d.lat,
            d.lng,
            d.homepage,
            d.created_at,
            d.updated_at
        ]);
    });

    // Convert to CSV string
    const csvContent = rows.map(r => r.map(escapeCSV).join(',')).join('\r\n');

    // Add UTF-8 BOM (\ufeff) to make Excel open it correctly in Korean
    const bomCsvContent = '\ufeff' + csvContent;

    const outputPath = path.join(__dirname, '../dealers_list.csv');
    fs.writeFileSync(outputPath, bomCsvContent, 'utf-8');

    console.log(`Successfully exported dealers to ${outputPath}`);
}

exportDealersToCSV();
