/**
 * Alpine Traffic Analytics Tracking Script
 * Captures inbound paths, referrers, and keywords.
 */

(function () {
    // Utility to get URL parameters
    function getQueryParam(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    // Extract keyword from referrer (legacy/common search engine patterns)
    function extractKeyword(referrer) {
        if (!referrer) return null;
        
        // 1. Check UTM parameters first (highest priority)
        const utmTerm = getQueryParam('utm_term');
        if (utmTerm) return utmTerm;

        // 2. Check common search query parameters in the referrer URL
        const searchParams = ['q', 'query', 'p', 'wd', 'sq'];
        try {
            const refUrl = new URL(referrer);
            for (const param of searchParams) {
                const val = getQueryParam(param, referrer);
                if (val) return val;
            }
        } catch (e) {
            // Not a valid URL
        }

        return null;
    }

    async function logVisit() {
        // Wait for Supabase to be ready
        if (typeof window.supabase === 'undefined' || !window.supabase) {
            // Retry once after a short delay
            setTimeout(logVisit, 1000);
            return;
        }

        const referrer = document.referrer;
        let referrerHost = 'Direct / Bookmark';
        try {
            if (referrer) {
                const url = new URL(referrer);
                referrerHost = url.hostname;
                // Clean up hostname (e.g., search.naver.com -> naver.com)
                if (referrerHost.includes('naver.com')) referrerHost = 'naver.com';
                else if (referrerHost.includes('google')) referrerHost = 'google.com';
                else if (referrerHost.includes('daum.net')) referrerHost = 'daum.net';
                else if (referrerHost.includes('bing.com')) referrerHost = 'bing.com';
                else if (referrerHost.includes(window.location.hostname)) return; // Internal traffic ignore
            }
        } catch (e) {
            // Ignore invalid referrer
        }

        const keyword = extractKeyword(referrer);
        const pagePath = window.location.pathname + window.location.search;
        const userAgent = navigator.userAgent;

        // Session handling
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
            sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('analytics_session_id', sessionId);
        }

        try {
            const { error } = await window.supabase.from('inbound_analytics').insert([{
                referrer: referrer || null,
                referrer_host: referrerHost,
                page_path: pagePath,
                keyword: keyword || null,
                query_params: window.location.search || null,
                user_agent: userAgent,
                session_id: sessionId
            }]);

            if (error) console.warn('[Analytics] Log error:', error.message);
        } catch (e) {
            console.warn('[Analytics] Exception:', e.message);
        }
    }

    // Start tracking when page is loaded
    if (document.readyState === 'complete') {
        logVisit();
    } else {
        window.addEventListener('load', logVisit);
    }
})();
