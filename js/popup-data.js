const initialPopupData = [
    {
        "id": 1771558591828,
        "title": "오키나와",
        "isActive": true,
        "imagePath": "https://raw.githubusercontent.com/alpinehome-jcha/alpinehompage/main/assets/images/popupimage/01.jpg",
        "hideDays": 365,
        "linkUrl": "https://ko.okiren8131.com/"
    },
    {
        "id": 1788408625755,
        "title": "대리점모집",
        "isActive": true,
        "dealerOnly": false,
        "imagePath": "https://raw.githubusercontent.com/alpinehome-jcha/alpinehompage/main/assets/images/popups/alpine_dealer_popup2.jpg",
        "hideDays": 365,
        "linkUrl": "#"
    },
    {
        "id": 1788411969373,
        "title": "앰비언트 트위",
        "isActive": true,
        "dealerOnly": true,
        "imagePath": "https://raw.githubusercontent.com/alpinehome-jcha/alpinehompage/main/assets/images/popups/__________.jpg",
        "hideDays": 1,
        "linkUrl": "https://www.alpine-korea.co.kr/pages/products/kgm-%ED%9A%8C%EC%98%A4%EB%A6%AC-%EC%95%B0%EB%B9%84%EC%96%B8%ED%8A%B8-s2-s10tw-%ED%8A%B8%EC%9C%84%ED%84%B0-%ED%8C%A8%ED%82%A4%EC%A7%80.html"
    }
];
const POPUP_DATA_VERSION = 1788411970545;

let popupData = [];
if (typeof localStorage !== 'undefined') {
    const storedVersion = localStorage.getItem('popupDataVersion');
    const stored = localStorage.getItem('popupData');

    if (typeof POPUP_DATA_VERSION !== 'undefined' && (!storedVersion || parseInt(storedVersion) < POPUP_DATA_VERSION)) {
        // Server has newer version, force update
        popupData = JSON.parse(JSON.stringify(initialPopupData));
        localStorage.setItem('popupData', JSON.stringify(popupData));
        localStorage.setItem('popupDataVersion', POPUP_DATA_VERSION.toString());
    } else if (stored) {
        popupData = JSON.parse(stored);
        // Safety Check for empty data
        if (popupData.length === 0 && initialPopupData.length > 0) {
             popupData = JSON.parse(JSON.stringify(initialPopupData));
             localStorage.setItem('popupData', JSON.stringify(popupData));
             if (typeof POPUP_DATA_VERSION !== 'undefined') localStorage.setItem('popupDataVersion', POPUP_DATA_VERSION.toString());
        }
    } else {
        popupData = JSON.parse(JSON.stringify(initialPopupData));
        if (typeof POPUP_DATA_VERSION !== 'undefined') localStorage.setItem('popupDataVersion', POPUP_DATA_VERSION.toString());
    }
} else {
    popupData = initialPopupData;
}

if (typeof window !== 'undefined') {
    window.popupData = popupData;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = popupData;
}