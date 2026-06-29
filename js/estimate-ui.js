/**
 * Alpine Virtual Estimate UI & Logic
 */
const EstimateUI = {
    selectedCar: null,
    selections: {},
    priceData: [],

    async init() {
        await this.loadDataScripts();
        this.renderFloatingButton();
        this.renderModal();
        this.bindEvents();
    },

    async loadDataScripts() {
        // 경로 보정
        let root = 'js/';
        const pathname = window.location.pathname;
        if (pathname.includes('/pages/products/')) {
            root = '../../js/';
        } else if (pathname.includes('/pages/') || pathname.includes('/support/')) {
            root = '../js/';
        }

        // URL sync parameter check
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('sync') === 'true') {
            console.log("Forcing manual data synchronization...");
            localStorage.removeItem('estimateData');
            localStorage.removeItem('estimateDataVersion');
            localStorage.removeItem('estimate_sync_pending');
            localStorage.removeItem('pnpSearchData');
            localStorage.removeItem('pnpSearchDataVersion');
            // Clean URL after clear
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // 1분 단위 캐시 버스팅 (기본)
        // sync=true 파라미터가 있으면 즉시(Date.now())로 강제 초기화
        let t = Math.floor(Date.now() / (1000 * 60));
        if (urlParams.get('sync') === 'true') {
            t = Date.now(); // Force network fetch
        }

        const scripts = [];
        if (typeof estimateData === 'undefined') scripts.push(`${root}estimate-data.js?t=${t}`);
        if (typeof pnpSearchData === 'undefined') scripts.push(`${root}pnp-search-data.js?t=${t}`);
        if (typeof initialPnpRuleData === 'undefined') scripts.push(`${root}pnp-rule-data.js?t=${t}`);
        if (typeof laborRuleData === 'undefined') scripts.push(`${root}labor-rule-data.js?t=${t}`);

        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error(`Script load error: ${src}`));
                document.head.appendChild(script);
            });
        };

        try {
            await Promise.all(scripts.map(loadScript));

            // 로컬 스토리지 캐시 최우선 적용 (엑셀 즉각 반영 보장)
            if (typeof localStorage !== 'undefined') {
                const storedEst = localStorage.getItem('estimateData');
                if (storedEst) {
                    try {
                        window.estimateData = JSON.parse(storedEst);
                        console.log("Cached estimateData from LocalStorage synced successfully.");
                    } catch (e) {
                        console.error("Failed to parse local cached estimateData:", e);
                    }
                }
            }

            if (typeof fetchPriceList === 'function') {
                this.priceData = await fetchPriceList();
            } else {
                console.warn("fetchPriceList not available, using fallback if any");
                this.priceData = typeof initialPriceData !== 'undefined' ? initialPriceData : [];
            }
            console.log("Alpine Estimate Data Loaded (Cache-Busted)");
        } catch (err) {
            console.error("Failed to load Alpine Estimate data updates:", err);
            // Fallback: If data variables are missing, show error
            if (typeof estimateData === 'undefined') {
                console.warn("Using fallback static script loading might be required.");
            }
            this.priceData = typeof initialPriceData !== 'undefined' ? initialPriceData : [];
        }
    },

    renderFloatingButton() {
        // 경로 보정: 현재 페이지 위치에 따라 assets 경로 조정
        let root = './';
        const pathname = window.location.pathname;
        if (pathname.includes('/pages/products/')) {
            root = '../../';
        } else if (pathname.includes('/pages/') || pathname.includes('/support/')) {
            root = '../';
        }

        const btn = document.createElement('div');
        btn.className = 'estimate-float-btn';
        btn.innerHTML = `
            <img src="${root}assets/images/amark.png" alt="Alpine">
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
            <style>
                #estimateModal .estimate-modal-content {
                    max-height: 90vh;
                    overflow-y: auto;
                }
                #estimatePrintModal .estimate-modal-content {
                    max-height: 95vh;
                    overflow-y: auto;
                }
                @media print {
                    .no-print { display: none !important; }
                    .printable-area { padding: 0 !important; }
                }
                /* 모바일 최적화 */
                @media (max-width: 768px) {
                    #estimateModal {
                        overflow-y: auto;
                    }
                    #estimateModal .estimate-modal-content {
                        width: 95%;
                        height: auto;
                        max-height: none;
                        margin: 20px auto;
                        padding: 15px;
                        display: block; /* flex 해제하여 자연스러운 확장 */
                    }
                    #estimateModal .estimate-body {
                        flex-direction: column;
                        overflow: visible; /* 내부 스크롤 제거 */
                        height: auto;
                    }
                    #estimateModal .estimate-sidebar {
                        width: 100%;
                        height: auto;
                        overflow: visible;
                        border-right: none;
                        border-bottom: 1px solid #eee;
                        padding: 0 0 20px 0;
                        margin-bottom: 20px;
                    }
                    #estimateModal .estimate-main {
                        padding-left: 0;
                        height: auto;
                        overflow: visible;
                    }
                    .estimate-footer {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 10px;
                    }
                    .estimate-footer > div {
                        text-align: center;
                        margin-bottom: 5px;
                    }
                    .estimate-footer .sub-filter-btn {
                        width: 100%;
                        margin-right: 0 !important;
                        margin-bottom: 5px;
                    }
                    /* 제품 그리드 모바일 1열 출력 */
                    .product-grid-mini {
                        grid-template-columns: 1fr !important;
                    }
                    /* 견적서 모바일 최적화 */
                    #estimatePrintModal .estimate-modal-content {
                        width: 100% !important;
                        margin: 0 !important;
                        height: 100% !important;
                        max-height: none !important;
                        border-radius: 0 !important;
                    }
                    .printable-area {
                        padding: 15px !important;
                        font-size: 0.8rem !important;
                    }
                    .printable-area table {
                        font-size: 0.75rem !important;
                    }
                    .printable-area th, .printable-area td {
                        padding: 8px 4px !important;
                    }
                    .printable-area h1 {
                        font-size: 1.2rem !important;
                    }
                }
            </style>
            <div class="estimate-modal-content">
                <div class="estimate-header">
                    <h2>My 알파인 가상 견적</h2>
                    <span class="close-btn" onclick="EstimateUI.closeModal()">&times;</span>
                </div>
                <div class="estimate-body">
                    <div class="estimate-sidebar">
                        <div class="form-group">
                            <label>0단계: 추천 레벨</label>
                            <select id="estLevel">
                                <option value="custom">개별 선택 (기본)</option>
                                <option value="입문용">입문용</option>
                                <option value="가성비">가성비</option>
                                <option value="프로">프로</option>
                                <option value="하이엔드">하이엔드</option>
                                <option value="어나더레벨">어나더레벨</option>
                            </select>
                        </div>
                        <hr>
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
                            <label>사운드시스템</label>
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
                <div class="estimate-footer" style="flex-wrap: wrap;">
                    <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <div>
                            <span>총 합계: </span>
                            <span class="total-price" id="estTotalPrice">₩0</span>
                        </div>
                        <div style="font-size: 0.65rem; color: #aaa;">
                            Server: ${typeof ESTIMATE_DATA_VERSION !== 'undefined' ? ESTIMATE_DATA_VERSION : 'N/A'} | 
                            Local: ${localStorage.getItem('estimateDataVersion') || 'N/A'}
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; width: 100%; justify-content: flex-end;">
                        <button class="sub-filter-btn" style="background:#333; color:#fff;" onclick="EstimateUI.resetSelections()">초기화</button>
                        <button class="sub-filter-btn" style="background:#4b0082; color:#fff;" onclick="EstimateUI.showSystemDiagram()">시스템도</button>
                        <button class="sub-filter-btn" style="background:#007aff; color:#fff;" onclick="EstimateUI.showAIAssessment()">AI의 평가</button>
                        <button class="sub-filter-btn active" onclick="EstimateUI.showEstimateSheet()">견적서 보기</button>
                    </div>
                </div>
            </div>

            <!-- AI 가상 평가 모달 -->
            <div id="estimateAIModal" class="estimate-modal" style="z-index: 10002; background: rgba(0,0,0,0.8);">
                <div class="estimate-modal-content" style="max-width: 600px; width: 90%; background:#fff; border-radius:8px;">
                    <div class="estimate-header" style="padding: 20px; border-bottom: 1px solid #eee;">
                        <h2 style="margin:0;">🤖 알파인 AI 구성 분석</h2>
                        <span class="close-btn" onclick="EstimateUI.closeAIModal()">&times;</span>
                    </div>
                    <div id="aiAssessmentArea" style="padding: 30px; line-height: 1.6; color: #333; font-size: 1rem;">
                        <!-- AI 평가 내용이 여기에 렌더링됨 -->
                    </div>
                    <div style="padding: 20px; text-align: center; border-top: 1px solid #eee;">
                        <button class="sub-filter-btn active" onclick="EstimateUI.closeAIModal()" style="padding: 8px 40px;">확인</button>
                    </div>
                </div>
            </div>
            
            <!-- 견적서 출력용 모달 -->
            <div id="estimatePrintModal" class="estimate-modal" style="z-index: 10001; background: rgba(0,0,0,0.8);">
                <div class="estimate-modal-content" style="max-width: 800px; width: 95%; background:#fff; border-radius:8px;">
                    <div class="estimate-header no-print" style="padding: 20px; border-bottom: 1px solid #eee;">
                        <h2 style="margin:0;">알파인 사운드 견적서 미리보기</h2>
                        <div style="display:flex; gap:10px; align-items:center;">
                            <button class="sub-filter-btn active" onclick="EstimateUI.downloadAsImage()" style="padding: 8px 20px; font-weight:bold;">이미지로 다운로드</button>
                            <span class="close-btn" onclick="EstimateUI.closePrintModal()">&times;</span>
                        </div>
                    </div>
                    <div id="printableArea" class="printable-area" style="background: #fff; color: #000; padding: 40px; border: 2px solid #333; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin: 0 auto;">
                        <!-- 견적서 내용이 여기에 동적으로 렌더링됨 -->
                    </div>
                </div>
            </div>

            <!-- 시스템도 출력용 모달 -->
            <div id="estimateSystemModal" class="estimate-modal" style="z-index: 10001; background: rgba(0,0,0,0.8); display: none;">
                <div class="estimate-modal-content" style="max-width: 900px; width: 95%; background:#fff; border-radius:8px;">
                    <div class="estimate-header no-print" style="padding: 20px; border-bottom: 1px solid #eee;">
                        <h2 style="margin:0;">알파인 사운드 시스템</h2>
                        <div style="display:flex; gap:10px; align-items:center;">
                            <button class="sub-filter-btn active" onclick="EstimateUI.downloadSystemAsImage()" style="padding: 8px 20px; font-weight:bold;">이미지로 다운로드</button>
                            <span class="close-btn" onclick="EstimateUI.closeSystemModal()">&times;</span>
                        </div>
                    </div>
                    <div id="systemPrintableArea" class="printable-area" style="background: #fff; color: #000; padding: 40px; border: 2px solid #333; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin: 0 auto;">
                        <!-- 시스템도 내용이 여기에 동적으로 렌더링됨 -->
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.populateBrands();
    },

    async downloadAsImage() {
        const area = document.getElementById('printableArea');
        if (!area) return;

        const btn = document.querySelector('button[onclick="EstimateUI.downloadAsImage()"]');
        const originalText = btn.innerText;
        btn.innerText = "저장 중...";
        btn.disabled = true;

        try {
            // html2canvas 옵션 설정: 스케일을 높여서 선명하게 저장
            const canvas = await html2canvas(area, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff"
            });

            const link = document.createElement('a');
            const carName = this.selectedCar ? `${this.selectedCar.brand}_${this.selectedCar.model}` : "알파인_견적서";
            link.download = `Alpine_Estimate_${carName}_${new Date().getTime()}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (err) {
            console.error("이미지 저장 실패:", err);
            alert("이미지 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    },


    populateBrands() {
        const brandSelect = document.getElementById('estBrand');
        let brands = [...new Set(estimateData.map(item => item.brand))];

        // Custom sort: Hyundai, Kia, Genesis first
        const priority = ["현대자동차", "기아자동차", "제네시스"];
        brands.sort((a, b) => {
            const indexA = priority.indexOf(a);
            const indexB = priority.indexOf(b);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.localeCompare(b);
        });

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
                models.sort().forEach(m => {
                    const opt = document.createElement('option');
                    opt.value = m;
                    opt.textContent = m;
                    modelSelect.appendChild(opt);
                });
            }
            this.selectedCar = null;
            this.selections = {};
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
                    opt.textContent = `${s.year} ${s.system} (${s.code})`;
                    systemSelect.appendChild(opt);
                });
            }
            this.selectedCar = null;
            this.selections = {};
            this.updateSelectionArea();
        };

        systemSelect.onchange = (e) => {
            const idx = e.target.value;
            if (idx !== "") {
                this.selectedCar = estimateData.filter(i => i.brand === brandSelect.value && i.model === modelSelect.value)[idx];
                this.selections = {};
                // 차량 변경 시 추천 레벨이 설정되어 있다면 바로 적용
                const level = document.getElementById('estLevel').value;
                if (level !== "custom") {
                    this.applyRecommendationLevel(level);
                } else {
                    this.updateSelectionArea();
                }
            }
        };

        const levelSelect = document.getElementById('estLevel');
        levelSelect.onchange = (e) => {
            const level = e.target.value;
            if (this.selectedCar) {
                this.applyRecommendationLevel(level);
            }
        };
    },

    applyRecommendationLevel(level) {
        if (level === "custom") return;

        this.selections = {};
        const categories = [
            'dsp', 'front_door', 'tweeter', 'add_front', 'front_baffle',
            'rear_door', 'rear_baffle', 'center', 'surround', 'subwoofer',
            'amp_4ch', 'amp_sub', 'player'
        ];

        // 1단계 DSP 선택
        const dspList = this.selectedCar.dsp || [];
        this.selections['dsp'] = this.findBestMatch(dspList, level);

        // PnP Cable (DSP 선택에 따른 자동 선택 로직 재사용)
        if (this.selections['dsp'] && this.selections['dsp'] !== "DSP 선택 안함") {
            const pnpList = this.selectedCar.pnp || [];

            const carSideList = pnpList.filter(p => !p.startsWith('DS-'));
            const dspSideList = pnpList.filter(p => p.startsWith('DS-'));

            const integrated = carSideList.filter(p => !p.endsWith('A'));
            const matchedInt = this.getMatchedIntegrated(this.selections['dsp'], integrated);

            if (matchedInt) {
                this.selections['pnp'] = [matchedInt];
            } else {
                const typeA = carSideList.filter(p => p.endsWith('A'));
                const matchedB = this.getMatchedTypeB(this.selections['dsp'], dspSideList);
                this.selections['pnp'] = [...typeA, matchedB].filter(Boolean);
            }
        }

        // 나머지 카테고리 자동 선택
        categories.filter(c => c !== 'dsp').forEach(cat => {
            const list = this.selectedCar[cat] || [];
            if (list.length > 0) {
                // 서브우퍼 앰프는 서브우퍼가 패시브일 때만 (Logic in updateSelectionArea will handle visibility, but we select here)
                if (cat === 'amp_sub') {
                    const sub = this.selections['subwoofer'];
                    if (sub === "PWE-M770" || sub === "선택 안함") return;
                }
                // 트위터 챔버는 특정 전면 스피커일 때만
                if (cat === 'tweeter') {
                    const front = this.selections['front_door'];
                    const isHDZ = (front === "HDZ-65C" || front === "HDZ-653S" || front === "HDZ-653C");
                    if (!isHDZ) return;
                }

                const match = this.findBestMatch(list, level);
                // 11, 12, 13단계 (amp_4ch, amp_sub, player)는 동일 레벨일 때만 자동 선택
                if (['amp_4ch', 'amp_sub', 'player'].includes(cat)) {
                    if (this.getProductRank(match) === level) {
                        this.selections[cat] = match;
                    } else {
                        this.selections[cat] = "선택 안함";
                    }
                } else {
                    this.selections[cat] = match;
                }
            }
        });

        this.updateSelectionArea();
    },

    findBestMatch(list, level) {
        if (!list || list.length === 0) return null;
        const items = list.filter(i => i !== "선택 안함" && i !== "DSP 선택 안함");
        if (items.length === 0) return list[0];

        // 항목이 1개뿐인 경우 무조건 선택
        if (items.length === 1) return items[0];

        // 레벨 순서: 입문용(0) → 가성비(1) → 프로(2) → 하이엔드(3) → 어나더레벨(4)
        const levels = ['입문용', '가성비', '프로', '하이엔드', '어나더레벨'];
        const targetIdx = levels.indexOf(level);

        // 탐색 순서: 목표 → 한단계 아래 → 한단계 위 → 두단계 아래 → 두단계 위 ...
        const searchOrder = [targetIdx];
        for (let step = 1; step < levels.length; step++) {
            if (targetIdx - step >= 0) searchOrder.push(targetIdx - step);
            if (targetIdx + step < levels.length) searchOrder.push(targetIdx + step);
        }

        for (const idx of searchOrder) {
            const match = items.find(i => this.getProductRank(i) === levels[idx]);
            if (match) return match;
        }

        // 레벨 매핑이 없는 항목은 가격 기반으로 선택 (최후 수단)
        const sorted = [...items].sort((a, b) => this.getProductPrice(a) - this.getProductPrice(b));
        const isHighEnd = (level === "하이엔드" || level === "어나더레벨");
        return isHighEnd ? sorted[sorted.length - 1] : sorted[0];
    },

    getProductRank(name) {
        const ranks = {
            "PXE-M60-4": "입문용",
            "PXE-R80-8": "입문용",
            "PXE-R100-8": "가성비",
            "PXE-X120-8": "가성비",
            "PXE-C80-88": "프로",
            "PXE-X120-10DP": "프로",
            "PXE-X121-12EV": "하이엔드",
            "HDP-D90": "어나더레벨",
            "DM-65C": "입문용",
            "DM-65": "입문용",
            "S2-S65C": "가성비",
            "S2-S65": "가성비",
            "S2-S10TW": "가성비",
            "R2-S653": "프로",
            "DPS-25M": "프로",
            "DP2-653": "하이엔드",
            "DP2-65C": "하이엔드",
            "DP2-35M": "하이엔드",
            "HDZ-653": "어나더레벨",
            "HDZ-653S": "어나더레벨",
            "HDZ-65C": "어나더레벨",
            "HDZ-65CS": "어나더레벨",
            "HDZ-65": "어나더레벨",
            "PWE-M770": "입문용",
            "S2-W8D4 (외장박스 포함)": "가성비",
            "S2-W10D2 (외장박스 포함)": "프로",
            "S2-W12D2 (외장박스 포함)": "프로",
            "RS-W10D2 (외장박스 포함)": "하이엔드",
            "HDZ-W10": "어나더레벨",
            "R2-A60F": "하이엔드",
            "S2-A60F": "하이엔드",
            "S2-A60M": "하이엔드",
            "HDA-F60": "어나더레벨",
            "HDS-990": "어나더레벨"
        };
        return ranks[name] || "";
    },

    getProductWithRank(name) {
        if (name === "선택 안함" || name === "DSP 선택 안함") return name;

        const ranks = {
            // DSPs
            "PXE-M60-4": "[입문용] PXE-M60-4",
            "PXE-R80-8": "[입문용] PXE-R80-8",
            "PXE-R100-8": "[가성비] PXE-R100-8",
            "PXE-X120-8": "[가성비] PXE-X120-8",
            "PXE-C80-88": "[프로] PXE-C80-88",
            "PXE-X120-10DP": "[프로] PXE-X120-10DP",
            "PXE-X121-12EV": "[하이엔드] PXE-X121-12EV",
            "HDP-D90": "[어나더레벨] HDP-D90",

            // Speakers
            "DM-65C": "[입문용] DM-65C",
            "DM-65": "[입문용] DM-65",
            "S2-S65C": "[가성비] S2-S65C",
            "S2-S65": "[가성비] S2-S65",
            "S2-S10TW": "[가성비] S2-S10TW",
            "R2-S653": "[프로] R2-S653",
            "DPS-25M": "[프로] DPS-25M",
            "DP2-653": "[하이엔드] DP2-653",
            "DP2-65C": "[하이엔드] DP2-65C",
            "DP2-35M": "[하이엔드] DP2-35M",
            "HDZ-653": "[어나더레벨] HDZ-653",
            "HDZ-653S": "[어나더레벨] HDZ-653S",
            "HDZ-65C": "[어나더레벨] HDZ-65C",
            "HDZ-65CS": "[어나더레벨] HDZ-65CS",
            "HDZ-65": "[어나더레벨] HDZ-65",

            // Subwoofers & Amps
            "PWE-M770": "[입문용] PWE-M770",
            "S2-W8D4 (외장박스 포함)": "[가성비] S2-W8D4 (외장박스 포함)",
            "S2-W10D2 (외장박스 포함)": "[프로] S2-W10D2 (외장박스 포함)",
            "S2-W12D2 (외장박스 포함)": "[프로] S2-W12D2 (외장박스 포함)",
            "RS-W10D2 (외장박스 포함)": "[하이엔드] RS-W10D2 (외장박스 포함)",
            "HDZ-W10": "[어나더레벨] HDZ-W10",

            "R2-A60F": "[하이엔드] R2-A60F",
            "S2-A60F": "[하이엔드] S2-A60F",
            "S2-A60M": "[하이엔드] S2-A60M",
            "HDA-F60": "[어나더레벨] HDA-F60",

            // Players
            "HDS-990": "[어나더레벨] HDS-990"
        };
        return ranks[name] || name;
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
            { id: 'tweeter', label: '4단계: 전면 트위터 챔버 선택 (견적3-1-1)' },
            { id: 'add_front', label: '4단계: 전면 스피커 추가 선택 (견적3-2)' },
            { id: 'front_baffle', label: '5단계: 전면 스피커 가이드 선택 (견적3-3)' },
            { id: 'rear_door', label: '6단계: 후면도어 스피커 선택 (견적4-1)' },
            { id: 'rear_baffle', label: '7단계: 후면 스피커 가이드 선택 (견적4-2)' },
            { id: 'center', label: '8단계: 센터스피커 선택 (견적5)' },
            { id: 'surround', label: '9단계: 서라운드스피커 선택 (견적6)' },
            { id: 'subwoofer', label: '10단계: 서브우퍼 선택 (견적7)' },
            { id: 'amp_4ch', label: '11단계: 4채널 앰프 선택 (견적8)' },
            { id: 'amp_sub', label: '12단계: 서브우퍼 앰프 선택 (견적9)' },
            { id: 'player', label: '13단계: 플레이어 선택 (견적10)' }
        ];

        let html = `<h3>${this.selectedCar.model} (${this.selectedCar.code}) 제품 선택</h3>`;

        const dspList = ["DSP 선택 안함", ...(this.selectedCar.dsp || [])];
        const selectedDsp = this.selections['dsp'];
        const selectedFront = this.selections['front_door'];

        let stepCompleted = true; // 컨트롤 플래그: 이전 단계가 완료되었는지 확인

        categories.forEach((cat, idx) => {
            let list = (cat.id === 'dsp') ? dspList : (this.selectedCar[cat.id] || []);

            // 3단계부터 13단계까지 데이터가 있는 경우 '선택 안함' 추가
            if (cat.id !== 'dsp' && cat.id !== 'pnp' && list.length > 0) {
                if (!list.includes("선택 안함")) {
                    list = ["선택 안함", ...list];
                }
            }

            // --- 시나리오별 노출 로직 (Sequential Flow) ---

            // 1. 기초 가시성 필터 (비즈니스 로직 기반)
            let logicVisible = true;

            if (cat.id === 'pnp') {
                if (!selectedDsp || selectedDsp === "DSP 선택 안함") logicVisible = false;
            }
            if (cat.id === 'tweeter') {
                const isHDZ = (selectedFront === "HDZ-65C" || selectedFront === "HDZ-653");
                if (!isHDZ) logicVisible = false;
            }
            if (cat.id === 'amp_sub') {
                const selectedSub = this.selections['subwoofer'];
                if (!selectedSub || selectedSub === "PWE-M770" || selectedSub === "선택 안함") logicVisible = false;
            }
            // 그 외 카테고리는 데이터 유무(list.length)로 기본 판단함

            // 2. 동적 흐름 제어 (Step-by-Step)
            // 1단계(DSP)는 항상 노출 대상 시도
            if (cat.id !== 'dsp') {
                // 이전 단계에서 '입력'이 멈췄다면 이후는 출력하지 않음
                if (!stepCompleted) return;
            }

            // 3. 실제 렌더링 및 다음 단계 허용 여부 결정
            if (logicVisible && list.length > 0) {
                // 화면에 노출
                if (cat.id === 'pnp') {
                    html += this.renderPnPSection(cat.label, list, selectedDsp);
                    // PnP는 자동 선택되므로 항상 완료로 간주
                } else {
                    html += `<div class="category-block" data-step="${cat.id}">
                        <h4 style="margin: 20px 0 10px 0;">${cat.label}</h4>
                        <div class="product-grid-mini">
                            ${list.map(pName => {
                        const price = (pName === "선택 안함" || pName === "DSP 선택 안함") ? 0 : this.getProductPrice(pName);
                        const displayName = this.getProductWithRank(pName);
                        const isSelected = (this.selections[cat.id] === pName || (Array.isArray(this.selections[cat.id]) && this.selections[cat.id].includes(pName)));
                        const escapedPName = pName.replace(/'/g, "\\'").replace(/"/g, "&quot;");
                        return `
                                    <div class="product-item ${isSelected ? 'selected' : ''}" onclick="EstimateUI.selectProduct('${cat.id}', '${escapedPName}')">
                                        <span>${displayName}</span>
                                        <span style="color: #666;">${(pName === "선택 안함" || pName === "DSP 선택 안함") ? "" : "₩" + price.toLocaleString()}</span>
                                    </div>
                                `;
                    }).join('')}
                        </div>
                    </div>`;

                    // 선택 여부 확인: 선택이 안 되었으면 브레이크
                    const val = this.selections[cat.id];
                    if (!val || val === "") {
                        stepCompleted = false;
                    }
                }
            } else {
                // 이 단계가 데이터가 없거나 로직상 미노출이면,
                // 이전 stepCompleted 상태를 유지하며 다음 카테고리로 넘어감 (Skip)
            }
        });

        main.innerHTML = html;
        this.calculateTotal();

    },

    renderPnPSection(label, list, selectedDsp) {
        // 'list' contains all PnP cables assigned to the selected car.
        const integrated = list.filter(p => !p.endsWith('A') && !p.startsWith('DS-'));
        const typeA = list.filter(p => p.endsWith('A'));
        const typeBLineup = list.filter(p => p.startsWith('DS-'));

        const matchedIntegrated = this.getMatchedIntegrated(selectedDsp, integrated);

        let html = `<div class="category-block" data-step="pnp">
            <h4 style="margin: 20px 0 10px 0;">${label}</h4>`;

        if (matchedIntegrated) {
            html += `<div class="product-grid-mini">
                <div class="product-item selected">
                    <span>${matchedIntegrated} (통합형 자동 선택)</span>
                    <span style="color: #666;">₩${this.getProductPrice(matchedIntegrated).toLocaleString()}</span>
                </div>
            </div>`;
        } else {
            html += `<p style="font-size:0.85rem; color:#888; margin-bottom:5px;">통합형 PnP가 없어 A타입과 B타입이 자동 선택됩니다.</p>
            <div class="product-grid-mini">`;
            typeA.forEach(p => {
                html += `<div class="product-item selected">
                    <span>${p} (A타입 자동)</span>
                    <span style="color: #666;">₩${this.getProductPrice(p).toLocaleString()}</span>
                </div>`;
            });

            // Fix: pass the typeBLineup (DSP PnP lists assigned to car) to find the intersection
            const matchedB = this.getMatchedTypeB(selectedDsp, typeBLineup);
            if (matchedB) {
                html += `<div class="product-item selected">
                    <span>${matchedB} (B타입 자동)</span>
                    <span style="color: #666;">₩${this.getProductPrice(matchedB).toLocaleString()}</span>
                </div>`;
            }
            html += `</div>`;
        }
        html += `</div>`;
        return html;
    },

    getMatchedIntegrated(dsp, list) {
        if (!dsp || dsp === "DSP 선택 안함") return null;
        if (typeof pnpRuleData === 'undefined' || !pnpRuleData) return null;

        const rule = pnpRuleData.find(r => r.dsp === dsp);
        if (!rule || !rule.integrated || rule.integrated.length === 0) return null;

        // Return the first match found in both the rule list AND the car's supported list
        return list.find(p => rule.integrated.includes(p)) || null;
    },

    getMatchedTypeB(dsp, carDspPnpList = []) {
        if (!dsp || dsp === "DSP 선택 안함") return null;
        if (typeof pnpRuleData === 'undefined' || !pnpRuleData) return null;

        const rule = pnpRuleData.find(r => r.dsp === dsp);
        if (!rule || !rule.typeB || rule.typeB.length === 0) return null;

        // If carDspPnpList is provided, find the intersection
        if (carDspPnpList && carDspPnpList.length > 0) {
            return carDspPnpList.find(p => rule.typeB.includes(p)) || null;
        }

        // Fallback: If no car list is provided (though it should be), just return the first rule matched
        return rule.typeB[0] || null;
    },

    selectProduct(catId, pName) {
        if (catId === 'dsp') {
            this.selections = { 'dsp': pName };
            if (pName !== "DSP 선택 안함") {
                const list = this.selectedCar.pnp || [];
                // 차측 PnP (Integrated, Type A) 리스트
                const carSideList = list.filter(p => !p.startsWith('DS-'));
                // DSP PnP (Type B) 리스트
                const dspSideList = list.filter(p => p.startsWith('DS-'));

                const integrated = carSideList.filter(p => !p.endsWith('A'));
                const matchedInt = this.getMatchedIntegrated(pName, integrated);

                if (matchedInt) {
                    this.selections['pnp'] = [matchedInt];
                } else {
                    const typeA = carSideList.filter(p => p.endsWith('A'));
                    const matchedB = this.getMatchedTypeB(pName, dspSideList);
                    this.selections['pnp'] = [...typeA, matchedB].filter(Boolean);
                }
            }
        } else {
            if (this.selections[catId] === pName) {
                delete this.selections[catId];
            } else {
                this.selections[catId] = pName;
            }
        }
        // 사용자가 수동으로 선택을 변경하면 추천 레벨을 '개별 선택'으로 초기화
        document.getElementById('estLevel').value = 'custom';
        this.updateSelectionArea();

        // [스크롤 이동 로직 추가] 다음 미선택 단계로 부드럽게 이동
        setTimeout(() => {
            const blocks = document.querySelectorAll('#estSelectionArea .category-block');
            let targetBlock = null;

            for (let block of blocks) {
                // 해당 단계 블록 안에서 사용자가 항목(상품, 선택 안함 등)을 선택했는지 확인
                const hasSelection = block.querySelector('.product-item.selected');
                
                if (!hasSelection) {
                    // PnP 타입이면서 매칭된 데이터가 없어 product-item 자체가 없는 예외 방어
                    if (block.getAttribute('data-step') === 'pnp' && !block.querySelector('.product-item')) {
                        continue; 
                    }
                    targetBlock = block;
                    break;
                }
            }

            // 마지막 단계까지 모두 선택했다면 targetBlock은 null이 되며 이동하지 않음
            if (targetBlock) {
                // 모달 내부 영역의 스크롤을 올바르게 제어하고, 고정 헤더나 하단부에 가려지는 현상을
                // 막기 위해 요소를 뷰포트의 정중앙(center)에 부드럽게 가져다 둡니다.
                targetBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 50);
    },

    getProductPrice(name) {
        if (name === "DSP 선택 안함") return 0;
        if (name.includes('+')) {
            const parts = name.split('+');
            let total = 0;
            parts.forEach(p => total += this.getSingleProductPrice(p.trim()));
            return total;
        }
        return this.getSingleProductPrice(name);
    },

    getSingleProductPrice(name) {
        if (name === "커스텀 배플" || name === "현대/기아 6.5\" 배플") return 50000;
        if (name === "KGM 5.5\" to 6.5\" 배플") return 20000;
        if (name === "GE-203") return 150000;
        if (!this.priceData || this.priceData.length === 0) return 0;
        const items = this.priceData.filter(i => i.product === name && i.category === 'master');
        if (items.length > 0) return Number(items[0].msrp) || 0;

        // PnP Cable pattern fallback (e.g., matching HK-103 into "HK-101 / HK-102 / HK-103")
        const trimmed = name.trim();
        const fallback = this.priceData.find(i => {
            if (i.category !== 'master') return false;
            const target = i.product.trim();
            if (target === trimmed) return true;
            if (trimmed.startsWith('HK-') || trimmed.startsWith('BM-') || trimmed.startsWith('BZ-') || trimmed.startsWith('GE-') || trimmed.startsWith('KG-')) {
                return target.includes(trimmed);
            }
            return false;
        });
        return fallback ? (Number(fallback.msrp) || 0) : 0;
    },

    calculateTotal() {
        let productTotal = 0;
        let dspPrice = 0;
        let ampPrice = 0;
        const summary = document.getElementById('estSummary');
        const totalPriceEl = document.getElementById('estTotalPrice');
        let summaryHtml = '';

        const categoryLabels = {
            'dsp': '1단계: DSP',
            'pnp': '2단계: PnP Cable',
            'front_door': '3단계: 전면도어 스피커',
            'tweeter': '4단계: 전면 트위터 챔버',
            'add_front': '4단계: 전면 스피커 추가',
            'front_baffle': '5단계: 전면 스피커 가이드',
            'rear_door': '6단계: 후면도어 스피커',
            'rear_baffle': '7단계: 후면 스피커 가이드',
            'center': '8단계: 센터스피커',
            'surround': '9단계: 서라운드스피커',
            'subwoofer': '10단계: 서브우퍼',
            'amp_4ch': '11단계: 4채널 앰프',
            'amp_sub': '12단계: 서브우퍼 앰프',
            'player': '13단계: 플레이어'
        };

        const stepOrder = [
            'dsp', 'pnp', 'front_door', 'tweeter', 'add_front', 'front_baffle',
            'rear_door', 'rear_baffle', 'center', 'surround', 'subwoofer',
            'amp_4ch', 'amp_sub', 'player'
        ];

        let hasDSP = false;
        let hasFrontRearSpeaker = false;
        let hasPWEM770Package = false;

        stepOrder.forEach(catId => {
            if (this.selections[catId]) {
                const selected = this.selections[catId];
                const pNames = Array.isArray(selected) ? selected : [selected];

                // 해당 카테고리에 유효한 제품이 있는지 먼저 확인
                const validProducts = pNames.filter(pName => pName !== "선택 안함" && pName !== "DSP 선택 안함" && this.getProductPrice(pName) > 0);

                if (validProducts.length > 0) {
                    // 단계 헤더 추가
                    summaryHtml += `<div class="estimate-summary-group-title" style="font-size: 0.75rem; color: #007aff; margin-top: 10px; font-weight: bold; border-bottom: 1px solid #f0f0f0; padding-bottom: 2px;">${categoryLabels[catId]}</div>`;

                    validProducts.forEach(pName => {
                        const price = this.getProductPrice(pName);
                        productTotal += price;

                        if (catId === 'dsp') {
                            dspPrice = price;
                            hasDSP = true;
                        }
                        if (catId === 'amp_4ch' || catId === 'amp_sub') {
                            ampPrice += price;
                        }

                        // 전면/후면 스피커 체크 (특정 모델은 장착비 제외)
                        const excludedSpeakers = [
                            "EV-65CF", "EV-40M-T", "EV-40MR-T", "EV-100SW 3", "EV-100SW Y",
                            "DP2-45C-B", "DP2-45-B", "DP2-40C-B", "DP2-15TW-B", "DP2-80WF-B"
                        ];
                        if (['front_door', 'tweeter', 'add_front', 'rear_door'].includes(catId)) {
                            if (!excludedSpeakers.includes(pName)) {
                                hasFrontRearSpeaker = true;
                            }
                        }

                        if (pName === "PWE-M770+PWE-770-RCU") {
                            hasPWEM770Package = true;
                        }

                        summaryHtml += `<div class="estimate-summary-item" style="padding-left: 5px;">
                            <span>${pName}</span>
                            <span>₩${price.toLocaleString()}</span>
                        </div>`;
                    });
                }
            }
        });

        // --- 제품별 기술료 계산 공식 개편안 ---
        let labor = 0;
        const extraLaborTotal = (this.selectedCar && this.selectedCar.extraLabor) ? this.selectedCar.extraLabor : 0;
        
        // 카테고리별 기술료 합산
        let catLabor = {
            'DSP': 0,
            'Speaker': 0,
            'AMP': 0,
            'Subwoofer': 0,
            'Player': 0,
            'ETC': 0,
            'PnP': 0,
            'Premium': 0
        };

        let dspDiscountRatio = 0;
        let speakerCount = 0;
        
        // laborRuleData 가 제대로 로드되었는지 확인
        const rules = (typeof laborRuleData !== 'undefined') ? laborRuleData : [];

        stepOrder.forEach(catId => {
            if (this.selections[catId]) {
                const selected = this.selections[catId];
                const pNames = Array.isArray(selected) ? selected : [selected];
                const validProducts = pNames.filter(pName => pName !== "선택 안함" && pName !== "DSP 선택 안함" && this.getProductPrice(pName) > 0);

                validProducts.forEach(pName => {
                    const price = this.getProductPrice(pName);
                    
                    // 1. 제품 규칙 찾기 
                    const rule = rules.find(r => r.name && r.name.trim() === pName.trim());
                    
                    if (rule) {
                        const base = parseFloat(rule.basePrice) || 0;
                        const percentRatio = parseFloat(rule.percentPrice) || 0;
                        let itemLabor = base + (price * (percentRatio / 100));
                        
                        let ruleCat = (rule.category || '').toUpperCase().trim();
                        // 빈 카테고리시 매핑 보정
                        if (!ruleCat) {
                             if (catId === 'dsp') ruleCat = 'DSP';
                             else if (['front_door', 'tweeter', 'add_front', 'rear_door'].includes(catId)) ruleCat = 'SPEAKER';
                             else if (catId === 'amp_4ch' || catId === 'amp_sub') ruleCat = 'AMP';
                             else if (catId === 'subwoofer') ruleCat = 'SUBWOOFER';
                             else if (catId === 'player') ruleCat = 'PLAYER';
                             else if (catId === 'pnp') ruleCat = 'PNP';
                        }

                        if (ruleCat === 'DSP') {
                            catLabor['DSP'] += itemLabor;
                            let r = parseFloat(rule.discountRatio);
                            let premiumRatio = !isNaN(r) ? r : 50;
                            let prem = extraLaborTotal * (premiumRatio / 100);
                            catLabor['Premium'] += prem;
                            labor += prem;
                            if (!isNaN(r) && r > 0) dspDiscountRatio = r;
                        } else if (ruleCat === 'SPEAKER') {
                            catLabor['Speaker'] += itemLabor;
                            let r = parseFloat(rule.discountRatio);
                            if (speakerCount === 0) {
                                let premiumRatio = !isNaN(r) ? r : 50;
                                let prem = extraLaborTotal * (premiumRatio / 100);
                                catLabor['Premium'] += prem;
                                labor += prem;
                            }
                            speakerCount++;
                            if (!isNaN(r) && r > 0 && dspDiscountRatio === 0) dspDiscountRatio = r;
                        } else if (ruleCat === 'SUBWOOFER') {
                            catLabor['Subwoofer'] += itemLabor;
                        } else if (ruleCat === 'PLAYER') {
                            catLabor['Player'] += itemLabor;
                        } else if (ruleCat === 'ETC') {
                            catLabor['ETC'] += itemLabor;
                        } else if (ruleCat === 'AMP') {
                            catLabor['AMP'] += itemLabor;
                        } else if (ruleCat === 'PNP') {
                            catLabor['PnP'] += itemLabor;
                        } else {
                            catLabor['ETC'] += itemLabor;
                        }

                        labor += itemLabor;

                    } else {
                        // 엑셀 룰에 없는 Fallback
                        if (catId === 'dsp') {
                            const itemLabor = (price * 0.3);
                            catLabor['DSP'] += itemLabor;
                            labor += itemLabor;
                            let prem = extraLaborTotal * 0.5;
                            catLabor['Premium'] += prem;
                            labor += prem;
                        } else if (['front_door', 'tweeter', 'add_front', 'rear_door'].includes(catId)) {
                            const excludedSpeakers = ["EV-65CF", "EV-40M-T", "EV-40MR-T", "EV-100SW 3", "EV-100SW Y", "DP2-45C-B", "DP2-45-B", "DP2-40C-B", "DP2-15TW-B", "DP2-80WF-B"];
                            if (!excludedSpeakers.includes(pName)) {
                                speakerCount++;
                                if (speakerCount === 1) {
                                    const itemLabor = 200000;
                                    catLabor['Speaker'] += itemLabor;
                                    labor += itemLabor;
                                    dspDiscountRatio = Math.max(dspDiscountRatio, 50); 
                                    let prem = extraLaborTotal * 0.5;
                                    catLabor['Premium'] += prem;
                                    labor += prem;
                                }
                            }
                        } else if (catId === 'amp_4ch' || catId === 'amp_sub') {
                            const itemLabor = price * 0.1;
                            catLabor['AMP'] += itemLabor;
                            labor += itemLabor;
                        } else if (pName === "PWE-M770+PWE-770-RCU" && !hasDSP) {
                            catLabor['Subwoofer'] += 200000;
                            labor += 200000;
                        }
                    }
                });
            }
        });

        // 2. DSP & 스피커 동시 작업 시, 할인 적용 
        if ((hasDSP || catLabor['DSP'] > 0) && speakerCount > 0 && dspDiscountRatio > 0) {
            const applicableLabor = catLabor['DSP'] + catLabor['Speaker'];
            const discountAmount = applicableLabor * (dspDiscountRatio / 100);
            labor -= discountAmount;
            
            // 할인액을 각 카테고리 비용에서 비율로 차감 반영 (표기를 위해)
            catLabor['DSP'] = catLabor['DSP'] - (catLabor['DSP'] * (dspDiscountRatio / 100));
            catLabor['Speaker'] = catLabor['Speaker'] - (catLabor['Speaker'] * (dspDiscountRatio / 100));
        }

        // 3. Subwoofer, ETC, Player는 DSP나 Speaker 존재 시 기술료 제외
        const minorItemLabor = catLabor['Subwoofer'] + catLabor['Player'] + catLabor['ETC'];
        const hasAnyDspOrSpeaker = (hasDSP || catLabor['DSP'] > 0 || speakerCount > 0);
        if (hasAnyDspOrSpeaker && minorItemLabor > 0) {
            labor -= minorItemLabor;
            catLabor['Subwoofer'] = 0;
            catLabor['Player'] = 0;
            catLabor['ETC'] = 0;
        }

        labor = Math.round(labor);

        if (productTotal > 0 || labor > 0) {
            // 표기 순서 제어용
            const renderOrder = [
                { key: 'DSP', label: 'DSP 장착 기술료' },
                { key: 'Speaker', label: 'Speaker 장착 기술료' },
                { key: 'AMP', label: 'AMP 장착 기술료' },
                { key: 'Subwoofer', label: 'Subwoofer 장착 기술료' },
                { key: 'Player', label: 'Player 장착 기술료' },
                { key: 'ETC', label: 'ETC 장착 기술료' },
                { key: 'PnP', label: 'PnP 장착 기술료' },
                { key: 'Premium', label: '고급차 시공 할증비' }
            ];

            let laborHtml = '';
            renderOrder.forEach(item => {
                const amount = Math.round(catLabor[item.key] || 0);
                if (amount > 0) {
                    laborHtml += `<div class="estimate-summary-item" style="padding-left: 5px; color: #555;">
                        <span style="font-size: 0.85em;">- ${item.label}</span>
                        <span style="font-size: 0.85em;">₩${amount.toLocaleString()}</span>
                    </div>`;
                }
            });

            if (laborHtml) {
                summaryHtml += `<div class="estimate-summary-group-title" style="font-size: 0.75rem; color: #007aff; margin-top: 15px; font-weight: bold; border-bottom: 1px solid #f0f0f0; padding-bottom: 2px;">기술료 내역</div>`;
                summaryHtml += laborHtml;
            }

            summaryHtml += `<hr style="margin: 10px 0; border: 0; border-top: 1px solid #ddd;">
            <div class="estimate-summary-item" style="padding-bottom: 15px;">
                <span style="font-weight: bold;">기술료 합산</span>
                <span style="font-weight: bold; color: #007aff;">₩${labor.toLocaleString()}</span>
            </div>`;
        } else {
            summaryHtml = '선택된 항목이 없습니다.';
        }

        summary.innerHTML = summaryHtml;
        totalPriceEl.textContent = `₩${(productTotal + labor).toLocaleString()}`;
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

    showAIAssessment() {
        if (!this.selectedCar || Object.keys(this.selections).length === 0) {
            alert('먼저 제품을 선택해 주세요.');
            return;
        }
        const area = document.getElementById('aiAssessmentArea');
        const modal = document.getElementById('estimateAIModal');

        area.innerHTML = '<div style="text-align:center;">AI가 구성을 분석 중입니다...</div>';
        modal.display = 'block';
        modal.style.display = 'block';

        setTimeout(() => {
            const analysis = this.generateAIAnalysis();
            area.innerHTML = analysis;
        }, 800);
    },

    closeAIModal() {
        document.getElementById('estimateAIModal').style.display = 'none';
    },

    generateAIAnalysis() {
        const sel = this.selections;
        const items = Object.values(sel).flat().filter(i => i !== "선택 안함" && i !== "DSP 선택 안함");

        let score = 0;
        let labels = items.map(i => this.getProductWithRank(i));

        const counts = {
            입문: items.filter(i => this.getProductRank(i) === '입문용').length,
            가성비: items.filter(i => this.getProductRank(i) === '가성비').length,
            프로: items.filter(i => this.getProductRank(i) === '프로').length,
            하이: items.filter(i => this.getProductRank(i) === '하이엔드').length,
            어나더: items.filter(i => this.getProductRank(i) === '어나더레벨').length
        };

        let mainLevel = "커스텀";
        const max = Math.max(...Object.values(counts));
        if (max > 0) {
            mainLevel = Object.keys(counts).find(k => counts[k] === max);
        }

        let comment = "";
        let recommendation = "";

        if (counts.어나더 >= 3) {
            comment = "<strong>'최상위 하이파이의 정점'</strong>입니다. 알파인의 기술력이 집약된 F#1 Status급 구성으로, 원음 그대로의 감동을 재현할 수 있는 완벽한 시스템입니다.";
            recommendation = "최고의 소리를 위해 전문 인스톨러의 정밀한 프로세싱 튜닝이 필수적입니다. 또한 하이엔드 전용 케이블링 보강을 추천드립니다.";
            score = 99;
        } else if (counts.하이 >= 3) {
            comment = "<strong>'프리미엄 사운드의 정석'</strong>입니다. 고해상도 오디오(Hi-Res) 대응이 완벽하며, 스테이지감과 해상력이 매우 뛰어난 구성입니다.";
            const hasChamber = sel.tweeter && sel.tweeter !== "선택 안함";
            recommendation = hasChamber ? "트위터 챔버가 적용되어 지향각이 최적화되었습니다. 도어 방진 작업을 통해 미드우퍼의 타격감을 더 보완해보세요." : "전면 스피커의 성능을 100% 끌어올리기 위해 '트위터 챔버' 작업을 강력 추천합니다.";
            score = 92;
        } else if (counts.프로 >= 3) {
            comment = "<strong>'중급자를 위한 파워풀한 시스템'</strong>입니다. 충분한 출력과 단단한 베이스가 조화로워, 올라운드 음악 감상에 최적화되어 있습니다.";
            recommendation = "앰프 작업이 포함되어 있으니 전원 보강(캐패시터 등)을 고려하시면 더욱 안정적인 소리를 얻을 수 있습니다.";
            score = 85;
        } else if (counts.가성비 >= 3) {
            comment = "<strong>'합리적인 고음질 지향'</strong> 구성입니다. 순정과는 차원이 다른 선명도를 경험할 수 있으며, 투자 대비 사운드 개선 효과가 가장 극대화된 조합입니다.";
            recommendation = "도어 방음(알루미늄 매트) 작업을 병행하면 저역의 타격감이 훨씬 좋아집니다.";
            score = 78;
        } else {
            comment = "<strong>'깔끔한 사운드 밸런스'</strong>에 집중한 구성입니다. 답답한 순정 소리를 걷어내고 맑은 고음과 정돈된 저음을 즐기기에 충분한 입문용 최적 조합입니다.";
            const hasSub = sel.subwoofer && sel.subwoofer !== "선택 안함";
            recommendation = hasSub ? "서브우퍼가 포함되어 있어 베이스가 풍부합니다. 추후 DSP 정밀 튜닝을 통해 소리의 중심(Center)을 잡는 것을 추천합니다." : "추후 사운드에 더 욕심이 생기신다면 '서브우퍼' 추가를 통해 공간감을 넓혀보시는 것을 추천합니다.";
            score = 70;
        }

        // 특정 제품 조합에 대한 위트 있는 코멘트
        let extra = "";
        if (sel.dsp && sel.subwoofer && sel.subwoofer !== "선택 안함") {
            extra = "<br><br>💡 DSP와 서브우퍼가 모두 포함되어 있어, 운전석 중심의 정밀한 '타임 얼라이먼트' 세팅이 가능합니다. 마치 대시보드 위에 가수가 서 있는 듯한 스테이지를 경험하실 수 있습니다.";
        }

        return `
            <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; border: 2px solid #0056b3; border-left-width: 6px; box-shadow: 0 6px 16px rgba(0,0,0,0.1);">
                <p style="font-size: 1.1rem; margin-bottom: 10px;">현재 구성은 <span style="color:#007aff; font-weight:bold;">#${mainLevel} 스타일</span>입니다.</p>
                <p style="color: #555;">${comment}</p>
                <div style="margin-top: 20px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    <p style="font-weight: bold; color: #222;">🛡️ AI 전문가의 한마디:</p>
                    <p style="color: #666; font-size: 0.95rem;">${recommendation}</p>
                </div>
                ${extra}
                <div style="margin-top:20px; padding-top:15px; border-top:1px solid #eee; display:flex; justify-content:flex-end; align-items:center;">
                    <div style="font-size: 0.7rem; color: #aaa; text-align: right;">
                        Last Checked: ${new Date().toLocaleTimeString()}
                    </div>
                </div>
            </div>
        `;
    },

    resetSelections() {
        if (confirm('모든 선택 내역을 초기화하고 서버의 최신 데이터를 동기화하시겠습니까?')) {
            window.location.href = '?sync=true&t=' + Date.now();
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

        let labor = 0;
        const extraLaborTotal = (this.selectedCar && this.selectedCar.extraLabor) ? this.selectedCar.extraLabor : 0;
        
        let catLabor = {
            'DSP': 0, 'Speaker': 0, 'AMP': 0, 'Subwoofer': 0, 'Player': 0, 'ETC': 0, 'PnP': 0, 'Premium': 0
        };
        let dspDiscountRatio = 0;
        let speakerCount = 0;
        let hasDSP = false;

        const categoryLabels = {
            'dsp': '1. DSP',
            'pnp': '2. PnP Cable',
            'front_door': '3. 전면도어 스피커',
            'tweeter': '4. 전면 트위터 챔버',
            'add_front': '4. 전면 스피커 추가',
            'front_baffle': '5. 전면 스피커 가이드',
            'rear_door': '6. 후면도어 스피커',
            'rear_baffle': '7. 후면 스피커 가이드',
            'center': '8. 센터스피커',
            'surround': '9. 서라운드스피커',
            'subwoofer': '10. 서브우퍼',
            'amp_4ch': '11. 4채널 앰프',
            'amp_sub': '12. 서브우퍼 앰프',
            'player': '13. 플레이어'
        };

        const stepOrder = [
            'dsp', 'pnp', 'front_door', 'tweeter', 'add_front', 'front_baffle',
            'rear_door', 'rear_baffle', 'center', 'surround', 'subwoofer',
            'amp_4ch', 'amp_sub', 'player'
        ];

        const rules = (typeof laborRuleData !== 'undefined') ? laborRuleData : [];

        stepOrder.forEach(catId => {
            if (this.selections[catId]) {
                const selected = this.selections[catId];
                const pNames = Array.isArray(selected) ? selected : [selected];

                const validProducts = pNames.filter(pName => pName !== "선택 안함" && pName !== "DSP 선택 안함" && this.getProductPrice(pName) > 0);

                if (validProducts.length > 0) {
                    productHtml += `
                        <tr style="background: #f9f9f9;">
                            <td colspan="4" style="border: 1px solid #ddd; padding: 8px 12px; font-weight: bold; color: #007aff; font-size: 0.85rem;">${categoryLabels[catId]}</td>
                        </tr>
                    `;

                    validProducts.forEach(pName => {
                        const price = this.getProductPrice(pName);
                        productTotal += price;

                        if (catId === 'dsp') hasDSP = true;

                        // 1. 제품 규칙 찾기 및 기술료 계산
                        const rule = rules.find(r => r.name && r.name.trim() === pName.trim());
                        if (rule) {
                            const base = parseFloat(rule.basePrice) || 0;
                            const percentRatio = parseFloat(rule.percentPrice) || 0;
                            let itemLabor = base + (price * (percentRatio / 100));
                            
                            let ruleCat = (rule.category || '').toUpperCase().trim();
                            if (!ruleCat) {
                                 if (catId === 'dsp') ruleCat = 'DSP';
                                 else if (['front_door', 'tweeter', 'add_front', 'rear_door'].includes(catId)) ruleCat = 'SPEAKER';
                                 else if (catId === 'amp_4ch' || catId === 'amp_sub') ruleCat = 'AMP';
                                 else if (catId === 'subwoofer') ruleCat = 'SUBWOOFER';
                                 else if (catId === 'player') ruleCat = 'PLAYER';
                                 else if (catId === 'pnp') ruleCat = 'PNP';
                            }

                            if (ruleCat === 'DSP') { 
                                catLabor['DSP'] += itemLabor; 
                                let r = parseFloat(rule.discountRatio);
                                let premiumRatio = !isNaN(r) ? r : 50;
                                let prem = extraLaborTotal * (premiumRatio / 100);
                                catLabor['Premium'] += prem;
                                labor += prem;
                                if (!isNaN(r) && r > 0) dspDiscountRatio = r; 
                            }
                            else if (ruleCat === 'SPEAKER') { 
                                catLabor['Speaker'] += itemLabor; 
                                let r = parseFloat(rule.discountRatio);
                                if (speakerCount === 0) {
                                    let premiumRatio = !isNaN(r) ? r : 50;
                                    let prem = extraLaborTotal * (premiumRatio / 100);
                                    catLabor['Premium'] += prem;
                                    labor += prem;
                                }
                                speakerCount++; 
                                if (!isNaN(r) && r > 0 && dspDiscountRatio === 0) dspDiscountRatio = r; 
                            }
                            else if (ruleCat === 'SUBWOOFER') catLabor['Subwoofer'] += itemLabor;
                            else if (ruleCat === 'PLAYER') catLabor['Player'] += itemLabor;
                            else if (ruleCat === 'ETC') catLabor['ETC'] += itemLabor;
                            else if (ruleCat === 'AMP') catLabor['AMP'] += itemLabor;
                            else if (ruleCat === 'PNP') catLabor['PnP'] += itemLabor;
                            else catLabor['ETC'] += itemLabor;

                            labor += itemLabor;
                        } else {
                            // Fallback
                            if (catId === 'dsp') {
                                const itemLabor = (price * 0.3);
                                catLabor['DSP'] += itemLabor; labor += itemLabor;
                                let prem = extraLaborTotal * 0.5;
                                catLabor['Premium'] += prem;
                                labor += prem;
                            } else if (['front_door', 'tweeter', 'add_front', 'rear_door'].includes(catId)) {
                                const excludedSpeakers = ["EV-65CF", "EV-40M-T", "EV-40MR-T", "EV-100SW 3", "EV-100SW Y", "DP2-45C-B", "DP2-45-B", "DP2-40C-B", "DP2-15TW-B", "DP2-80WF-B"];
                                if (!excludedSpeakers.includes(pName)) {
                                    speakerCount++;
                                    if (speakerCount === 1) {
                                        const itemLabor = 200000;
                                        catLabor['Speaker'] += itemLabor; labor += itemLabor;
                                        dspDiscountRatio = Math.max(dspDiscountRatio, 50); 
                                        let prem = extraLaborTotal * 0.5;
                                        catLabor['Premium'] += prem;
                                        labor += prem;
                                    }
                                }
                            } else if (catId === 'amp_4ch' || catId === 'amp_sub') {
                                const itemLabor = price * 0.1;
                                catLabor['AMP'] += itemLabor; labor += itemLabor;
                            } else if (pName === "PWE-M770+PWE-770-RCU" && !hasDSP) {
                                catLabor['Subwoofer'] += 200000; labor += 200000;
                            }
                        }

                        productHtml += `
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 12px; padding-left: 20px;">${pName}</td>
                                <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">1</td>
                                <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">₩${price.toLocaleString()}</td>
                                <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">₩${price.toLocaleString()}</td>
                            </tr>
                        `;
                    });
                }
            }
        });

        // 2. 동시작업 할인
        if ((hasDSP || catLabor['DSP'] > 0) && speakerCount > 0 && dspDiscountRatio > 0) {
            const applicableLabor = catLabor['DSP'] + catLabor['Speaker'];
            const discountAmount = applicableLabor * (dspDiscountRatio / 100);
            labor -= discountAmount;
            catLabor['DSP'] = catLabor['DSP'] - (catLabor['DSP'] * (dspDiscountRatio / 100));
            catLabor['Speaker'] = catLabor['Speaker'] - (catLabor['Speaker'] * (dspDiscountRatio / 100));
        }

        // 3. 서브우퍼/기타 기술료 제외
        const minorItemLabor = catLabor['Subwoofer'] + catLabor['Player'] + catLabor['ETC'];
        const hasAnyDspOrSpeaker = (hasDSP || catLabor['DSP'] > 0 || speakerCount > 0);
        if (hasAnyDspOrSpeaker && minorItemLabor > 0) {
            labor -= minorItemLabor;
            catLabor['Subwoofer'] = 0; catLabor['Player'] = 0; catLabor['ETC'] = 0;
        }

        labor = Math.round(labor);

        const renderOrder = [
            { key: 'DSP', label: 'DSP 장착 기술료' },
            { key: 'Speaker', label: 'Speaker 장착 기술료' },
            { key: 'AMP', label: 'AMP 장착 기술료' },
            { key: 'Subwoofer', label: 'Subwoofer 장착 기술료' },
            { key: 'Player', label: 'Player 장착 기술료' },
            { key: 'ETC', label: 'ETC 장착 기술료' },
            { key: 'PnP', label: 'PnP 장착 기술료' },
            { key: 'Premium', label: '고급차 시공 할증비' }
        ];

        let laborRowsHtml = '';
        renderOrder.forEach(item => {
            const amount = Math.round(catLabor[item.key] || 0);
            if (amount > 0) {
                laborRowsHtml += `
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 12px; color: #555;">[기술료] ${item.label}</td>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: right; color: #555;">1</td>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: right; color: #555;">₩${amount.toLocaleString()}</td>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: right; color: #555;">₩${amount.toLocaleString()}</td>
                    </tr>
                `;
            }
        });

        // Add a category header for labor items if any exist
        if (laborRowsHtml) {
            laborRowsHtml = `
                <tr style="background: #f9f9f9;">
                    <td colspan="4" style="border: 1px solid #ddd; padding: 8px 12px; font-weight: bold; color: #007aff; font-size: 0.85rem;">[ 옵션 ] 기술료 산출 내역</td>
                </tr>
                ${laborRowsHtml}
            `;
        }

        const grandTotal = productTotal + labor;
        const date = new Date().toLocaleDateString();

        let dealerInfoHtml = '';
        if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('isLoggedIn') === 'true') {
            const username = sessionStorage.getItem('currentUser');
            const dealerList = (typeof window !== 'undefined' && window.dealerData) ? window.dealerData : 
                               (typeof dealerData !== 'undefined' ? dealerData : JSON.parse(localStorage.getItem('dealerData') || '[]'));
            const dealer = dealerList.find(d => d.username === username);
            if (dealer) {
                dealerInfoHtml = `
                    <div style="margin-top: 15px; border-top: 1px dashed #ccc; padding-top: 15px;">
                        <p style="margin: 0; font-weight: bold; color: #007aff; margin-bottom: 5px;">[ 견적 상담 대리점 ]</p>
                        <p style="margin: 0;"><strong>상호명:</strong> ${dealer.name}</p>
                        <p style="margin: 0;"><strong>연락처:</strong> ${dealer.phone}</p>
                        <p style="margin: 0;"><strong>주소:</strong> ${dealer.address}</p>
                    </div>
                `;
            }
        }

        printArea.innerHTML = `
            <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="font-size: 24px; margin: 0; letter-spacing: 5px;">알파인 사운드 견적서</h1>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 0.9rem;">
                <div style="width: 45%;">
                    <p style="margin: 5px 0;"><strong>차량정보:</strong> ${this.selectedCar.brand} ${this.selectedCar.model} (${this.selectedCar.code})</p>
                    <p style="margin: 5px 0;"><strong>사운드시스템:</strong> ${this.selectedCar.system}</p>
                    <p style="margin: 5px 0;"><strong>견적일자:</strong> ${date}</p>
                </div>
                <div style="width: 50%; text-align: right;">
                    <p style="margin: 5px 0; font-size: 1.2rem;"><strong>수신:</strong> 고객님 귀하</p>
                </div>
            </div>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; table-layout: fixed;">
                <thead>
                    <tr style="background: #f8f8f8;">
                        <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">품명 및 규격</th>
                        <th style="border: 1px solid #ddd; padding: 12px; text-align: right; width: 10%;">수량</th>
                        <th style="border: 1px solid #ddd; padding: 12px; text-align: right; width: 25%;">단가</th>
                        <th style="border: 1px solid #ddd; padding: 12px; text-align: right; width: 25%;">금액</th>
                    </tr>
                </thead>
                <tbody>
                    ${productHtml}
                    ${laborRowsHtml}
                    ${labor > 0 ? `
                    <tr style="background: #fdfdfd; font-weight: bold;">
                        <td colspan="3" style="border: 1px solid #ddd; padding: 12px; text-align: right; color: #007aff;">기술료 합산</td>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: right; color: #007aff;">₩${labor.toLocaleString()}</td>
                    </tr>
                    ` : ''}
                </tbody>
                <tfoot>
                    <tr style="background: #333; color: #fff;">
                        <td colspan="3" style="border: 1px solid #ddd; padding: 12px; text-align: right; font-weight: bold;">합계 금액 (Total)</td>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: right; font-weight: bold;">₩${grandTotal.toLocaleString()}</td>
                    </tr>
                </tfoot>
            </table>
            <div style="margin-top: 30px; border: 1px solid #eee; padding: 15px; font-size: 0.8rem; line-height: 1.4; color: #555;">
                <p style="margin: 0; font-weight: bold; color: #333; margin-bottom: 3px;">[ 안내사항 ]</p>
                <p style="margin: 0;">1. 본 견적서는 알파인 카오디오 가상 견적 시뮬레이션 결과로 실제 작업 환경에 따라 차이가 있을 수 있습니다.</p>
                <p style="margin: 0;">2. 정확한 상담은 가까운 알파인 대리점(Partner Zone)을 방문하여 주시기 바랍니다.</p>
                <p style="margin: 0;">3. 기술료는 기본 장착 표준 공임이며, 차량 상태 및 추가 커스텀 작업 시 변동될 수 있습니다.</p>
                ${dealerInfoHtml}
            </div>
        `;
    },

    showSystemDiagram() {
        if (!this.selectedCar) {
            alert('먼저 차량을 선택해 주세요.');
            return;
        }

        const systemModal = document.getElementById('estimateSystemModal');
        const systemArea = document.getElementById('systemPrintableArea');
        if (!systemModal || !systemArea) return;

        systemModal.style.display = 'block';

        const car = this.selectedCar;
        const date = new Date().toLocaleDateString();

        // 적용 DSP 추출 (상단 헤더 표시용)
        const dspVal = this.selections['dsp'];
        const dspName = dspVal && dspVal !== "DSP 선택 안함" && dspVal !== "선택 안함" ? dspVal : '선택 안함';

        // PnP Cable 추출 (상단 헤더 표시용)
        let pnpName = '선택 안함';
        if (this.selections['pnp']) {
            const pnpList = Array.isArray(this.selections['pnp']) ? this.selections['pnp'] : [this.selections['pnp']];
            const validPnPs = pnpList.filter(p => p !== "선택 안함");
            if (validPnPs.length > 0) {
                pnpName = validPnPs.join(', ');
            }
        }

        // 1. 카테고리별 실시간 선택 제품명 가져오기
        const selections = this.selections;
        const getSelectedName = (cat) => {
            const val = selections[cat];
            if (!val || val === "선택 안함" || val === "DSP 선택 안함") return "";
            if (Array.isArray(val)) {
                const filtered = val.filter(v => v !== "선택 안함");
                return filtered.length > 0 ? filtered.join(', ') : "";
            }
            return val;
        };

        const dspProd = getSelectedName('dsp');
        const pnpProd = getSelectedName('pnp');
        const frontProd = getSelectedName('front_door');
        const tweeterProd = getSelectedName('tweeter');
        const addFrontProd = getSelectedName('add_front');
        const rearProd = getSelectedName('rear_door');
        const centerProd = getSelectedName('center');
        const surroundProd = getSelectedName('surround');
        const subProd = getSelectedName('subwoofer');
        const amp4chProd = getSelectedName('amp_4ch');
        const ampSubProd = getSelectedName('amp_sub');
        const playerProd = getSelectedName('player');

        // 2. 엑셀 채널 정보 매핑 (원본 텍스트 그대로 연동)
        const channels = [
            '1', '2', '3', '4', '5', '6', '7', '8', '8A', '9', '10', '11', '11A', '12', '12A',
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'
        ];
        const mappedProducts = {};

        channels.forEach(ch => {
            mappedProducts[ch] = car[ch] || "";
        });

        // 3. 경로 동적 보정 (file:// 및 배포 환경 호환)
        let imagePath = 'carsystem/Alpine Car3.png';
        const pathname = window.location.pathname;
        if (pathname.includes('/pages/products/')) {
            imagePath = '../../carsystem/Alpine Car3.png';
        } else if (pathname.includes('/pages/') || pathname.includes('/support/')) {
            imagePath = '../carsystem/Alpine Car3.png';
        }

        // 4. 좌/우 14개 대칭 행 배치 정의
        const leftChannels = ['1', '3', '5', '7', '11A', 'A', 'C', 'E', '7A', '9', 'G', 'I', 'K', '11'];
        const rightChannels = ['2', '4', '6', '8', '12A', 'B', 'D', 'F', '8A', '10', 'H', 'J', 'L', '12'];
        const rowYPercents = [
            27.81, 31.11, 35.42, 39.81, 44.07, 48.00, 51.90, 55.80, 59.70, 63.60, 67.50, 71.40, 75.30, 79.20
        ];

        let overlayHtml = '';

        // 좌측 오버레이 생성
        leftChannels.forEach((ch, idx) => {
            const val = mappedProducts[ch] || "";
            const y = rowYPercents[idx];
            overlayHtml += `
                <div style="position: absolute; left: 10.75%; top: ${y}%; width: 15.27%; height: 2.3%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: bold; color: #111; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-align: center; padding: 0 4px; box-sizing: border-box; background: transparent; pointer-events: none;" title="${val}">
                    ${val}
                </div>
            `;
        });

        // 우측 오버레이 생성
        rightChannels.forEach((ch, idx) => {
            const val = mappedProducts[ch] || "";
            const y = rowYPercents[idx];
            overlayHtml += `
                <div style="position: absolute; left: 80.81%; top: ${y}%; width: 15.27%; height: 2.3%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: bold; color: #111; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-align: center; padding: 0 4px; box-sizing: border-box; background: transparent; pointer-events: none;" title="${val}">
                    ${val}
                </div>
            `;
        });

        // 하단 DSP / PnP Cable 오버레이 생성
        overlayHtml += `
            <div style="position: absolute; left: 36.20%; top: 90.0%; width: 26.93%; height: 2.3%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: bold; color: #111; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-align: center; padding: 0 4px; box-sizing: border-box; background: transparent; pointer-events: none;" title="${pnpProd}">
                ${pnpProd}
            </div>
            <div style="position: absolute; left: 36.20%; top: 93.7%; width: 26.93%; height: 2.3%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: bold; color: #111; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-align: center; padding: 0 4px; box-sizing: border-box; background: transparent; pointer-events: none;" title="${dspProd}">
                ${dspProd}
            </div>
        `;

        systemArea.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 0.95rem; border-bottom: 2px solid #333; padding-bottom: 15px;">
                <div style="width: 100%;">
                    <p style="margin: 5px 0;"><strong>차량정보:</strong> ${this.selectedCar.brand} ${this.selectedCar.model} (${this.selectedCar.code})</p>
                    <p style="margin: 5px 0;"><strong>사운드시스템:</strong> ${this.selectedCar.system}</p>
                    <p style="margin: 5px 0;"><strong>적용 DSP:</strong> <span style="color:#007aff; font-weight:bold;">${dspName}</span></p>
                    <p style="margin: 5px 0;"><strong>PnP Cable:</strong> <span style="color:#007aff; font-weight:bold;">${pnpName}</span></p>
                    <p style="margin: 5px 0;"><strong>작성일자:</strong> ${date}</p>
                </div>
            </div>
            <div class="system-diagram-container" style="position: relative; width: 100%; max-width: 800px; margin: 0 auto;">
                <img src="${imagePath}" style="width: 100%; height: auto; display: block;" alt="Alpine 사운드 시스템도">
                ${overlayHtml}
            </div>
        `;
    },

    closeSystemModal() {
        const systemModal = document.getElementById('estimateSystemModal');
        if (systemModal) systemModal.style.display = 'none';
    },

    async downloadSystemAsImage() {
        const area = document.getElementById('systemPrintableArea');
        if (!area) return;

        const btn = document.querySelector('button[onclick="EstimateUI.downloadSystemAsImage()"]');
        if (!btn) return;
        const originalText = btn.innerText;
        btn.innerText = "저장 중...";
        btn.disabled = true;

        try {
            const canvas = await html2canvas(area, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff"
            });

            const link = document.createElement('a');
            const carName = this.selectedCar ? `${this.selectedCar.brand}_${this.selectedCar.model}` : "알파인_사운드시스템";
            link.download = `Alpine_System_${carName}_${new Date().getTime()}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (err) {
            console.error("이미지 저장 실패:", err);
            alert("이미지 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    }
};

// Initialize after data loads
document.addEventListener('DOMContentLoaded', () => {
    EstimateUI.init();
});
