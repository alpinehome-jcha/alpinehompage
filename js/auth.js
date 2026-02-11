// Role-Based Auth Logic
const AUTH_KEY = 'isLoggedIn';
const ROLE_KEY = 'userRole';

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
    login: (username, password) => {
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
            saveVisitLog(logEntry);

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
                    saveVisitLog(logEntry);

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
        const isInPages = window.location.pathname.includes('/pages/');
        const isInSupport = window.location.pathname.includes('/support/');
        window.location.href = (isInPages || isInSupport) ? '../index.html' : 'index.html';
    },
    isLoggedIn: () => {
        return sessionStorage.getItem(AUTH_KEY) === 'true';
    },
    getRole: () => {
        return sessionStorage.getItem(ROLE_KEY);
    },
    checkAuthAndRedirect: () => {
        if (!auth.isLoggedIn()) {
            // Redirect to login handled by page logic usually, or we can force it here
            // Redirect logic
            const isInPages = window.location.pathname.includes('/pages/');
            const isInSupport = window.location.pathname.includes('/support/');
            // If in pages/, login is in same dir. If in support, ../pages/login.html. If root, pages/login.html
            let loginPath = 'pages/login.html';
            if (isInPages) loginPath = 'login.html';
            else if (isInSupport) loginPath = '../pages/login.html';

            window.location.href = loginPath;
        }
    },
    updateUI: () => {
        const isLogged = auth.isLoggedIn();
        const role = auth.getRole();

        // Inject Modal if not exists
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

function addPartnerMenu(role) {
    const navMenu = document.querySelector('.nav-menu');
    // Check if duplicate exists
    if (document.querySelector('.partner-item')) return;
    if (!navMenu) return;

    // Determine paths based on current location
    const isInPages = window.location.pathname.includes('/pages/');
    const isInSupport = window.location.pathname.includes('/support/');

    let prefix = 'support/';
    if (isInPages) prefix = '../support/';
    else if (isInSupport) prefix = '';

    const partnerLi = document.createElement('li');
    partnerLi.className = 'dropdown partner-item';
    let menuItems = `
            <li><a href="${prefix}price-list.html" class="dropdown-item">가격표</a></li>
            <li><a href="${prefix}dealer-only.html" class="dropdown-item">전용 자료실</a></li>
    `;

    if (role === 'admin') {
        let adminPrefix = 'pages/';
        if (isInPages) adminPrefix = '';
        else if (isInSupport) adminPrefix = '../pages/';

        menuItems += `<li><a href="${prefix}price-input.html" class="dropdown-item">가격표 입력</a></li>`;
        // admin.html is in pages/ now
        menuItems += `<li><a href="${adminPrefix}admin.html?mode=product" class="dropdown-item">제품 관리</a></li>`;
        menuItems += `<li><a href="${adminPrefix}admin.html?mode=dealer" class="dropdown-item">대리점 관리</a></li>`;
        menuItems += `<li><a href="${adminPrefix}admin.html?mode=popup" class="dropdown-item">팝업 관리</a></li>`;

        // Visit Log Link
        // product.html is in support/
        // if in pages/, ../support/product.html
        // if in support/, product.html
        // if root, support/product.html
        // This is exactly what 'prefix' does (points to support/ folder contents)
        // EXCEPT if we are IN product.html itself?
        // window.location.pathname.includes('/support/product.html')

        const visitLogLink = window.location.pathname.includes('product.html') ? '#visitLogSection' : `${prefix}product.html#visitLogSection`;
        menuItems += `<li><a href="${visitLogLink}" class="dropdown-item" style="border-top:1px solid #eee;">방문 기록</a></li>`;
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
function saveVisitLog(entry) {
    try {
        let logs = [];
        const stored = localStorage.getItem('visitLog');
        if (stored) logs = JSON.parse(stored);
        logs.unshift(entry);
        if (logs.length > 100) logs = logs.slice(0, 100);
        localStorage.setItem('visitLog', JSON.stringify(logs));
    } catch (e) {
        console.error('Visit Log Error:', e);
    }
}
