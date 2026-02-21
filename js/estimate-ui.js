/**
 * Alpine Virtual Estimate UI & Logic
 */
const EstimateUI = {
    selectedCar: null,
    selections: {},

    init() {
        this.renderFloatingButton();
        this.renderModal();
        this.bindEvents();
    },

    renderFloatingButton() {
        const btn = document.createElement('div');
        btn.className = 'estimate-float-btn';
        btn.innerHTML = `
            <img src="assets/images/amark.png" alt="Alpine">
            <span>나의<br>견적</span>
        `;
        btn.onclick = () => this.openModal();
        document.body.appendChild(btn);
    },

    renderModal() {
        const modal = document.createElement('div');
        modal.id = 'estimateModal';
        modal.className = 'estimate-modal';
        modal.innerHTML = `
            <div class="estimate-modal-content">
                <div class="estimate-header">
                    <h2>My 알파인 가상 견적</h2>
                    <span class="close-btn" onclick="EstimateUI.closeModal()">&times;</span>
                </div>
                <div class="estimate-body">
                    <div class="estimate-sidebar">
                        <h3>1단계: 차량 선택</h3>
                        <div class="form-group">
                            <label>제조사</label>
                            <select id="estBrand"><option value="">선택하세요</option></select>
                        </div>
                        <div class="form-group">
                            <label>차종</label>
                            <select id="estModel" disabled><option value="">선택하세요</option></select>
                        </div>
                        <div class="form-group">
                            <label>시스템</label>
                            <select id="estSystem" disabled><option value="">선택하세요</option></select>
                        </div>
                        <hr>
                        <h3>견적 요약</h3>
                        <div id="estSummary">선택된 항목이 없습니다.</div>
                    </div>
                    <div class="estimate-main">
                        <div id="estSelectionArea">
                            <p class="guide-text">차량을 먼저 선택해 주세요.</p>
                        </div>
                    </div>
                </div>
                <div class="estimate-footer">
                    <div>
                        <span>총 합계 (부가세 별도): </span>
                        <span class="total-price" id="estTotalPrice">₩0</span>
                    </div>
                    <button class="sub-filter-btn active" onclick="EstimateUI.saveEstimate()">견적 저장하기</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.populateBrands();
    },

    populateBrands() {
        const brandSelect = document.getElementById('estBrand');
        const brands = [...new Set(estimateData.map(item => item.brand))];
        brands.forEach(brand => {
            const opt = document.createElement('option');
            opt.value = brand;
            opt.textContent = brand;
            brandSelect.appendChild(opt);
        });
    },

    bindEvents() {
        const brandSelect = document.getElementById('estBrand');
        const modelSelect = document.getElementById('estModel');
        const systemSelect = document.getElementById('estSystem');

        brandSelect.onchange = (e) => {
            const brand = e.target.value;
            modelSelect.disabled = !brand;
            modelSelect.innerHTML = '<option value="">선택하세요</option>';
            systemSelect.disabled = true;
            systemSelect.innerHTML = '<option value="">선택하세요</option>';
            if (brand) {
                const models = [...new Set(estimateData.filter(i => i.brand === brand).map(i => i.model))];
                models.forEach(m => {
                    const opt = document.createElement('option');
                    opt.value = m;
                    opt.textContent = m;
                    modelSelect.appendChild(opt);
                });
            }
            this.updateSelectionArea();
        };

        modelSelect.onchange = (e) => {
            const model = e.target.value;
            systemSelect.disabled = !model;
            systemSelect.innerHTML = '<option value="">선택하세요</option>';
            if (model) {
                const systems = estimateData.filter(i => i.brand === brandSelect.value && i.model === model);
                systems.forEach((s, idx) => {
                    const opt = document.createElement('option');
                    opt.value = idx;
                    opt.textContent = `${s.year} ${s.system}`;
                    systemSelect.appendChild(opt);
                });
            }
            this.updateSelectionArea();
        };

        systemSelect.onchange = (e) => {
            const idx = e.target.value;
            if (idx !== "") {
                this.selectedCar = estimateData.filter(i => i.brand === brandSelect.value && i.model === modelSelect.value)[idx];
                this.selections = {}; // Reset selections
                this.updateSelectionArea();
            }
        };
    },

    updateSelectionArea() {
        const main = document.getElementById('estSelectionArea');
        if (!this.selectedCar) {
            main.innerHTML = '<p class="guide-text">차량을 먼저 선택해 주세요.</p>';
            this.calculateTotal();
            return;
        }

        const categories = [
            { id: 'dsp', label: 'DSP 선택 (견적1)' },
            { id: 'pnp', label: 'PnP Cable 선택 (견적2)' },
            { id: 'front_door', label: '전면도어 스피커 선택 (견적3-1)' },
            { id: 'subwoofer', label: '서브우퍼 선택 (견적7)' },
            { id: 'amp_4ch', label: '4채널 앰프 선택 (견적8)' },
            { id: 'amp_sub', label: '서브우퍼 앰프 선택 (견적9)' },
            { id: 'player', label: '플레이어 선택 (견적10)' }
        ];

        let html = `<h3>${this.selectedCar.model} (${this.selectedCar.code}) 제품 선택</h3>`;
        categories.forEach(cat => {
            if (this.selectedCar[cat.id] && this.selectedCar[cat.id].length > 0) {
                html += `<div class="category-block">
                    <h4 style="margin: 20px 0 10px 0;">${cat.label}</h4>
                    <div class="product-grid-mini">
                        ${this.selectedCar[cat.id].map(pName => {
                    const price = this.getProductPrice(pName);
                    const isSelected = this.selections[cat.id] === pName;
                    return `
                                <div class="product-item ${isSelected ? 'selected' : ''}" onclick="EstimateUI.selectProduct('${cat.id}', '${pName}')">
                                    <span>${pName}</span>
                                    <span style="color: #666;">₩${price.toLocaleString()}</span>
                                </div>
                            `;
                }).join('')}
                    </div>
                </div>`;
            }
        });

        main.innerHTML = html;
        this.calculateTotal();
    },

    getProductPrice(name) {
        // Find matching name in price-data.js (initialPriceData)
        // Note: Some names might be combined like "DM-65C + DPS-25M"
        if (name.includes(' + ')) {
            const parts = name.split(' + ');
            let total = 0;
            parts.forEach(p => total += this.getSingleProductPrice(p.trim()));
            return total;
        }
        return this.getSingleProductPrice(name);
    },

    getSingleProductPrice(name) {
        if (!window.initialPriceData) return 0;
        // Search by product name (master category usually has MSRP)
        const items = initialPriceData.filter(i => i.product === name && i.category === 'master');
        if (items.length > 0) return items[0].msrp;

        // Fallback for names that might not exactly match (substring)
        const fallback = initialPriceData.find(i => i.product.includes(name) && i.category === 'master');
        return fallback ? fallback.msrp : 0;
    },

    selectProduct(catId, pName) {
        if (this.selections[catId] === pName) {
            delete this.selections[catId];
        } else {
            this.selections[catId] = pName;
        }
        this.updateSelectionArea();
    },

    calculateTotal() {
        let productTotal = 0;
        let dspPrice = 0;
        let ampPrice = 0;

        const summary = document.getElementById('estSummary');
        const totalPriceEl = document.getElementById('estTotalPrice');

        let summaryHtml = '';

        for (const catId in this.selections) {
            const pName = this.selections[catId];
            const price = this.getProductPrice(pName);
            productTotal += price;

            if (catId === 'dsp') dspPrice = price;
            if (catId === 'amp_4ch' || catId === 'amp_sub') ampPrice += price;

            summaryHtml += `<div class="estimate-summary-item">
                <span>${pName}</span>
                <span>₩${price.toLocaleString()}</span>
            </div>`;
        }

        // Labor Calculation
        // 선택된 DSP 가격의 30%+ 선택된 앰프 가격의 10%
        let labor = (dspPrice * 0.3) + (ampPrice * 0.1);
        if (this.selectedCar && this.selectedCar.extraLabor) {
            labor += this.selectedCar.extraLabor;
        }

        if (productTotal > 0 || labor > 0) {
            summaryHtml += `<hr><div class="estimate-summary-item">
                <span style="font-weight: bold;">기술료</span>
                <span>₩${Math.round(labor).toLocaleString()}</span>
            </div>`;
        } else {
            summaryHtml = '선택된 항목이 없습니다.';
        }

        summary.innerHTML = summaryHtml;
        totalPriceEl.textContent = `₩${Math.round(productTotal + labor).toLocaleString()}`;
    },

    openModal() {
        document.getElementById('estimateModal').style.display = 'block';
    },

    closeModal() {
        document.getElementById('estimateModal').style.display = 'none';
    },

    saveEstimate() {
        alert('준비 중인 기능입니다. (Coming Soon)');
    }
};

// Initialize after data loads
document.addEventListener('DOMContentLoaded', () => {
    EstimateUI.init();
});
