const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://tlgjgworselvkaatdftz.supabase.co', 'sb_publishable_BU3f4Oon_hKsgWO-9h7Haw_pbXJGgyO');

async function fixSortOrder() {
    console.log("Fixing KTX-990 category...");
    await supabase.from('price_list').update({ product_category: 'Alpine Status' }).eq('product', 'KTX-990');

    console.log("Fetching all data...");
    const { data: items } = await supabase.from('price_list').select('*');

    const categoryOrder = { 'master': 1, 'team': 2, 'style': 3, 'region': 4, 'dealer': 5 };
    const productOrder = {
        'F#1 Status': 1, 'Alpine Status': 2, 'DSP/AMP': 3, 'Speakers': 4,
        'PnP Cable': 5, '기타상품': 6, 'Alpine OEM Fit': 7, 'ALPINESTYLE': 8
    };

    console.log("Sorting items...");
    items.sort((a, b) => {
        const catA = categoryOrder[a.category] || 99;
        const catB = categoryOrder[b.category] || 99;
        if (catA !== catB) return catA - catB;

        const pCatA = productOrder[a.product_category] || 99;
        const pCatB = productOrder[b.product_category] || 99;
        if (pCatA !== pCatB) return pCatA - pCatB;

        if (a.sort_order !== undefined && b.sort_order !== undefined) {
            return a.sort_order - b.sort_order;
        }
        return a.product.localeCompare(b.product);
    });

    console.log("Preparing updates...");
    const updates = items.map((item, index) => ({
        id: item.id,
        category: item.category,
        product_category: item.product_category,
        product: item.product,
        sort_order: (index + 1) * 10 // Multiplied by 10 to allow easier future inserts
    }));

    console.log("Sending batches...");
    const chunkSize = 100;
    for (let i = 0; i < updates.length; i += chunkSize) {
        const chunk = updates.slice(i, i + chunkSize);
        const { error } = await supabase.from('price_list').upsert(chunk);
        if (error) {
            console.error("Error inserting batch", error);
        } else {
            console.log(`Sent batch ${i} to ${i + chunkSize}`);
        }
    }
    console.log('Done!');
}

fixSortOrder();
