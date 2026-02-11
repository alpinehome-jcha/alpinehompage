const initialPopupData = [
    {
        "id": 1770694714225,
        "title": "오키나와렌트",
        "isActive": true,
        "imagePath": "assets/images/popupimage/01.jpg",
        "hideDays": 360,
        "linkUrl": "https://car.okinawaobaksa.com/kr/okinawa/shop/car_arusu"
    }
];

const DATA_VERSION = "2026-02-11-REV2";

let popupData = [];
if (typeof localStorage !== 'undefined') {
    const storedVersion = localStorage.getItem('popupDataVersion');
    if (storedVersion !== DATA_VERSION) {
        // Version mismatch! Force update from file
        console.log('Popup data version mismatch. Updating from file:', DATA_VERSION);
        popupData = JSON.parse(JSON.stringify(initialPopupData));
        localStorage.setItem('popupData', JSON.stringify(popupData));
        localStorage.setItem('popupDataVersion', DATA_VERSION);
    } else {
        const stored = localStorage.getItem('popupData');
        if (stored) {
            popupData = JSON.parse(stored);
        } else {
            popupData = JSON.parse(JSON.stringify(initialPopupData));
        }
    }
} else {
    popupData = initialPopupData;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = popupData;
}