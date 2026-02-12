const initialPopupData = [];

const POPUP_DATA_VERSION = 1770872784704;

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
    } else {
        popupData = JSON.parse(JSON.stringify(initialPopupData));
        if (typeof POPUP_DATA_VERSION !== 'undefined') localStorage.setItem('popupDataVersion', POPUP_DATA_VERSION.toString());
    }
} else {
    popupData = initialPopupData;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = popupData;
}