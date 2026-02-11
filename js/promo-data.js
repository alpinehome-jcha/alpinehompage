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

let promoData = [];
if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('promoData');
    if (stored) {
        promoData = JSON.parse(stored);
    } else {
        promoData = JSON.parse(JSON.stringify(initialPromoData));
    }
} else {
    promoData = initialPromoData;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = promoData;
}