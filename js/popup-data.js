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
        "imagePath": "https://raw.githubusercontent.com/alpinehome-jcha/alpinehompage/main/assets/images/popups/alpine_dealer_popup2.jpg",
        "hideDays": 365,
        "linkUrl": "#"
    }
];
const POPUP_DATA_VERSION = 1788409407087;

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