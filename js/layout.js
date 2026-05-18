/**
 * Layout Manager for Alpine Homepage
 * Handles shared components like Footer
 */

const Layout = {
    /**
     * Initializes the mobile menu (hamburger)
     */
    initMobileMenu: function () {
        const header = document.querySelector('.header-container');
        if (!header) return;

        // Check if button exists (it should now be in HTML)
        let btn = document.querySelector('.mobile-menu-btn');

        // If not found in HTML (legacy support or other pages), create it
        if (!btn) {
            btn = document.createElement('button');
            btn.className = 'mobile-menu-btn';
            btn.setAttribute('aria-label', 'Toggle Menu');
            btn.innerHTML = '<span></span><span></span><span></span>';
            header.appendChild(btn);
        }

        // Prevent duplicate event listeners
        if (btn.hasAttribute('data-init')) return;

        btn.addEventListener('click', () => {
            const nav = document.querySelector('.nav-menu');
            if (nav) nav.classList.toggle('active');
            btn.classList.toggle('active'); // Optional: Animate button itself if CSS supports it
        });

        // Mark as initialized
        btn.setAttribute('data-init', 'true');
    },

    /**
     * Renders the footer into the specified container
     * @param {string} targetId - ID of the container element
     * @param {string} rootPath - Relative path to the root directory (e.g., './', '../')
     */
    renderFooter: function (targetId, rootPath = './') {
        const container = document.getElementById(targetId);
        if (!container) return;

        // Ensure rootPath ends with / if not empty
        if (rootPath && !rootPath.endsWith('/')) rootPath += '/';

        const year = new Date().getFullYear();

        const html = `
        <footer>
            <div class="footer-content">
                <div class="footer-section">
                    <div class="footer-logo">
                        <img src="${rootPath}assets/images/jch_logo.png" alt="JCH Auto" style="height: 30px;" id="footer-logo-img">
                    </div>
                    <p class="footer-text">
                        <strong data-i18n="footer_ceo">대표 | 이정현</strong><br>
                        <span data-i18n="footer_address">경기도 안양시 동안구 엘에스로 136, A동 1401호(호계동, 금정역2차SKV1타워)</span><br>
                        <span data-i18n="footer_contact">TEL | 1670-7425 FAX | 031-477-7220</span><br>
                        <span data-i18n="footer_hours">상담시간 | 월~금 09:00~17:00 (토,일,공휴일 휴무)</span><br>
                        <span data-i18n="footer_biz_info">사업자등록번호 | 619-81-07276 개인정보보호책임자 | 한길전</span>
                    </p>
                </div>
                <div class="footer-section footer-links">
                    <h4 data-i18n="footer_products">Products</h4>
                    <ul>
                        <li><a href="${rootPath}index.html?category=F%231%20Status">F#1 Status</a></li>
                        <li><a href="${rootPath}index.html?category=Alpine%20Status">Alpine Status</a></li>
                        <li><a href="${rootPath}index.html?category=DSP%2FAMP">DSP/AMP</a></li>
                        <li><a href="${rootPath}index.html?category=Speakers">Speakers</a></li>
                        <li><a href="${rootPath}index.html?category=PnP%20Cable">PnP Cable</a></li>
                        <li><a href="${rootPath}index.html?category=기타상품" data-i18n="filter_others">기타상품</a></li>
                        <li><a href="${rootPath}index.html?category=Alpine%20OEM%20Fit">Alpine OEM Fit</a></li>
                        <li><a href="${rootPath}index.html?category=ALPINESTYLE">ALPINESTYLE</a></li>
                    </ul>
                </div>
                <div class="footer-section footer-links">
                    <h4 data-i18n="footer_support">Support</h4>
                    <ul>
                        <li><a href="${rootPath}support/product.html" data-i18n="nav_support_product">Product Archives</a></li>
                        <li><a href="${rootPath}support/install.html" data-i18n="nav_support_install">Installation Guides</a></li>
                        <li><a href="${rootPath}support/promo.html" data-i18n="nav_support_promo">Contact Support</a></li>
                    </ul>
                </div>
                <div class="footer-section footer-links">
                    <h4 data-i18n="footer_global">Global</h4>
                    <ul>
                        <li><a href="https://alpine.co.jp/" target="_blank" data-i18n="footer_global_japan">Japan</a></li>
                        <li><a href="https://www.alpine-asia.com/en" target="_blank" data-i18n="footer_global_asia">Asia</a></li>
                        <li><a href="https://www.alpine.com.au/" target="_blank" data-i18n="footer_global_australia">Australia</a></li>
                        <li><a href="https://www.alpine.com.au/" target="_blank" data-i18n="footer_global_europe">Europe</a></li>
                        <li><a href="https://www.alpine.com.cn/" target="_blank" data-i18n="footer_global_china">China</a></li>
                        <li><a href="https://www.alpine-usa.com/" target="_blank" data-i18n="footer_global_na">North America</a></li>
                    </ul>
                </div>
            </div>
            <div class="copyright">
                COPYRIGHT©${year} JCHAUTO,INC. ALL RIGHTS RESERVED.
            </div>
        </footer>
        `;

        container.innerHTML = html;

        // Re-run translations if i18n is loaded and available
        if (typeof i18n !== 'undefined' && i18n.applyTranslations) {
            // Apply current language
            const currentLang = localStorage.getItem('language') || 'ko';
            i18n.applyTranslations(currentLang);
        }

        // Load Analytics Script
        this.loadAnalytics();
    },

    /**
     * Dynamically loads the analytics tracking script
     */
    loadAnalytics: function() {
        if (document.getElementById('alpine-analytics')) return;
        
        const script = document.createElement('script');
        script.id = 'alpine-analytics';
        
        // Determine root path
        const path = window.location.pathname;
        let scriptPath = 'js/analytics.js';
        if (path.includes('/pages/') || path.includes('/support/')) {
            scriptPath = '../js/analytics.js';
        }
        // Handle deep support paths (e.g., support/install/123/index.html)
        if (path.includes('/support/') && path.split('/support/')[1].split('/').length > 2) {
            scriptPath = '../../../js/analytics.js';
        }

        script.src = scriptPath + '?v=' + Date.now();
        script.async = true;
        document.head.appendChild(script);
        script.onload = () => {
            // Initialize Interactive Guide after analytics/auth are potentially ready
            this.initInteractiveGuide();
        };
    },

    /**
     * Initializes the Interactive Guide integration
     */
    initInteractiveGuide: function() {
        // 1. Check Login Status
        const isLoggedIn = (typeof auth !== 'undefined' && typeof auth.isLoggedIn === 'function') 
            ? auth.isLoggedIn() 
            : (sessionStorage.getItem('isLoggedIn') === 'true');

        if (!isLoggedIn) return;

        // 2. Load CSS
        this.loadGuideCSS();

        // 3. Check if we are on HDP-D90 product page
        const path = window.location.pathname;
        if (path.includes('hdp-d90.html')) {
            this.injectGuideButton();
        }

        // 4. Create Modal Structure (shared)
        this.createGuideModal();
    },

    loadGuideCSS: function() {
        if (document.getElementById('guide-css')) return;
        const link = document.createElement('link');
        link.id = 'guide-css';
        link.rel = 'stylesheet';
        
        const path = window.location.pathname;
        let cssPath = 'css/interactive-guide.css';
        if (path.includes('/pages/') || path.includes('/support/')) cssPath = '../../css/interactive-guide.css';
        
        link.href = cssPath;
        document.head.appendChild(link);
    },

    injectGuideButton: function() {
        if (document.querySelector('.interactive-guide-btn')) return;

        const infoSection = document.querySelector('.detail-info');
        if (!infoSection) return;

        const btn = document.createElement('button');
        btn.className = 'interactive-guide-btn';
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            인터렉티브 가이드 (Interactive Guide)
        `;

        btn.onclick = () => this.openGuideModal('https://alpine-d90-guide.vercel.app');

        // Insert after price or attachments
        const price = infoSection.querySelector('.detail-price');
        if (price) {
            price.after(btn);
        } else {
            infoSection.appendChild(btn);
        }
    },

    createGuideModal: function() {
        if (document.getElementById('guide-modal')) return;

        const modalHTML = `
            <div id="guide-modal" class="guide-modal-overlay">
                <div class="guide-modal-container">
                    <button class="guide-close-btn">&times;</button>
                    <iframe id="guide-iframe" class="guide-iframe" src="about:blank"></iframe>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.getElementById('guide-modal');
        const closeBtn = modal.querySelector('.guide-close-btn');
        
        closeBtn.onclick = () => {
            modal.classList.remove('active');
            document.getElementById('guide-iframe').src = 'about:blank';
            document.body.style.overflow = '';
        };

        modal.onclick = (e) => {
            if (e.target === modal) closeBtn.click();
        };
    },

    openGuideModal: function(url) {
        const modal = document.getElementById('guide-modal');
        const iframe = document.getElementById('guide-iframe');
        
        iframe.src = url;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

// Check if document is already loaded or wait for it
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        Layout.initMobileMenu();
    });
} else {
    Layout.initMobileMenu();
}
