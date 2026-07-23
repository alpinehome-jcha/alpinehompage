const initialResourceData = [
    {
        "id": 1779762359006,
        "date": "2026-05-26",
        "title": "그랜저 GN7 자출(4채널)차량 Preset 및 인스톨 설명",
        "content": "그랜저 GN7 자출(4채널)차량 Preset 데이터 및 설치 매뉴얼입니다.\n\n1. 첨부된 프리셋 및 매뉴얼 파일을 다운로드 하십시오.\n2. 대리점 자료실에서 PXE-M60-4 PC 소프트웨어를 다운로드하시고 실행하십시오.",
        "image": "assets/images/서브우퍼.jpg",
        "files": [
            {
                "name": "4CH+Sub_W_PXE-M60-4_0712_GN74CH.jssh",
                "path": "assets/files/4CH+Sub_W_PXE-M60-4_0712_GN74CH.jssh",
                "url": "https://raw.githubusercontent.com/alpinehome-jcha/alpinehompage/main/assets/files/4CH+Sub_W_PXE-M60-4_0712_GN74CH.jssh"
            },
            {
                "name": "GN7 4채널 M60_M770설치메뉴얼.pdf",
                "path": "assets/files/GN7 4채널 M60_M770설치메뉴얼.pdf",
                "url": "https://raw.githubusercontent.com/alpinehome-jcha/alpinehompage/main/assets/files/GN7 4채널 M60_M770설치메뉴얼.pdf"
            }
        ],
        "author": "Admin"
    },
    {
        "id": 1773207369611,
        "date": "2026-03-11",
        "title": "20260311 현대기아 RANC MIC 매뉴얼",
        "content": "현대기아 RANC MIC 관련 기술 자료 및 매뉴얼 문서입니다.",
        "image": "assets/images/a100pc.jpg",
        "files": [
            {
                "name": "20260311 현대기아 RANC MIC.pdf",
                "path": "assets/files/20260311 현대기아 RANC MIC.pdf",
                "url": "https://raw.githubusercontent.com/alpinehome-jcha/alpinehompage/main/assets/files/20260311 %ED%98%84%EB%8C%80%EA%B8%B0%EC%95%84 RANC MIC.pdf"
            }
        ],
        "author": "Admin"
    },
    {
        "id": 1770957118621,
        "date": "2026-02-13",
        "title": "F#1 Status 카다록 및 2025 알파인 종합카다록",
        "content": "알파인 F#1 Status 카다록 및 알파인 종합 카다록 PDF 파일입니다.",
        "image": "assets/images/product_F1 info.png",
        "files": [
            {
                "name": "2025_Alpine_Catalog__KOR_-22-F1_16Page_215mm_x_280mm.pdf",
                "path": "assets/files/2025_Alpine_Catalog__KOR_-22-F1_16Page_215mm_x_280mm.pdf",
                "url": "https://raw.githubusercontent.com/alpinehome-jcha/alpinehompage/main/assets/files/2025_Alpine_Catalog__KOR_-22-F1_16Page_215mm_x_280mm.pdf"
            },
            {
                "name": "2025 알파인 종합카다록(A3)-03.pdf",
                "path": "assets/files/2025 알파인 종합카다록(A3)-03.pdf",
                "url": "https://raw.githubusercontent.com/alpinehome-jcha/alpinehompage/main/assets/files/2025 %EC%95%8C%ED%8C%8C%EC%9D%B8 %EC%A2%85%ED%95%A9%EC%B9%B4%EB%8B%A4%EB%A1%9D(A3)-03.pdf"
            }
        ],
        "author": "Admin"
    },
    {
        "id": 1770614710476,
        "date": "2026-02-09",
        "title": "PXE-C80-88 PC 프로그램",
        "content": "PXE-C80-88 PC 세팅 소프트웨어 및 매뉴얼입니다.",
        "image": "assets/images/optim pc.jpg",
        "files": [
            {
                "name": "ALPINE_OPTIM_Setup[3.10000].zip",
                "path": "assets/files/ALPINE_OPTIM_Setup[3.10000].zip"
            },
            {
                "name": "PXE-C80-88_manual.pdf",
                "path": "assets/files/PXE-C80-88_manual.pdf"
            }
        ],
        "author": "Admin"
    },
    {
        "id": 1770613931452,
        "date": "2026-02-09",
        "title": "알파인 PC 통합 프로그램 (DSP Tuning)",
        "content": "반드시 인터넷에 접속되어야 하며, 실행시킬 제품을 선택하면 됩니다.\nPXE-C80-88은 별도로 제공합니다.",
        "image": "assets/images/PC통합.jpg",
        "files": [
            {
                "name": "ALPINE DSP PC Tuning (통합버전).zip",
                "path": "assets/files/ALPINE DSP PC Tuning (통합버전).zip"
            }
        ],
        "author": "Admin"
    }
];
const RESOURCE_DATA_VERSION = 202607232200;

let resourceData = [];
if (typeof localStorage !== 'undefined') {
    const storedVersion = localStorage.getItem('resourceDataVersion');
    const stored = localStorage.getItem('resourceData');

    if (typeof RESOURCE_DATA_VERSION !== 'undefined' && (!storedVersion || parseInt(storedVersion) < RESOURCE_DATA_VERSION)) {
        // Server has newer version, force update
        resourceData = JSON.parse(JSON.stringify(initialResourceData));
        localStorage.setItem('resourceData', JSON.stringify(resourceData));
        localStorage.setItem('resourceDataVersion', RESOURCE_DATA_VERSION.toString());
    } else if (stored) {
        resourceData = JSON.parse(stored);
        // Safety Check for empty data
        if (resourceData.length === 0 && initialResourceData.length > 0) {
             resourceData = JSON.parse(JSON.stringify(initialResourceData));
             localStorage.setItem('resourceData', JSON.stringify(resourceData));
             if (typeof RESOURCE_DATA_VERSION !== 'undefined') localStorage.setItem('resourceDataVersion', RESOURCE_DATA_VERSION.toString());
        }
    } else {
        resourceData = JSON.parse(JSON.stringify(initialResourceData));
        if (typeof RESOURCE_DATA_VERSION !== 'undefined') localStorage.setItem('resourceDataVersion', RESOURCE_DATA_VERSION.toString());
    }
} else {
    resourceData = initialResourceData;
}

if (typeof window !== 'undefined') {
    window.resourceData = resourceData;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = resourceData;
}