const initialResourceData = [
    {
        "id": 1773204679768,
        "date": "2026-03-11",
        "title": "현대/기아/제네시스 노이즈 캔슬링 마이크 위치",
        "content": "현대/기아/제네시스에서 노이즈 캔슬링이 장착되 차종\n\nG80\nG90\nGV60\nGV70\nGV80\n펠리세이드(LX2)24년이전/ (LX3)25년이후에는없음\nEV9\n아이오닉9\nK8\n그랜저(GN7)\n\n노이즈 캔슬링기능은 끌수 없습니다. OEM앰프에서 마이크 배선을 자르는 방법도 있지만 일부 차종은 마이크 전용 배선이 없을 수 있습니다.\n가장 확실한 방법은 노이즈 캔슬링 마이크를 탈거해서 마이크에 소리가 입력되지 않도록 테잎등으로 감싸는 것입니다.\n\n첨부파일은 각 차종의 노이즈 캔슬링 마이크 위치입니다.",
        "image": "",
        "files": [
            {
                "name": "20260311 현대기아 RANC MIC.pdf",
                "path": "assets/files/20260311 현대기아 RANC MIC.pdf"
            }
        ],
        "author": "Admin"
    },
    {
        "id": 1770614710476,
        "date": "2026-02-09",
        "title": "PXE-C80-88 PC 프로그램",
        "content": "베타버전입니다.",
        "image": "assets/images/optim pc.jpg",
        "files": [
            {
                "name": "ALPINE_OPTIM_Setup[3.10000].zip",
                "path": "assets/files/ALPINE_OPTIM_Setup[3.10000].zip"
            }
        ],
        "author": "Admin"
    },
    {
        "id": 1770613931452,
        "date": "2026-02-09",
        "title": "알파인 PC 통합 프로그램",
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
const RESOURCE_DATA_VERSION = 1773207209507;

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