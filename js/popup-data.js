const initialPopupData = [];

let popupData = [];
if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('popupData');
    if (stored) {
        popupData = JSON.parse(stored);
    } else {
        popupData = initialPopupData;
        // Try legacy migration
        const oldList = localStorage.getItem('popupList');
        if (oldList) {
            popupData = JSON.parse(oldList);
            localStorage.setItem('popupData', JSON.stringify(popupData));
        }
    }
} else {
    popupData = initialPopupData;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = popupData;
}
