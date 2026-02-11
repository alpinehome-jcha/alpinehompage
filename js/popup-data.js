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

let popupData = [];
if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('popupData');
    if (stored) {
        popupData = JSON.parse(stored);
    } else {
        popupData = JSON.parse(JSON.stringify(initialPopupData));
    }
} else {
    popupData = initialPopupData;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = popupData;
}