const initialResourceData = [
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

const RESOURCE_DATA_VERSION = 1770872784704;

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
    } else {
        resourceData = JSON.parse(JSON.stringify(initialResourceData));
        if (typeof RESOURCE_DATA_VERSION !== 'undefined') localStorage.setItem('resourceDataVersion', RESOURCE_DATA_VERSION.toString());
    }
} else {
    resourceData = initialResourceData;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = resourceData;
}