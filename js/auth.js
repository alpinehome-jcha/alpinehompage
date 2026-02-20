// Role-Based Auth Logic
const AUTH_KEY = 'isLoggedIn';
const ROLE_KEY = 'userRole';

// Shared GitHub Configuration (For Visit Logs)
// ⚠️ SECURITY WARNING: This token is visible to anyone who inspects the source code.
// Use a Fine-grained Personal Access Token scoped ONLY to this repository and 'Contents' permission.
const SHARED_GH_CONFIG = {
    TOKEN: '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', // Shared Token
    REPO: 'alpinehome-jcha/alpinehompage', // Auto-detected from .git/config
    BRANCH: 'main'
};

// Credentials Database (Demo)
const USERS = {
    'alpineaudio': { pass: '6198107276aa!!', role: 'admin' },
    'master': { pass: 'master123', role: 'master' },
    'team': { pass: 'team123', role: 'team' },
    'style': { pass: 'style123', role: 'style' },
    'region': { pass: 'region123', role: 'region' },
    'dealer': { pass: 'dealer123', role: 'dealer' }
};

const auth = {
    // Expose Shared Config for other files (e.g. product.html)
    sharedConfig: SHARED_GH_CONFIG,

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
        // 1. Check Hardcoded Users (Admin / Special Roles)
        const user = USERS[username];
        if (user && user.pass === password) {
            sessionStorage.setItem(AUTH_KEY, 'true');
            sessionStorage.setItem(ROLE_KEY, user.role);
            // Set friendly name for legacy/static users
            const names = {
                'alpineaudio': '관리자',
                'master': 'Sound Master',
                'team': 'Team Alpine',
                'style': 'Alpine Style',
                'region': 'Regional Dist',
                'dealer': 'Dealer'
            };
            sessionStorage.setItem('dealerName', names[username] || username);
            sessionStorage.setItem('currentUser', username);
            // Record Visit Log
            const logEntry = {
                date: new Date().toLocaleString('ko-KR'),
                username: username,
                name: names[username] || username,
                role: user.role
            };
            await saveVisitLog(logEntry);

            return true;
        }

        // 2. Check Dynamic Dealer Data
        try {
            const storedDealers = localStorage.getItem('dealerData');
            if (storedDealers) {
                const dealers = JSON.parse(storedDealers);
                const matchedDealer = dealers.find(d => d.username === username && d.password === password);
                if (matchedDealer) {
                    // Map Category to Role Key
                    const catMap = {
                        'Alpine Sound Master': 'master',
                        'Team Alpine': 'team',
                        'Alpine Style Distributor': 'style',
                        'Alpine Regional Distributor': 'region',
                        'Alpine Dealer': 'dealer'
                    };
                    const role = catMap[matchedDealer.category] || 'dealer';

                    sessionStorage.setItem(AUTH_KEY, 'true');
                    sessionStorage.setItem(ROLE_KEY, role);
                    sessionStorage.setItem('dealerName', matchedDealer.name);
                    sessionStorage.setItem('currentUser', username);
                    // Record Visit Log
                    const logEntry = {
                        date: new Date().toLocaleString('ko-KR'),
                        username: username,
                        name: matchedDealer.name,
                        role: role
                    };
                    await saveVisitLog(logEntry);

                    return true;
                }
            }
        } catch (e) {
            console.error('Login Error:', e);
        }

        return false;
    },
    changePassword: (currentPass, newPass) => {
        const username = sessionStorage.getItem('currentUser');
        if (!username) return { success: false, message: '로그인이 필요합니다.' };

        // Check Dynamic Dealer Data
        try {
            const storedDealers = localStorage.getItem('dealerData');
            if (storedDealers) {
                let dealers = JSON.parse(storedDealers);
                const dealerIndex = dealers.findIndex(d => d.username === username);

                if (dealerIndex !== -1) {
                    // Verify Current Password
                    if (dealers[dealerIndex].password !== currentPass) {
                        return { success: false, message: '현재 비밀번호가 일치하지 않습니다.' };
                    }

                    // Update Password
                    dealers[dealerIndex].password = newPass;
                    localStorage.setItem('dealerData', JSON.stringify(dealers));
                    return { success: true, message: '비밀번호가 변경되었습니다.' };
                } else {
                    // Check if it is a hardcoded user
                    if (USERS[username]) {
                        return { success: false, message: '시스템 관리자 계정은 여기서 변경할 수 없습니다.' };
                    }
                }
            }
        } catch (e) {
            console.error('Change Password Error:', e);
            return { success: false, message: '오류가 발생했습니다.' };
        }
        return { success: false, message: '사용자 정보를 찾을 수 없습니다.' };
    },
    logout: () => {
        sessionStorage.removeItem(AUTH_KEY);
        sessionStorage.removeItem(ROLE_KEY);
        sessionStorage.removeItem('dealerName');
        sessionStorage.removeItem('currentUser');

        const path = window.location.pathname;
        let redirectPath = 'index.html'; // Default for root

        if (path.includes('/pages/')) {
            redirectPath = '../index.html';
        } else if (path.includes('/support/')) {
            const parts = path.split('/support/')[1].split('/');
            // If deep (e.g. install/123/index.html -> len 3), go up 3 levels to root
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
                    <div style="background-color:#fefefe; margin:15% auto; padding:20px; border:1px solid #888; width:300px; border-radius:8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                        <h3 style="margin-top:0;">비밀번호 변경</h3>
                        <div style="margin-bottom:10px;">
                            <input type="password" id="modalCurrentPass" placeholder="현재 비밀번호" style="width:100%; padding:8px; margin-bottom:5px; box-sizing:border-box;">
                            <input type="password" id="modalNewPass" placeholder="새 비밀번호" style="width:100%; padding:8px; margin-bottom:5px; box-sizing:border-box;">
                            <input type="password" id="modalConfirmPass" placeholder="새 비밀번호 확인" style="width:100%; padding:8px; margin-bottom:5px; box-sizing:border-box;">
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
            document.getElementById('btnSavePw').onclick = () => {
                const current = document.getElementById('modalCurrentPass').value;
                const newP = document.getElementById('modalNewPass').value;
                const confirmP = document.getElementById('modalConfirmPass').value;

                if (!current || !newP || !confirmP) { alert('모든 필드를 입력하세요.'); return; }
                if (newP !== confirmP) { alert('새 비밀번호가 일치하지 않습니다.'); return; }

                const result = auth.changePassword(current, newP);
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
                authLink.onclick = (e) => {
                    e.preventDefault();
                    auth.logout();
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

                // Insert AFTER the Logout link
                // authItem contains: [Name] [LogoutLink]
                if (role === 'admin') {
                    authItem.appendChild(pwBtn);
                }


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
    let menuItems = `
            <li><a href="${prefix}price-list.html" class="dropdown-item">가격표</a></li>
            <li><a href="${prefix}dealer-only.html" class="dropdown-item">전용 자료실</a></li>
    `;

    if (role === 'admin') {
        let adminPrefix = 'pages/';
        if (isInPages) adminPrefix = '';
        else if (isInSupport) {
            if (depth > 2) adminPrefix = '../../../pages/';
            else adminPrefix = '../pages/';
        }

        menuItems += `<li><a href="${prefix}price-input.html" class="dropdown-item">가격표 입력</a></li>`;
        menuItems += `<li><a href="${adminPrefix}admin.html?mode=product" class="dropdown-item">제품 관리</a></li>`;
        menuItems += `<li><a href="${adminPrefix}admin.html?mode=dealer" class="dropdown-item">대리점 관리</a></li>`;
        menuItems += `<li><a href="${adminPrefix}admin.html?mode=popup" class="dropdown-item">팝업 관리</a></li>`;
        menuItems += `<li><a href="${adminPrefix}pnp-setup.html" class="dropdown-item">PnP 찾기 설정</a></li>`;

        // Visit Log Link
        const visitLogLink = window.location.pathname.includes('product.html') ? '#visitLogSection' : `${prefix}product.html#visitLogSection`;
        menuItems += `<li><a href="${visitLogLink}" class="dropdown-item" style="border-top:1px solid #eee;">방문 기록</a></li>`;

        // GitHub Settings Link
        menuItems += `<li><a href="#" class="dropdown-item" onclick="auth.openGitHubSettings(event)">GitHub 설정</a></li>`;
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
    auth.updateUI();
});

// Helper to save visit log
async function saveVisitLog(entry) {
    // 1. Always save to LocalStorage as backup/cache
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

    // 2. Save to GitHub (Using Shared Token for ALL users)
    try {
        // Ensure ghClient is loaded
        if (typeof ghClient === 'undefined') {
            await auth.loadGitHubClient();
        }

        // PRIORITIZE SHARED TOKEN
        const token = auth.sharedConfig.TOKEN;
        const repo = auth.sharedConfig.REPO;
        const branch = auth.sharedConfig.BRANCH;

        if (token && repo && typeof ghClient !== 'undefined') {
            // Re-configure client temporarily for this operation
            ghClient.configure(token, repo, branch);

            // Fetch existing logs
            let serverLogs = [];
            const path = 'data/visit-log.json';

            try {
                // Manually fetch content using API to get latest state
                const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;
                const resp = await fetch(apiUrl, {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    cache: 'no-store'
                });

                if (resp.ok) {
                    const data = await resp.json();
                    if (data.content) {
                        // Decode Base64 (handle Unicode)
                        const binaryString = atob(data.content);
                        const bytes = Uint8Array.from(binaryString, c => c.charCodeAt(0));
                        const decodedValue = new TextDecoder().decode(bytes);
                        serverLogs = JSON.parse(decodedValue);
                    }
                } else if (resp.status === 404) {
                    console.log('No existing visit log found on server, creating new.');
                } else {
                    console.error('Failed to fetch visit log:', resp.status);
                }
            } catch (e) {
                console.error('Error fetching existing visit log:', e);
            }

            // Append New
            serverLogs.unshift(entry);
            // Limit to 200 on server
            if (serverLogs.length > 200) serverLogs = serverLogs.slice(0, 200);

            // Upload
            await ghClient.uploadFile(path, new Blob([JSON.stringify(serverLogs, null, 2)], { type: 'application/json' }), `Visit Log: ${entry.username}`);

            // Restore user's personal token if it exists (Optional, but good practice if they are admin)
            const userToken = localStorage.getItem('github_token');
            const userRepo = localStorage.getItem('github_repo');
            if (userToken && userRepo) {
                ghClient.configure(userToken, userRepo, localStorage.getItem('github_branch') || 'main');
            }
        } else {
            console.warn('Shared GitHub Token not configured in js/auth.js');
        }
    } catch (e) {
        console.error('GitHub Visit Log Error:', e);
    }
}
