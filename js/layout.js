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
    }
};

// Check if document is already loaded or wait for it
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', Layout.initMobileMenu);
} else {
    Layout.initMobileMenu();
}
