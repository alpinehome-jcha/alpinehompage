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
                    <button class="sub-filter-btn" style="background:#333; color:#fff; margin-right:10px;" onclick="EstimateUI.resetSelections()">초기화</button>
                    <button class="sub-filter-btn active" onclick="EstimateUI.showEstimateSheet()">견적서 보기</button>
                </div>
            </div>
            
            <!-- 견적서 출력용 모달 -->
            <div id="estimatePrintModal" class="estimate-modal" style="z-index: 10001; background: rgba(0,0,0,0.8);">
                <div class="estimate-modal-content" style="max-width: 800px; width: 95%;">
                    <div class="estimate-header no-print">
                        <h2>알파인 가상 견적서</h2>
                        <div style="display:flex; gap:10px;">
                            <button class="sub-filter-btn active" onclick="window.print()" style="padding: 5px 15px;">출력 / PDF 저장</button>
                            <span class="close-btn" onclick="EstimateUI.closePrintModal()">&times;</span>
                        </div>
                    </div>
                    <div id="printableArea" class="printable-area" style="background: #fff; color: #000; padding: 40px; min-height: 800px;">
                        <!-- 견적서 내용이 여기에 동적으로 렌더링됨 -->
                    </div>
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
            { id: 'dsp', label: '1단계: DSP 선택 (견적1)' },
            { id: 'pnp', label: '2단계: PnP Cable 선택 (견적2)' },
            { id: 'front_door', label: '3단계: 전면도어 스피커 선택 (견적3-1)' },
            { id: 'tweeter', label: '3-1단계: 전면 트위터 챔버 선택 (견적3-1-1)' },
            { id: 'add_front', label: '3-2단계: 전면 스피커 추가 선택 (견적3-2)' },
            { id: 'front_baffle', label: '3-3단계: 전면 스피커 가이드 선택 (견적3-3)' },
            { id: 'rear_door', label: '4단계: 후면도어 스피커 선택 (견적4-1)' },
            { id: 'rear_baffle', label: '4-1단계: 후면 스피커 가이드 선택 (견적4-2)' },
            { id: 'center', label: '5단계: 센터스피커 선택 (견적5)' },
            { id: 'surround', label: '6단계: 서라운드스피커 선택 (견적6)' },
            { id: 'subwoofer', label: '7단계: 서브우퍼 선택 (견적7)' },
            { id: 'amp_4ch', label: '8단계: 4채널 앰프 선택 (견적8)' },
            { id: 'amp_sub', label: '9단계: 서브우퍼 앰프 선택 (견적9)' },
            { id: 'player', label: '10단계: 플레이어 선택 (견적10)' }
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
        // 기본: 선택된 DSP 가격의 30% + 선택된 앰프 가격의 10%
        let labor = (dspPrice * 0.3) + (ampPrice * 0.1);

        // 추가 기술료(extraLabor)는 스피커를 선택했을 때만 적용 (사용자 요청)
        const speakerCats = ['front_door', 'tweeter', 'add_front', 'rear_door', 'center', 'surround', 'subwoofer'];
        const hasSpeaker = Object.keys(this.selections).some(catId => speakerCats.includes(catId));

        if (hasSpeaker && this.selectedCar && this.selectedCar.extraLabor) {
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

    closePrintModal() {
        document.getElementById('estimatePrintModal').style.display = 'none';
    },

    resetSelections() {
        if (confirm('모든 선택 내역을 초기화하시겠습니까?')) {
            this.selections = {};
            this.updateSelectionArea();
        }
    },

    showEstimateSheet() {
        if (!this.selectedCar || Object.keys(this.selections).length === 0) {
            alert('먼저 차량을 선택하고 제품을 하나 이상 선택해 주세요.');
            return;
        }

        const printModal = document.getElementById('estimatePrintModal');
        const printArea = document.getElementById('printableArea');
        printModal.style.display = 'block';

        let productHtml = '';
        let productTotal = 0;
        let dspPrice = 0;
        let ampPrice = 0;

        for (const catId in this.selections) {
            const pName = this.selections[catId];
            const price = this.getProductPrice(pName);
            productTotal += price;
            if (catId === 'dsp') dspPrice = price;
            if (catId === 'amp_4ch' || catId === 'amp_sub') ampPrice += price;

            productHtml += `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 12px;">${pName}</td>
                    <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">1</td>
                    <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">₩${price.toLocaleString()}</td>
                    <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">₩${price.toLocaleString()}</td>
                </tr>
            `;
        }

        const speakerCats = ['front_door', 'tweeter', 'add_front', 'rear_door', 'center', 'surround', 'subwoofer'];
        const hasSpeaker = Object.keys(this.selections).some(catId => speakerCats.includes(catId));

        let labor = (dspPrice * 0.3) + (ampPrice * 0.1);
        if (hasSpeaker && this.selectedCar && this.selectedCar.extraLabor) labor += this.selectedCar.extraLabor;
        labor = Math.round(labor);

        const grandTotal = productTotal + labor;
        const vat = Math.round(grandTotal * 0.1);
        const finalTotal = grandTotal + vat;

        const date = new Date().toLocaleDateString();

        printArea.innerHTML = `
            <div style="text-align: center; margin-bottom: 40px;">
                <img src="assets/images/amark.png" style="height: 40px; margin-bottom: 10px;">
                <h1 style="font-size: 28px; margin: 0; letter-spacing: 5px;">견 적 서</h1>
            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                <div style="width: 45%;">
                    <p style="margin: 5px 0;"><strong>차량정보:</strong> ${this.selectedCar.brand} ${this.selectedCar.model} (${this.selectedCar.code})</p>
                    <p style="margin: 5px 0;"><strong>시스템명:</strong> ${this.selectedCar.system}</p>
                    <p style="margin: 5px 0;"><strong>견적일자:</strong> ${date}</p>
                </div>
                <div style="width: 45%; text-align: right;">
                    <p style="margin: 5px 0; font-size: 1.2rem;"><strong>수신:</strong> 고객님 귀하</p>
                </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                    <tr style="background: #f8f8f8;">
                        <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">품명 및 규격</th>
                        <th style="border: 1px solid #ddd; padding: 12px; text-align: right; width: 60px;">수량</th>
                        <th style="border: 1px solid #ddd; padding: 12px; text-align: right; width: 120px;">단가</th>
                        <th style="border: 1px solid #ddd; padding: 12px; text-align: right; width: 120px;">금액</th>
                    </tr>
                </thead>
                <tbody>
                    ${productHtml}
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 12px;">제품 인스톨 기술료</td>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">1</td>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">₩${labor.toLocaleString()}</td>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">₩${labor.toLocaleString()}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr style="background: #fdfdfd;">
                        <td colspan="3" style="border: 1px solid #ddd; padding: 12px; text-align: right; font-weight: bold;">소계 (Net)</td>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: right; font-weight: bold;">₩${grandTotal.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="border: 1px solid #ddd; padding: 12px; text-align: right;">부가가치세 (VAT 10%)</td>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">₩${vat.toLocaleString()}</td>
                    </tr>
                    <tr style="background: #333; color: #fff;">
                        <td colspan="3" style="border: 1px solid #ddd; padding: 12px; text-align: right; font-weight: bold; font-size: 1.1rem;">합계 금액 (Total)</td>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: right; font-weight: bold; font-size: 1.1rem;">₩${finalTotal.toLocaleString()}</td>
                    </tr>
                </tfoot>
            </table>

            <div style="margin-top: 50px; border: 1px solid #eee; padding: 20px; font-size: 0.9rem; line-height: 1.6; color: #555;">
                <p style="margin: 0; font-weight: bold; color: #333; margin-bottom: 5px;">[ 안내사항 ]</p>
                <p style="margin: 0;">1. 본 견적서는 알파인 카오디오 가상 견적 시뮬레이션 결과로 실제 작업 환경에 따라 차이가 있을 수 있습니다.</p>
                <p style="margin: 0;">2. 정확한 상담은 가까운 알파인 대리점(Partner Zone)을 방문하여 주시기 바랍니다.</p>
                <p style="margin: 0;">3. 기술료는 기본 장착 표준 공임이며, 차량 상태 및 추가 커스텀 작업 시 변동될 수 있습니다.</p>
            </div>
        `;
    }
};

// Initialize after data loads
document.addEventListener('DOMContentLoaded', () => {
    EstimateUI.init();
});
