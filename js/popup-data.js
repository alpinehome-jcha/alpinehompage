const initialPopupData = [];

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