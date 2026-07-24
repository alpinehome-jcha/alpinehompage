
        // PnP Search Logic
        let pnpCurrentManuf = '';
        let pnpCurrentModel = '';

        document.addEventListener('DOMContentLoaded', () => {
            // 1. Check Login for Button Visibility (Visible to all logged-in users)
            if (typeof auth !== 'undefined' && auth.isLoggedIn()) {
                const btn = document.getElementById('btnPnpSearch');
                if (btn) {
                    btn.style.display = 'block';
                    btn.addEventListener('click', openPnpModal);
                }
            }

            // 2. Modal Controls
            const modal = document.getElementById('pnpSearchModal');
            const closeBtn = document.querySelector('.pnp-close');
            if (closeBtn) {
                closeBtn.onclick = () => modal.style.display = 'none';
            }
            window.onclick = (event) => {
                if (event.target == modal) modal.style.display = 'none';
            }
        });

        function openPnpModal() {
            const modal = document.getElementById('pnpSearchModal');
            modal.style.display = 'block';
            pnpReset();
        }

        function pnpReset() {
            showStep(1);
            pnpCurrentManuf = '';
            pnpCurrentModel = '';
            updateBreadcrumbs();
            renderManufacturers();
        }

        function showStep(step) {
            document.querySelectorAll('.pnp-step').forEach(el => el.classList.remove('active'));
            document.getElementById('pnpStep' + step).classList.add('active');
        }

        function pnpGoBack(toStep) {
            if (toStep === 1) {
                pnpCurrentManuf = '';
                pnpCurrentModel = '';
            } else if (toStep === 2) {
                pnpCurrentModel = '';
            }
            updateBreadcrumbs(toStep);
            showStep(toStep);
        }

        function updateBreadcrumbs(step) {
            const bc = document.getElementById('pnpBreadcrumbs');
            if (!bc) return;

            let text = '';
            // If going back to step 1, clear everything
            if (step === 1) {
                bc.style.display = 'none';
                bc.innerHTML = '';
                return;
            }

            if (pnpCurrentManuf) text += `<span class="pnp-crumb-item">${pnpCurrentManuf}</span>`;
            if (pnpCurrentModel && step !== 1) text += ` > <span class="pnp-crumb-item">${pnpCurrentModel}</span>`;

            if (text) {
                bc.innerHTML = text;
                bc.style.display = 'block';
            } else {
                bc.style.display = 'none';
            }
        }

        // Render Steps
        function renderManufacturers() {
            const grid = document.getElementById('pnpManufGrid');
            grid.innerHTML = '';
            if (typeof pnpSearchData === 'undefined') return;

            pnpSearchData.forEach(item => {
                const btn = document.createElement('div');
                btn.className = 'pnp-option-btn';
                btn.textContent = item.manufacturer;
                btn.onclick = () => selectManufacturer(item.manufacturer);
                grid.appendChild(btn);
            });
        }

        function selectManufacturer(manuf) {
            pnpCurrentManuf = manuf;
            updateBreadcrumbs();
            renderModels();
            showStep(2);
        }

        function renderModels() {
            const grid = document.getElementById('pnpModelGrid');
            grid.innerHTML = '';
            const manufData = pnpSearchData.find(m => m.manufacturer === pnpCurrentManuf);
            if (!manufData) return;

            manufData.models.forEach(m => {
                const btn = document.createElement('div');
                btn.className = 'pnp-option-btn';
                btn.textContent = m.model;
                btn.onclick = () => selectModel(m.model);
                grid.appendChild(btn);
            });
        }

        function selectModel(modelName) {
            pnpCurrentModel = modelName;
            updateBreadcrumbs();
            renderDetails();
            showStep(3);
        }

        function renderDetails() {
            const grid = document.getElementById('pnpDetailGrid');
            grid.innerHTML = '';
            const manufData = pnpSearchData.find(m => m.manufacturer === pnpCurrentManuf);
            if (!manufData) return;
            const modelData = manufData.models.find(m => m.model === pnpCurrentModel);
            if (!modelData) return;

            modelData.details.forEach((d, idx) => {
                const btn = document.createElement('div');
                btn.className = 'pnp-option-btn';
                // Format: Year / Code / Sound
                btn.innerHTML = `<strong>${d.year}</strong><br>${d.code}<br>${d.sound}`;
                btn.onclick = () => showResult(d);
                grid.appendChild(btn);
            });
        }

        function showResult(detail) {
            const content = document.getElementById('pnpResultContent');
            content.innerHTML = '';

            // Update Breadcrumbs to include details
            const bc = document.getElementById('pnpBreadcrumbs');
            if (bc) {
                bc.innerHTML += ` > <span class="pnp-crumb-item">${detail.year} / ${detail.code} / ${detail.sound}</span>`;
            }

            // Build Result HTML
            let html = `<div class="pnp-result-card">
                <h4>선택 사양 (Specification)</h4>
                <p><strong>연식:</strong> ${detail.year}</p>
                <p><strong>코드:</strong> ${detail.code}</p>
                <p><strong>사운드:</strong> ${detail.sound}</p>
            </div>`;

            // Integrated Cable Logic
            if (detail.integrated) {
                if (detail.integrated === '본사문의') {
                    html += `<div class="pnp-result-card" style="border-left: 5px solid red;">
                        <h4>차측과 DSP 통합형 케이블</h4>
                        <p style="color:red; font-weight:bold;">본사 문의 요망</p>
                    </div>`;
                } else {
                    html += `<div class="pnp-result-card" style="border-left: 5px solid #007bff;">
                        <h4>차측과 DSP 통합형 케이블</h4>
                        <p style="font-size:1.2rem; font-weight:bold;">${detail.integrated}</p>
                        ${getLinkButton(detail.integrated)}
                    </div>`;
                }
            }

            // Type A Logic
            if (detail.typeA) {
                if (detail.typeA === '해당없음' || detail.typeA === '-') {
                    // Skip
                } else if (detail.typeA === '본사문의') {
                    html += `<div class="pnp-result-card" style="border-left: 5px solid orange;">
                        <h4>A Type(차측 케이블)</h4>
                        <p style="color:red; font-weight:bold;">본사 문의 요망</p>
                    </div>`;
                } else {
                    html += `<div class="pnp-result-card" style="border-left: 5px solid #28a745;">
                        <h4>A Type(차측 케이블)</h4>
                        <p style="font-size:1.2rem; font-weight:bold;">${detail.typeA}</p>
                        ${getLinkButton(detail.typeA)}
                    </div>`;
                }
            }

            content.innerHTML = html;
            showStep(4);
        }

        function getLinkButton(code) {
            // Find product ID by code in productData

            if (typeof productData === 'undefined') return '';
            if (!code || code === 'X' || code === 'x' || code === '-') return '';

            // Handle multiple codes like "HK-101 / HK-102" -> Search just one
            const searchKey = code.split('/')[0].trim();

            // Refined Search Logic:
            // 1. Avoid matching "X" to "RUX-C810" or similar.
            // 2. Ensure searchKey is at least 2 chars long.
            if (searchKey.length < 2) return '';

            // Search product title
            const product = productData.find(p => p.title.includes(searchKey));

            if (product) {
                return `<div class="pnp-link-btn" onclick="window.location.href='pages/products/${product.slug || slugify(product.title) || product.id}.html'">제품 보기 (View Product)</div>`;
            } else {
                return `<span style="color:#999; font-size:0.9rem;">(제품 페이지 없음)</span>`;
            }
        }
    