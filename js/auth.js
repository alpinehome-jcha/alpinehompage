// Role-Based Auth Logic - Supabase Edition
const AUTH_KEY = 'isLoggedIn';
const ROLE_KEY = 'userRole';

// ============================================================
// Supabase Configuration
// ============================================================
const SUPABASE_URL = 'https://tlgjgworselvkaatdftz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZ2pnd29yc2VsdmthYXRkZnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MTE4MTUsImV4cCI6MjA4NzM4NzgxNX0.GUiDsLVI3UNZdr8i5aQtSYkt44vqbrZ1OcuoYWzp7us';

// Load Supabase SDK dynamically (CDN)
async function loadSupabase() {
    if (window._supabaseClient) return window._supabaseClient;

    // Check if the global supabase object from CDN exists
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        window._supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        return window._supabaseClient;
    }

    // Check if window.supabase is already a client (from supabase-client.js)
    if (window.supabase && typeof window.supabase.from === 'function') {
        window._supabaseClient = window.supabase;
        return window._supabaseClient;
    }

    if (typeof supabase === 'undefined') {
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = resolve;
            script.onerror = () => reject(new Error('Supabase CDN 로드 실패'));
            document.head.appendChild(script);
        });
    }
    window._supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return window._supabaseClient;
}

// ============================================================
// Fallback Credentials (하드코딩 - 비상용 / Supabase 불가 시)
// ============================================================
const USERS = {
    'alpineaudio': { pass: '6198107276aa!!', role: 'admin' },
    'master': { pass: 'master123', role: 'master' },
    'team': { pass: 'team123', role: 'team' },
    'style': { pass: 'style123', role: 'style' },
    'region': { pass: 'region123', role: 'region' },
    'dealer': { pass: 'dealer123', role: 'dealer' }
};

const FRIENDLY_NAMES = {
    'alpineaudio': '관리자',
    'master': 'Sound Master',
    'team': 'Team Alpine',
    'style': 'Alpine Style',
    'region': 'Regional Dist',
    'dealer': 'Dealer'
};

const auth = {
    loadSupabase: loadSupabase,
    // Expose Shared Config removed.
    // sharedConfig: {},


    // Helper to load GitHub Client
    loadGitHubClient: () => {
        return new Promise((resolve, reject) => {
            if (typeof ghClient !== 'undefined') {
                resolve();
                return;
            }

            const script = document.createElement('script');
            // Determine path based on location
            const isInPages = window.location.pathname.includes('/pages/');
            const isInSupport = window.location.pathname.includes('/support/');
            let scriptPath = 'js/github-client.js';
            if (isInPages) scriptPath = '../js/github-client.js';
            else if (isInSupport) scriptPath = '../js/github-client.js';
            else if (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html')) scriptPath = 'js/github-client.js';
            else scriptPath = 'js/github-client.js'; // Fallback

            script.src = scriptPath + '?v=202602162250';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load ' + scriptPath));
            document.head.appendChild(script);
        });
    },

    login: async (username, password) => {
        // ── 1순위: Supabase RPC 로그인 ──────────────────────────────
        try {
            const client = await loadSupabase();
            const { data, error } = await client.rpc('verify_login', {
                p_username: username,
                p_password: password
            });

            if (!error) {
                // DB에 계정이 있지만 비밀번호 틀림 → 즉시 실패 (폴백 없음)
                if (data && data.error === 'wrong_password') {
                    return false;
                }
                // 로그인 성공
                if (data && !data.error) {
                    const role = data.role || 'dealer';
                    const dealerName = data.dealer_name || username;

                    sessionStorage.setItem(AUTH_KEY, 'true');
                    sessionStorage.setItem(ROLE_KEY, role);
                    sessionStorage.setItem('dealerName', dealerName);
                    sessionStorage.setItem('currentUser', username);

                    await saveVisitLog({
                        date: new Date().toLocaleString('ko-KR'),
                        username: username,
                        name: dealerName,
                        role: role
                    });
                    return true;
                }
                // data === null: DB에 없는 계정 → USERS 폴백 시도
            }
            // error가 있을 때도 USERS 폴백 허용
        } catch (e) {
            console.warn('[Auth] Supabase 연결 실패, 비상 폴백 시도:', e.message);
        }

        // ── 2순위: 하드코딩 관리자 계정만 (비상용 fallback) ──────────
        const user = USERS[username];
        if (user && user.pass === password) {
            sessionStorage.setItem(AUTH_KEY, 'true');
            sessionStorage.setItem(ROLE_KEY, user.role);
            sessionStorage.setItem('dealerName', FRIENDLY_NAMES[username] || username);
            sessionStorage.setItem('currentUser', username);
            await saveVisitLog({
                date: new Date().toLocaleString('ko-KR'),
                username: username,
                name: FRIENDLY_NAMES[username] || username,
                role: user.role
            });
            return true;
        }

        return false;
    },
    changePassword: async (currentPass, newPass) => {
        const username = sessionStorage.getItem('currentUser');
        if (!username) return { success: false, message: '로그인이 필요합니다.' };

        // ── Supabase RPC 비밀번호 변경 (서버측 bcrypt 검증) ──────────
        try {
            const client = await loadSupabase();
            const { data: changed, error } = await client.rpc('update_password', {
                p_username: username,
                p_current_password: currentPass,
                p_new_password: newPass
            });
            if (error) throw error;
            if (changed === true) {
                // 관리자 패널 표시와 동기화 (localStorage 딜러 데이터 password 업데이트)
                try {
                    const storedDealers = localStorage.getItem('dealerData');
                    if (storedDealers) {
                        const dealers = JSON.parse(storedDealers);
                        const idx = dealers.findIndex(d => d.username === username);
                        if (idx !== -1) {
                            dealers[idx].password = newPass;
                            localStorage.setItem('dealerData', JSON.stringify(dealers));
                        }
                    }
                } catch (syncErr) {
                    console.warn('[Auth] localStorage 동기화 실패:', syncErr);
                }
                return { success: true, message: '비밀번호가 변경되었습니다.' };
            }

            return { success: false, message: '현재 비밀번호가 일치하지 않습니다.' };
        } catch (e) {
            console.error('[Auth] 비밀번호 변경 오류:', e.message);
            return { success: false, message: 'Supabase 연결 오류: ' + e.message };
        }
    },
    logout: () => {
        // Supabase DB 방식은 별도 서버 세션 없음 → sessionStorage 제거만 하면 됨
        sessionStorage.removeItem(AUTH_KEY);
        sessionStorage.removeItem(ROLE_KEY);
        sessionStorage.removeItem('dealerName');
        sessionStorage.removeItem('currentUser');

        const path = window.location.pathname;
        let redirectPath = 'index.html';

        if (path.includes('/pages/')) {
            redirectPath = '../index.html';
        } else if (path.includes('/support/')) {
            const parts = path.split('/support/')[1].split('/');
            if (parts.length > 2) redirectPath = '../../../index.html';
            else redirectPath = '../index.html';
        }

        window.location.href = redirectPath;
    },
    isLoggedIn: () => {
        return sessionStorage.getItem(AUTH_KEY) === 'true';
    },
    getRole: () => {
        return sessionStorage.getItem(ROLE_KEY);
    },
    checkAuthAndRedirect: () => {
        if (!auth.isLoggedIn()) {
            const path = window.location.pathname;
            let loginPath = 'pages/login.html'; // Default for root

            if (path.includes('/pages/')) {
                loginPath = 'login.html';
            } else if (path.includes('/support/')) {
                const parts = path.split('/support/')[1].split('/');
                // If deep (e.g. install/123/index.html -> len 3), go up 3 levels then to pages/
                if (parts.length > 2) loginPath = '../../../pages/login.html';
                else loginPath = '../pages/login.html';
            }

            window.location.href = loginPath;
        }
    },
    openGitHubSettings: (e) => {
        if (e) e.preventDefault();
        const modal = document.getElementById('ghSettingsModal');
        if (modal) {
            modal.style.display = 'block';
            // Load current values
            document.getElementById('global_gh_token').value = localStorage.getItem('github_token') || '';
            document.getElementById('global_gh_repo').value = localStorage.getItem('github_repo') || '';
            document.getElementById('global_gh_branch').value = localStorage.getItem('github_branch') || 'main';
        }
    },
    updateUI: () => {
        const isLogged = auth.isLoggedIn();
        const role = auth.getRole();

        // Inject Password Modal if not exists
        if (!document.getElementById('pwChangeModal')) {
            // ... (existing password modal logic implied)
        }

        // Inject GitHub Settings Modal if not exists
        if (!document.getElementById('ghSettingsModal')) {
            const ghModalHTML = `
                <div id="ghSettingsModal" style="display:none; position:fixed; z-index:9999; left:0; top:0; width:100%; height:100%; overflow:auto; background-color:rgba(0,0,0,0.4);">
                    <div style="background-color:#fefefe; margin:15% auto; padding:20px; border:1px solid #888; width:350px; border-radius:8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                        <h3 style="margin-top:0;">GitHub 설정</h3>
                        <p style="font-size:0.9rem; color:#666; margin-bottom:15px;">서버 저장을 위한 인증 정보를 입력하세요.</p>
                        <div style="margin-bottom:10px;">
                            <label style="display:block; margin-bottom:5px; font-weight:bold;">Personal Access Token</label>
                            <input type="password" id="global_gh_token" placeholder="ghp_..." style="width:100%; padding:8px; margin-bottom:10px; box-sizing:border-box; border:1px solid #ddd; border-radius:4px;">
                            
                            <label style="display:block; margin-bottom:5px; font-weight:bold;">Repository (owner/repo)</label>
                            <input type="text" id="global_gh_repo" placeholder="username/repository" style="width:100%; padding:8px; margin-bottom:5px; box-sizing:border-box; border:1px solid #ddd; border-radius:4px;">
                            
                            <label style="display:block; margin-bottom:5px; font-weight:bold;">Branch (Main/Master)</label>
                            <input type="text" id="global_gh_branch" placeholder="main" style="width:100%; padding:8px; margin-bottom:5px; box-sizing:border-box; border:1px solid #ddd; border-radius:4px;">
                        </div>
                        <div style="text-align:right;">
                            <button id="btnTestGh" style="padding:8px 12px; cursor:pointer; background:#17a2b8; color:white; border:none; border-radius:4px; margin-right:5px;">연결 테스트</button>
                            <button id="btnCancelGh" style="padding:8px 12px; cursor:pointer; background:#ccc; border:none; border-radius:4px; margin-right:5px;">닫기</button>
                            <button id="btnSaveGh" style="padding:8px 12px; cursor:pointer; background:#28a745; color:white; border:none; border-radius:4px;">저장</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', ghModalHTML);

            // GitHub Modal Events
            document.getElementById('btnTestGh').onclick = async () => {
                const token = document.getElementById('global_gh_token').value.trim();
                const repo = document.getElementById('global_gh_repo').value.trim();
                const branch = document.getElementById('global_gh_branch').value.trim() || 'main'; // Default main

                if (!token || !repo) { alert('설정 값을 먼저 입력해주세요 (테스트 전).'); return; }

                try {
                    await auth.loadGitHubClient();
                } catch (e) {
                    alert('GitHub Client Library 로드 실패: ' + e.message);
                    return;
                }

                // Configure Global Client
                if (typeof ghClient === 'undefined') { alert('Client loaded but object not found.'); return; }

                ghClient.configure(token, repo, branch);

                // Test Connection
                const result = await ghClient.testConnection();
                alert(result.message);

                if (result.success) {
                    // Auto-save if successful
                    localStorage.setItem('github_token', token);
                    localStorage.setItem('github_repo', repo);
                    localStorage.setItem('github_branch', branch);
                }
            };

            document.getElementById('btnCancelGh').onclick = () => {
                document.getElementById('ghSettingsModal').style.display = 'none';
            };

            document.getElementById('btnSaveGh').onclick = async () => {
                const token = document.getElementById('global_gh_token').value.trim();
                const repo = document.getElementById('global_gh_repo').value.trim();
                const branch = document.getElementById('global_gh_branch').value.trim() || 'main';

                if (!token || !repo) { alert('토큰과 저장소 주소를 모두 입력해주세요.'); return; }

                try {
                    await auth.loadGitHubClient();
                    // Configure & Test before saving to be sure
                    if (typeof ghClient !== 'undefined') {
                        ghClient.configure(token, repo, branch);
                        const result = await ghClient.testConnection();
                        if (!result.success) {
                            if (!confirm('연결 테스트에 실패했습니다. 그래도 저장하시겠습니까?\n' + result.message)) return;
                        }
                    }
                } catch (e) {
                    console.error(e);
                    // Allow save even if test fails/client fails, just warn
                }

                localStorage.setItem('github_token', token);
                localStorage.setItem('github_repo', repo);
                localStorage.setItem('github_branch', branch);
                alert('설정이 저장되었습니다. 이제 파일 업로드가 가능합니다.');
                document.getElementById('ghSettingsModal').style.display = 'none';
            };
        }

        // Inject Modal if not exists (Original Logic for Password Modal)
        if (!document.getElementById('pwChangeModal')) {
            const modalHTML = `
                <div id="pwChangeModal" style="display:none; position:fixed; z-index:9999; left:0; top:0; width:100%; height:100%; overflow:auto; background-color:rgba(0,0,0,0.4);">
                    <div style="background-color:#fefefe; margin:15% auto; padding:20px; border:1px solid #888; width:320px; border-radius:8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                        <h3 style="margin-top:0;">비밀번호 변경</h3>
                        <div style="margin-bottom:10px;">
                            <div style="position:relative; margin-bottom:8px;">
                                <input type="password" id="modalCurrentPass" placeholder="현재 비밀번호" style="width:100%; padding:8px 36px 8px 8px; box-sizing:border-box; border:1px solid #ddd; border-radius:4px;">
                                <button type="button" onclick="(function(b){var i=document.getElementById('modalCurrentPass');i.type=i.type==='password'?'text':'password';b.textContent=i.type==='password'?'👁':'🙈';})(this)" style="position:absolute;right:6px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:16px;padding:0;line-height:1;">👁</button>
                            </div>
                            <div style="position:relative; margin-bottom:8px;">
                                <input type="password" id="modalNewPass" placeholder="새 비밀번호" style="width:100%; padding:8px 36px 8px 8px; box-sizing:border-box; border:1px solid #ddd; border-radius:4px;">
                                <button type="button" onclick="(function(b){var i=document.getElementById('modalNewPass');i.type=i.type==='password'?'text':'password';b.textContent=i.type==='password'?'👁':'🙈';})(this)" style="position:absolute;right:6px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:16px;padding:0;line-height:1;">👁</button>
                            </div>
                            <div style="position:relative; margin-bottom:8px;">
                                <input type="password" id="modalConfirmPass" placeholder="새 비밀번호 확인" style="width:100%; padding:8px 36px 8px 8px; box-sizing:border-box; border:1px solid #ddd; border-radius:4px;">
                                <button type="button" onclick="(function(b){var i=document.getElementById('modalConfirmPass');i.type=i.type==='password'?'text':'password';b.textContent=i.type==='password'?'👁':'🙈';})(this)" style="position:absolute;right:6px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:16px;padding:0;line-height:1;">👁</button>
                            </div>
                        </div>
                        <div style="text-align:right;">
                            <button id="btnCancelPw" style="padding:5px 10px; cursor:pointer; background:#ccc; border:none; border-radius:4px;">취소</button>
                            <button id="btnSavePw" style="padding:5px 10px; cursor:pointer; background:#2673E2; color:white; border:none; border-radius:4px;">변경</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Modal Events
            document.getElementById('btnCancelPw').onclick = () => {
                document.getElementById('pwChangeModal').style.display = 'none';
            };
            document.getElementById('btnSavePw').onclick = async () => {
                const current = document.getElementById('modalCurrentPass').value;
                const newP = document.getElementById('modalNewPass').value;
                const confirmP = document.getElementById('modalConfirmPass').value;

                if (!current || !newP || !confirmP) { alert('모든 필드를 입력하세요.'); return; }
                if (newP !== confirmP) { alert('새 비밀번호가 일치하지 않습니다.'); return; }

                const result = await auth.changePassword(current, newP);
                alert(result.message);
                if (result.success) {
                    document.getElementById('pwChangeModal').style.display = 'none';
                    document.getElementById('modalCurrentPass').value = '';
                    document.getElementById('modalNewPass').value = '';
                    document.getElementById('modalConfirmPass').value = '';
                }
            };
        }

        // Update Header Login Link
        const authItem = document.querySelector('.auth-item');
        const authLink = document.querySelector('.auth-link');

        if (authItem && authLink) {
            // Remove existing injected elements
            const existingName = authItem.querySelector('.user-name-display');
            if (existingName) existingName.remove();
            const existingPwBtn = authItem.querySelector('.pw-change-btn');
            if (existingPwBtn) existingPwBtn.remove();

            if (isLogged) {
                const name = sessionStorage.getItem('dealerName') || 'Partner';

                // Create Name Span
                const nameSpan = document.createElement('span');
                nameSpan.className = 'user-name-display';
                nameSpan.textContent = `${name}님 `;
                nameSpan.style.marginRight = '10px';
                nameSpan.style.fontWeight = 'bold';
                nameSpan.style.fontSize = '0.9rem';

                // Insert before the link
                authItem.insertBefore(nameSpan, authLink);

                authLink.textContent = 'Logout';
                authLink.href = '#';
                authLink.onclick = async (e) => {
                    e.preventDefault();
                    await auth.logout();
                };

                // Create Password Change Link (Right of Logout)
                const pwBtn = document.createElement('a');
                pwBtn.className = 'pw-change-btn';
                pwBtn.href = '#';
                pwBtn.textContent = '비밀번호 변경';
                pwBtn.style.marginLeft = '10px';
                pwBtn.style.fontSize = '0.8rem';
                pwBtn.style.color = '#666';
                pwBtn.style.textDecoration = 'underline';
                pwBtn.onclick = (e) => {
                    e.preventDefault();
                    document.getElementById('pwChangeModal').style.display = 'block';
                };

                // 모든 로그인 사용자에게 비밀번호 변경 버튼 표시
                authItem.appendChild(pwBtn);


                addPartnerMenu(role);

            } else {
                authLink.textContent = 'Login';
                authLink.onclick = null; // Remove logout handler
                if (window.location.pathname.includes('/support/')) {
                    authLink.href = '../pages/login.html';
                } else if (window.location.pathname.includes('/pages/')) {
                    authLink.href = 'login.html';
                } else {
                    authLink.href = 'pages/login.html';
                }
            }
        }

        // Toggle Upload Buttons (Admin Only)
        const uploadBtns = document.querySelectorAll('.btn-upload');
        uploadBtns.forEach(btn => {
            btn.style.display = (role === 'admin') ? 'inline-block' : 'none';
        });
    }
};

// Global Injection Logic for Interactive Manual Button
(function() {
    function injectManualButton() {
        const isProductPage = window.location.pathname.includes('/pages/products/');
        if (!isProductPage) return;

        // Wait for productData to be available
        if (typeof productData === 'undefined' || !auth.isLoggedIn()) return;

        // Find current product ID
        let productId = null;
        if (typeof window.STATIC_PRODUCT_ID !== 'undefined') {
            productId = window.STATIC_PRODUCT_ID;
        } else {
            const urlParams = new URLSearchParams(window.location.search);
            productId = urlParams.get('id');
            if (productId && !isNaN(productId)) productId = parseInt(productId);
        }

        if (!productId) return;

        const product = productData.find(p => p.id === productId);
        if (!product || !product.manualUrl) return;

        // Check if button already exists
        if (document.querySelector('.interactive-manual-btn')) return;

        // Find insertion point (Downloads section)
        const downloadLinks = document.querySelectorAll('a[download]');
        let insertionPoint = null;
        
        if (downloadLinks.length > 0) {
            // Find the container of the last download link
            insertionPoint = downloadLinks[downloadLinks.length - 1].parentElement;
        }

        if (!insertionPoint) {
            // Fallback to detail-info
            insertionPoint = document.querySelector('.detail-info');
        } else if (typeof auth !== 'undefined' && auth.isLoggedIn()) {
            // If no attachments but logged in
            attachmentsHTML += `<div style="margin-top: 20px; padding-top: 20px; border-top: 1px dashed #ddd;">`;
            const btnHtml = `
                <div style="margin-top: 20px;" class="injected-manual-btn-container">
                    <a href="${product.manualUrl}" target="_blank" class="interactive-manual-btn" style="display: inline-flex; align-items: center; padding: 12px 24px; background: #2c3e50; color: #fff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 0.9rem; transition: background 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <span style="margin-right: 8px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                        </span>
                        인터렉티브 매뉴얼
                    </a>
                </div>
                <style>
                    // Interactive Manual Button (Only for Logged-in Users)
                    .interactive-manual-btn:hover {
                        background: #34495e !important;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    }
                </style>
            `;
            
            // If insertionPoint is the download container, append after it. 
            // If it's the detail-info, append to it.
            if (insertionPoint.classList.contains('detail-info')) {
                insertionPoint.insertAdjacentHTML('beforeend', btnHtml);
            } else {
                insertionPoint.insertAdjacentHTML('afterend', btnHtml);
            }
        }
    }

    // Run on load and also periodically to catch late rendering
    window.addEventListener('DOMContentLoaded', injectManualButton);
    window.addEventListener('load', injectManualButton);
    // Periodic check because of dynamic rendering in some pages
    setTimeout(injectManualButton, 500);
    setTimeout(injectManualButton, 2000);
})();

function addPartnerMenu(role) {
    const navMenu = document.querySelector('.nav-menu');
    // Check if duplicate exists
    if (document.querySelector('.partner-item')) return;
    if (!navMenu) return;

    // Determine paths based on current location
    const path = window.location.pathname.toLowerCase();
    const isInPages = path.includes('/pages/');
    const isInSupport = path.includes('/support/');

    // Calculate depth from root for relative paths
    // root: /index.html (depth 1)
    // support/index.html (depth 2)
    // support/install/123/index.html (depth 4)
    // But we need relative path to 'support/' for prefix.

    let prefix = 'support/';
    let depth = 0;

    if (path.includes('/support/')) {
        // Check if we are in deeper structure like support/install/ID/
        // Simple heuristic: count slashes after support
        const parts = path.split('/support/')[1].split('/');
        // parts = ['install.html'] -> length 1
        // parts = ['install', '123', 'index.html'] -> length 3

        if (parts.length > 2) {
            // We are deep. e.g. support/install/123/
            prefix = '../../';
            depth = 3; // roughly
        } else {
            prefix = '';
            depth = 2;
        }
    } else if (isInPages) {
        prefix = '../support/';
        depth = 2;
    }

    const partnerLi = document.createElement('li');
    partnerLi.className = 'dropdown partner-item';
    let adminPrefix = 'pages/';
    if (isInPages) adminPrefix = '';
    else if (isInSupport) {
        if (depth > 2) adminPrefix = '../../../pages/';
        else adminPrefix = '../pages/';
    }

    let menuItems = '';

    if (role === 'service_admin') {
        menuItems = `<li><a href="${adminPrefix}service-management.html" class="dropdown-item">서비스 관리</a></li>`;
    } else {
        menuItems = `
                <li><a href="${prefix}price-list.html" class="dropdown-item">가격표</a></li>
        `;

        if (role === 'admin') {
            menuItems += `<li><a href="${adminPrefix}service-management.html" class="dropdown-item">서비스 관리</a></li>`;
        }

        menuItems += `
                <li><a href="${prefix}partner-board.html" class="dropdown-item">전용 게시판</a></li>
                <li><a href="${prefix}dealer-only.html" class="dropdown-item">전용 자료실</a></li>
        `;

        if (role === 'admin') {
            menuItems += `<li><a href="${prefix}price-input.html" class="dropdown-item">가격표 입력</a></li>`;
            menuItems += `<li><a href="${adminPrefix}admin.html?mode=product" class="dropdown-item">제품 관리</a></li>`;
            menuItems += `<li><a href="${adminPrefix}admin.html?mode=dealer" class="dropdown-item">대리점 관리</a></li>`;
            menuItems += `<li><a href="${adminPrefix}admin.html?mode=popup" class="dropdown-item">팝업 관리</a></li>`;
            menuItems += `<li><a href="${adminPrefix}admin.html?mode=service_admin" class="dropdown-item">서비스관리자 관리</a></li>`;
            menuItems += `<li><a href="${adminPrefix}pnp-setup.html" class="dropdown-item">PnP 찾기 설정</a></li>`;
            menuItems += `<li><a href="${adminPrefix}estimate-setup.html" class="dropdown-item">견적 설정</a></li>`;

            // Visit Log Link
            const visitLogLink = window.location.pathname.includes('product.html') ? '#visitLogSection' : `${prefix}product.html#visitLogSection`;
            menuItems += `<li><a href="${visitLogLink}" class="dropdown-item" style="border-top:1px solid #eee;">방문 기록</a></li>`;

            // Inbound Analysis Link
            menuItems += `<li><a href="${adminPrefix}analytics.html" class="dropdown-item">유입 경로</a></li>`;

            // GitHub Settings Link
            menuItems += `<li><a href="#" class="dropdown-item" onclick="auth.openGitHubSettings(event)">GitHub 설정</a></li>`;
        }
    }

    partnerLi.innerHTML = `
        <a href="#" class="nav-link" style="color: #e74c3c;">파트너 존</a>
        <ul class="dropdown-content">
            ${menuItems}
        </ul>
    `;

    // Insert before the last item (Login/Lang)
    // The structure is ... social-icons, lang-item, auth-item.
    // Let's insert before social-icons or lang-item.
    // Dealer page header: ... <li>Support</li> <li class="social-icons">...
    // Let's insert before social-icons.
    const socialIcons = document.querySelector('.social-icons');
    if (socialIcons) {
        navMenu.insertBefore(partnerLi, socialIcons);
    } else {
        navMenu.appendChild(partnerLi);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Supabase DB 방식은 별도 Auth 세션 없음 → sessionStorage 기준으로 로그인 케크
    auth.updateUI();
});

// Helper to save visit log
// Helper to save visit log
async function saveVisitLog(entry) {
    // Save to LocalStorage (Original Logic)
    try {
        let logs = [];
        const stored = localStorage.getItem('visitLog');
        if (stored) logs = JSON.parse(stored);
        logs.unshift(entry);
        if (logs.length > 100) logs = logs.slice(0, 100);
        localStorage.setItem('visitLog', JSON.stringify(logs));
    } catch (e) {
        console.error('Local Visit Log Error:', e);
    }

    // Save to Supabase
    try {
        if (typeof loadSupabase === 'function') {
            const client = await loadSupabase();
            const { error } = await client.from('visitor_logs').insert([{
                visit_date: entry.date,
                username: entry.username || '',
                name: entry.name || '',
                role: entry.role || 'dealer'
            }]);
            if (error) console.error('[Supabase] Visit Log Insert Error:', error.message);
        }
    } catch (e) {
        console.warn('[Supabase] Visit Log Exception:', e.message);
    }
}

// Global Injection Logic for Interactive Manual Button
(function() {
    function injectManualButton() {
        const isProductPage = window.location.pathname.includes('/pages/products/');
        if (!isProductPage) return;

        // Wait for productData and check login
        if (typeof productData === 'undefined' || typeof auth === 'undefined' || !auth.isLoggedIn()) return;

        // Find current product ID
        let productId = null;
        if (typeof window.STATIC_PRODUCT_ID !== 'undefined') {
            productId = window.STATIC_PRODUCT_ID;
        } else {
            const urlParams = new URLSearchParams(window.location.search);
            productId = urlParams.get('id');
            if (productId && !isNaN(productId)) productId = parseInt(productId);
        }

        if (!productId) return;

        const product = productData.find(p => p.id === productId);
        if (!product || !product.manualUrl) return;

        // Check if button already exists
        if (document.querySelector('.interactive-manual-btn')) return;

        // Find insertion point (Downloads section)
        const downloadLinks = document.querySelectorAll('a[download]');
        let insertionPoint = null;
        
        if (downloadLinks.length > 0) {
            insertionPoint = downloadLinks[downloadLinks.length - 1].parentElement;
        }

        if (!insertionPoint) {
            insertionPoint = document.querySelector('.detail-info');
        }

        if (insertionPoint) {
            const btnHtml = `
                <div style="margin-top: 20px;" class="injected-manual-btn-container">
                    <a href="${product.manualUrl}" target="_blank" class="interactive-manual-btn" style="display: inline-flex; align-items: center; padding: 12px 24px; background: #2c3e50; color: #fff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 0.9rem; transition: background 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <span style="margin-right: 8px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                        </span>
                        인터렉티브 매뉴얼
                    </a>
                </div>
                <style>
                    .interactive-manual-btn:hover {
                        background: #34495e !important;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    }
                </style>
            `;
            
            if (insertionPoint.classList.contains('detail-info')) {
                insertionPoint.insertAdjacentHTML('beforeend', btnHtml);
            } else {
                insertionPoint.insertAdjacentHTML('afterend', btnHtml);
            }
        }
    }

    window.addEventListener('DOMContentLoaded', injectManualButton);
    window.addEventListener('load', injectManualButton);
    setTimeout(injectManualButton, 500);
    setTimeout(injectManualButton, 2000);
})();
