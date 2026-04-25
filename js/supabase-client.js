// Supabase Client 초기화
// 이 파일은 모든 Supabase를 이용하는 페이지에서 공통으로 로드합니다.

// config.js가 로드되지 않은 경우 폴백 (안전 장치)
if (!window.CONFIG) {
    console.warn("CONFIG is not loaded. Using default cloud settings.");
    window.CONFIG = {
        DB_MODE: 'cloud',
        CLOUD: {
            URL: "https://tlgjgworselvkaatdftz.supabase.co",
            ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZ2pnd29yc2VsdmthYXRkZnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MTE4MTUsImV4cCI6MjA4NzM4NzgxNX0.GUiDsLVI3UNZdr8i5aQtSYkt44vqbrZ1OcuoYWzp7us"
        },
        get current() { return this.CLOUD; }
    };
}

const CLIENT_SUPABASE_URL = window.CONFIG.current.URL;
const CLIENT_SUPABASE_ANON_KEY = window.CONFIG.current.ANON_KEY;

// CDN 방식으로 Supabase JS를 사용하는 경우 (별도 로드 필요)
if (typeof supabase === 'undefined') {
    console.warn("Supabase SDK is not loaded. Make sure to include <script src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'></script> before this script.");
}

const supabaseClient = (typeof supabase !== 'undefined')
    ? supabase.createClient(CLIENT_SUPABASE_URL, CLIENT_SUPABASE_ANON_KEY)
    : null;

// 공유를 위해 전역 변수로 설정 (기존 소스 호환성)
window.supabase = supabaseClient;

/**
 * 가격 데이터 전체를 가져옵니다.
 * @returns {Promise<Array>}
 */
async function fetchPriceList() {
    const { data, error } = await window.supabase
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

    const { data, error } = await window.supabase
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
 * 대리점 데이터 전체를 가져옵니다.
 * @returns {Promise<Array>}
 */
async function fetchDealerList() {
    const { data, error } = await window.supabase
        .from('dealers')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error('Error fetching dealer list:', error);
        return [];
    }
    return data;
}

/**
 * 대리점 데이터를 추가/수정합니다 (Upsert)
 * @param {Object} dealerData
 * @returns {Promise<boolean>}
 */
async function upsertDealer(dealerData) {
    const { error } = await window.supabase
        .from('dealers')
        .upsert(dealerData);

    if (error) {
        console.error('Error upserting dealer:', error);
        return false;
    }
    return true;
}

/**
 * 대리점 데이터를 삭제합니다.
 * @param {number} dealerId
 * @returns {Promise<boolean>}
 */
async function deleteDealer(dealerId) {
    const { error } = await window.supabase
        .from('dealers')
        .delete()
        .eq('id', dealerId);

    if (error) {
        console.error('Error deleting dealer:', error);
        return false;
    }
    return true;
}
