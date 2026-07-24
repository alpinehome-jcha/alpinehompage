
        document.addEventListener('DOMContentLoaded', function () {
            renderPopups();
        });

        function renderPopups() {
            const container = document.getElementById('popupContainer');
            container.innerHTML = '';

            // 0. Check for Refresh/Reload -> Clear Session Storage for Popups
            try {
                const perfEntries = performance.getEntriesByType("navigation");
                const isReload = (perfEntries.length > 0 && perfEntries[0].type === 'reload') ||
                    (performance.navigation && performance.navigation.type === 1);

                if (isReload) {
                    Object.keys(sessionStorage).forEach(key => {
                        if (key.startsWith('popup_closed_')) {
                            sessionStorage.removeItem(key);
                        }
                    });
                }
            } catch (e) {
                console.error("Navigation API not supported or error:", e);
            }

            // 1. Get List
            let popupList = [];

            // Try to get from Server Data (popup-data.js)
            if (typeof popupData !== 'undefined' && popupData.length > 0) {
                popupList = popupData;
            } else {
                // Fallback to LocalStorage (mainly for Admin testing before deploy, or if file fails)
                const storedList = localStorage.getItem('popupList');
                if (storedList) {
                    popupList = JSON.parse(storedList);
                } else {
                    // Fallback / Migration for old config
                    const oldConfig = localStorage.getItem('popupConfig');
                    if (oldConfig) {
                        const c = JSON.parse(oldConfig);
                        if (c.isActive) {
                            popupList.push({
                                id: 'legacy',
                                title: 'Event',
                                imagePath: c.imagePath,
                                linkUrl: c.linkUrl,
                                hideDays: c.hideDays,
                                isActive: true
                            });
                        }
                    }
                }
            }

            // 2. Filter Active & Not Hidden
            const now = new Date().getTime();
            const activePopups = popupList.filter(p => {
                if (!p.isActive) return false;

                // Check "Do not show today" (LocalStorage)
                const hiddenUntil = localStorage.getItem('popup_hidden_' + p.id);
                const now = new Date().getTime();
                if (hiddenUntil && now < parseInt(hiddenUntil)) return false;

                // Check "Closed in this session" (SessionStorage)
                if (sessionStorage.getItem('popup_closed_' + p.id)) return false;

                return true;
            });

            // 3. Render
            activePopups.forEach((p, index) => {
                const zIndex = 10000 + index; // Stack them

                const wrapper = document.createElement('div');
                wrapper.id = 'popup-' + p.id;
                wrapper.className = 'popup-overlay';
                wrapper.style.zIndex = zIndex;
                wrapper.style.display = 'none'; // Keep hidden during load to prevent black FOUC

                const linkHtml = (p.linkUrl && p.linkUrl !== '#')
                    ? `<a href="${p.linkUrl}" style="cursor:pointer;" target="_blank"><img src="${p.imagePath}" alt="${p.title}"></a>`
                    : `<img src="${p.imagePath}" alt="${p.title}">`;

                wrapper.innerHTML = `
                    <div class="popup-content">
                        <div class="popup-image-container">
                            ${linkHtml}
                            <div class="popup-controls">
                                <button class="popup-btn" onclick="dontShowPopup('${p.id}', ${p.hideDays})">하루동안 열지 않기</button>
                                <button class="popup-btn" onclick="closePopup('${p.id}')">닫기</button>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(wrapper);

                // Show only after image loads to avoid black box FOUC
                const img = wrapper.querySelector('img');
                if (img) {
                    if (img.complete) {
                        wrapper.style.display = 'flex';
                    } else {
                        img.onload = () => { wrapper.style.display = 'flex'; };
                        img.onerror = () => { wrapper.style.display = 'flex'; }; // fallback
                    }
                } else {
                    wrapper.style.display = 'flex';
                }
            });
        }

        function closePopup(id) {
            const el = document.getElementById('popup-' + id);
            if (el) el.remove();
            // Save to sessionStorage to prevent reappearing on reload (navigating to product intro)
            sessionStorage.setItem('popup_closed_' + id, 'true');
        }

        function dontShowPopup(id, days) {
            const expiry = new Date().getTime() + (days * 24 * 60 * 60 * 1000);
            localStorage.setItem('popup_hidden_' + id, expiry);
            closePopup(id);
        }
    