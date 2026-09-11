const SC_DEFAULT_LOCAL_SUPABASE_URL = "https://supabase.alpine-korea.co.kr";
const SC_DEFAULT_LOCAL_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZ2pnd29yc2VsdmthYXRkZnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MTE4MTUsImV4cCI6MjA4NzM4NzgxNX0.GUiDsLVI3UNZdr8i5aQtSYkt44vqbrZ1OcuoYWzp7us";

const CLIENT_SUPABASE_URL = (typeof window !== 'undefined' && window.ENV && window.ENV.NEXT_PUBLIC_SUPABASE_URL)
    ? window.ENV.NEXT_PUBLIC_SUPABASE_URL
    : SC_DEFAULT_LOCAL_SUPABASE_URL;

const CLIENT_SUPABASE_ANON_KEY = (typeof window !== 'undefined' && window.ENV && window.ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    ? window.ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : SC_DEFAULT_LOCAL_SUPABASE_ANON_KEY;

if (typeof supabase === 'undefined') {
    console.warn("Supabase SDK is not loaded. Make sure to include <script src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'></script> before this script.");
}

async function getClient() {
    if (typeof loadSupabase === 'function') {
        return await loadSupabase();
    }
    console.warn('loadSupabase is not defined. Make sure auth.js is loaded.');
    return null;
}

async function fetchPriceList() {
    const client = await getClient();
    if (!client) return [];
    
    // loadSupabase uses 'alpine-home' by default. If price_list is there, it works directly.
    const { data, error } = await client
        .from('price_list')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching price list:', error);
        return [];
    }
    return data;
}

async function fetchPriceListByCategory(category) {
    if (category === 'admin') return fetchPriceList();
    const client = await getClient();
    if (!client) return [];

    const { data, error } = await client.schema('public')
        .from('price_list')
        .select('*')
        .eq('category', category)
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching filtered price list:', error);
        return [];
    }
    return data;
}

async function fetchProductList() {
    const client = await getClient();
    if (!client) return null;

    try {
        // products is in 'public' schema according to original code
        const { data, error } = await client.schema('public')
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (error || !data || data.length === 0) {
            console.warn('Error fetching product list from Supabase:', error);
            return null;
        }

        return data.map(row => ({
            id: row.id,
            category: row.category,
            title: row.title,
            desc: row.description || '',
            desc_bottom: row.desc_bottom || '',
            price: row.price,
            soldOut: row.sold_out || false,
            image: row.image || 'assets/images/product_placeholder.png',
            detailBlocks: row.detail_blocks || [],
            attachments: row.attachments || [],
            manualUrl: row.manual_url || '',
            slug: row.slug || '',
            sort_order: row.sort_order,
        }));
    } catch (e) {
        console.warn('Exception in fetchProductList:', e);
        return null;
    }
}

async function fetchDealerList() {
    const client = await getClient();
    if (!client) return [];

    const { data, error } = await client.from('dealers')
        .select('*')
        .order('id', { ascending: true });

    if (error || !data) {
        console.warn('Error fetching DB dealer list:', error);
        return [];
    }

    return data;
}

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('loadingOverlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.className = 'loading-overlay';
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: none; justify-content: center; align-items: center; z-index: 9999; flex-direction: column; color: #fff;';
        
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        spinner.style.cssText = 'border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 10px;';
        
        const style = document.createElement('style');
        style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
        document.head.appendChild(style);

        const text = document.createElement('div');
        text.id = 'loadingText';
        text.innerText = 'Processing...';

        overlay.appendChild(spinner);
        overlay.appendChild(text);
        document.body.appendChild(overlay);
    }
});

async function fetchPopupList() {
    const client = await getClient();
    if (!client) return [];
    try {
        const { data, error } = await client.from('popups').select('*').order('id', { ascending: true });
        if (error || !data) return [];
        return data;
    } catch (e) {
        return [];
    }
}

async function savePopup(popup) {
    const client = await getClient();
    if (!client) return;
    try {
        await client.from('popups').upsert([popup]);
    } catch (e) {}
}

async function deletePopupSupabase(id) {
    const client = await getClient();
    if (!client) return;
    try {
        await client.from('popups').delete().eq('id', id);
    } catch (e) {}
}

window.fetchPopupList = fetchPopupList;
window.savePopup = savePopup;
window.deletePopupSupabase = deletePopupSupabase;
window.fetchDealerList = fetchDealerList;

