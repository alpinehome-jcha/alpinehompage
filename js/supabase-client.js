const SC_DEFAULT_LOCAL_SUPABASE_URL = "https://supabase.alpine-korea.co.kr";
const SC_DEFAULT_LOCAL_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZ2pnd29yc2VsdmthYXRkZnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MTE4MTUsImV4cCI6MjA4NzM4NzgxNX0.GUiDsLVI3UNZdr8i5aQtSYkt44vqbrZ1OcuoYWzp7us";

const CLIENT_SUPABASE_URL = (typeof window !== 'undefined' && window.ENV && window.ENV.NEXT_PUBLIC_SUPABASE_URL)
    ? window.ENV.NEXT_PUBLIC_SUPABASE_URL
    : SC_DEFAULT_LOCAL_SUPABASE_URL;

const CLIENT_SUPABASE_ANON_KEY = (typeof window !== 'undefined' && window.ENV && window.ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    ? window.ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : SC_DEFAULT_LOCAL_SUPABASE_ANON_KEY;

// CDN 방식으로 Supabase JS를 사용하는 경우 (별도 로드 필요)
if (typeof supabase === 'undefined') {
    console.warn("Supabase SDK is not loaded. Make sure to include <script src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'></script> before this script.");
}

const supabaseClient = (typeof supabase !== 'undefined')
    ? supabase.createClient(CLIENT_SUPABASE_URL, CLIENT_SUPABASE_ANON_KEY, { db: { schema: 'public' } })
    : null;

// 공유를 위해 전역 변수로 설정 (기존 소스 호환성)
window.supabase = supabaseClient;

/**
 * 가격 데이터 전체를 가져옵니다.
 * @returns {Promise<Array>}
 */
async function fetchPriceList() {
    if (!window.supabase) return [];
    const client = window.supabase.schema ? window.supabase.schema('public') : window.supabase;
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

/**
 * 특정 역할(category)에 따른 가격 데이터를 가져옵니다.
 * @param {string} category 'master', 'team', 'style', 'region', 'dealer'
 * @returns {Promise<Array>}
 */
async function fetchPriceListByCategory(category) {
    if (category === 'admin') return fetchPriceList(); // admin은 전체 조회
    if (!window.supabase) return [];

    const client = window.supabase.schema ? window.supabase.schema('public') : window.supabase;
    const { data, error } = await client
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

/**
 * 제품 데이터 전체를 Supabase에서 가져옵니다.
 * product-data.js 의 productData 배열과 동일한 형태로 반환합니다.
 * @returns {Promise<Array|null>}
 */
async function fetchProductList() {
    if (!window.supabase) return null;

    try {
        const client = window.supabase.schema ? window.supabase.schema('public') : window.supabase;
        const { data, error } = await client
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (error || !data || data.length === 0) {
            console.warn('Error fetching product list from Supabase:', error);
            return null;
        }

        // Supabase 컬럼명 → JS 필드명 변환
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
    if (!window.supabase) return [];

    const { data, error } = await window.supabase
        .from('dealers')
        .select('*')
        .order('id', { ascending: true });

    if (error || !data) {
        console.warn('Error fetching DB dealer list:', error);
        return [];
    }

    return data;
}

// DOMContentLoaded 시점에 로딩 오버레이 동적 삽입
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
