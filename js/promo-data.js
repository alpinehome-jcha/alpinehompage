const initialPromoData = [
    {
        "id": 1770615888060,
        "date": "2026-02-09",
        "title": "알파인 종합 카다록",
        "contentBlocks": [],
        "content": "",
        "files": [
            {
                "name": "2025 알파인 종합카다록(A3)-03.pdf",
                "path": "assets/files/2025 알파인 종합카다록(A3)-03.pdf"
            }
        ],
        "author": "Admin"
    }
];

const PROMO_DATA_VERSION = 1770872784704;

let promoData = [];
if (typeof localStorage !== 'undefined') {
    const storedVersion = localStorage.getItem('promoDataVersion');
    const stored = localStorage.getItem('promoData');

    if (typeof PROMO_DATA_VERSION !== 'undefined' && (!storedVersion || parseInt(storedVersion) < PROMO_DATA_VERSION)) {
        // Server has newer version, force update
        promoData = JSON.parse(JSON.stringify(initialPromoData));
        localStorage.setItem('promoData', JSON.stringify(promoData));
        localStorage.setItem('promoDataVersion', PROMO_DATA_VERSION.toString());
    } else if (stored) {
        promoData = JSON.parse(stored);
    } else {
        promoData = JSON.parse(JSON.stringify(initialPromoData));
        if (typeof PROMO_DATA_VERSION !== 'undefined') localStorage.setItem('promoDataVersion', PROMO_DATA_VERSION.toString());
    }
} else {
    promoData = initialPromoData;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = promoData;
}