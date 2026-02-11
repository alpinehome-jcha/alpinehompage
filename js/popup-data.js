const initialPopupData = [];

let popupData = [];

if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('popupList');
    if (stored) {
        popupData = JSON.parse(stored);
    } else {
        // Migration from old config or init
        const oldConfig = localStorage.getItem('popupConfig');
        if (oldConfig) {
            try {
                const c = JSON.parse(oldConfig);
                if (c.isActive) {
                    popupData.push({
                        id: 'legacy',
                        title: 'Event',
                        imagePath: c.imagePath,
                        linkUrl: c.linkUrl,
                        hideDays: c.hideDays,
                        isActive: true
                    });
                }
            } catch (e) {
                console.error("Error parsing old popupConfig", e);
            }
        }
        if (popupData.length === 0) {
            popupData = initialPopupData;
        }
    }
} else {
    popupData = initialPopupData;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = popupData;
}
