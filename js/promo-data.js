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

const DATA_VERSION = "2026-02-11-ForceUpdate";

let promoData = [];
if (typeof localStorage !== 'undefined') {
    const storedVersion = localStorage.getItem('promoDataVersion');
    if (storedVersion !== DATA_VERSION) {
        console.log('Promo data version mismatch. Updating from file:', DATA_VERSION);
        promoData = JSON.parse(JSON.stringify(initialPromoData));
        localStorage.setItem('promoData', JSON.stringify(promoData));
        localStorage.setItem('promoDataVersion', DATA_VERSION);
    } else {
        const stored = localStorage.getItem('promoData');
        if (stored) {
            promoData = JSON.parse(stored);
        } else {
            promoData = JSON.parse(JSON.stringify(initialPromoData));
        }
    }
} else {
    promoData = initialPromoData;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = promoData;
}