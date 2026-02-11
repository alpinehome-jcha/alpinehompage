const initialPriceData = [
    // F#1 Status System
    {
        category: 'master',
        productCategory: 'F#1 Status',
        product: 'F#1 Status System',
        msrp: 45000000,
        distPrice: 'Special',
        dealerPrice: '-'
    },
    {
        category: 'team',
        productCategory: 'F#1 Status',
        product: 'F#1 Status System',
        msrp: 45000000,
        distPrice: '-',
        dealerPrice: '-'
    },
    {
        category: 'dealer',
        productCategory: 'F#1 Status',
        product: 'F#1 Status System',
        msrp: 45000000,
        distPrice: '-',
        dealerPrice: '-'
    }
];

// Helper to get text label for category
function getCategoryLabel(cat) {
    const labels = {
        'master': '알파인사운드마스터',
        'team': '팀알파인',
        'style': '알파인스타일총판',
        'region': '알파인 지역총판',
        'dealer': '알파인 대리점'
    };
    return labels[cat] || cat;
}

// Global accessor for data (used by pages)
const DATA_VERSION = "2026-02-11-ForceUpdate";

let priceData = [];
try {
    const storedVersion = localStorage.getItem('priceDataVersion');
    if (storedVersion !== DATA_VERSION) {
        console.log('Price data version mismatch. Updating from file:', DATA_VERSION);
        priceData = JSON.parse(JSON.stringify(initialPriceData));
        localStorage.setItem('priceData', JSON.stringify(priceData));
        localStorage.setItem('priceDataVersion', DATA_VERSION);
    } else {
        const stored = localStorage.getItem('priceData');
        if (stored) {
            priceData = JSON.parse(stored);
        } else {
            priceData = JSON.parse(JSON.stringify(initialPriceData)); // Deep copy
            localStorage.setItem('priceData', JSON.stringify(priceData));
        }
    }
} catch (e) {
    console.error('Local Storage Error:', e);
    priceData = initialPriceData;
}

// Data Synchronization & Sanitization
// 1. Merge missing items from initialPriceData into priceData
let isUpdated = false;

// Cleanup: Remove HDZ-9000 if it exists in any category
const initialLength = priceData.length;
priceData = priceData.filter(p => p.product !== 'HDZ-9000');
if (priceData.length !== initialLength) {
    isUpdated = true;
}

initialPriceData.forEach(defItem => {
    const exists = priceData.some(p =>
        p.category === defItem.category &&
        p.product === defItem.product
    );
    if (!exists) {
        priceData.push(defItem);
        isUpdated = true;
    }
});

// 2. Full Synchronization: Master -> Team & Dealer
// Iterate through ALL Master items currently in priceData
const masterItems = priceData.filter(item => item.category === 'master');
const targetCategories = ['team', 'dealer'];

masterItems.forEach(masterItem => {
    targetCategories.forEach(targetCat => {
        // Check if a corresponding item exists for this category
        const targetIdx = priceData.findIndex(p =>
            p.category === targetCat &&
            p.product === masterItem.product
        );

        if (targetIdx === -1) {
            // If Missing: Create new entry copying Master values EXCEPT Dist Price
            priceData.push({
                category: targetCat,
                productCategory: masterItem.productCategory,
                product: masterItem.product,
                msrp: masterItem.msrp,
                dealerPrice: masterItem.dealerPrice,
                distPrice: '-' // RULE: Remove Distribution Price
            });
            isUpdated = true;
        } else {
            // If Exists: Update to ensure it matches Master (except Dist Price)
            const targetItem = priceData[targetIdx];
            let needsUpdate = false;

            if (targetItem.msrp !== masterItem.msrp) {
                targetItem.msrp = masterItem.msrp;
                needsUpdate = true;
            }
            if (targetItem.dealerPrice !== masterItem.dealerPrice) {
                targetItem.dealerPrice = masterItem.dealerPrice;
                needsUpdate = true;
            }
            // If product category changed in master, sync it
            if (targetItem.productCategory !== masterItem.productCategory) {
                targetItem.productCategory = masterItem.productCategory;
                needsUpdate = true;
            }
            // CRITICAL: Ensure Dist Price is removed if it has any value other than '-'
            if (targetItem.distPrice !== '-') {
                targetItem.distPrice = '-';
                needsUpdate = true;
            }

            if (needsUpdate) isUpdated = true;
        }
    });
});

// 3. Synchronization: Style -> Region
// Iterate through ALL Style items currently in priceData
const styleItems = priceData.filter(item => item.category === 'style');
styleItems.forEach(styleItem => {
    // Check if a corresponding item exists for region
    const regionIdx = priceData.findIndex(p =>
        p.category === 'region' &&
        p.product === styleItem.product
    );

    if (regionIdx === -1) {
        // If Missing: Create new entry copying Style values
        priceData.push({
            category: 'region',
            productCategory: styleItem.productCategory,
            product: styleItem.product,
            msrp: styleItem.msrp,
            distPrice: styleItem.distPrice,
            dealerPrice: styleItem.dealerPrice
        });
        isUpdated = true;
    } else {
        // If Exists: Update to ensure it matches Style
        const regionItem = priceData[regionIdx];
        let needsUpdate = false;

        if (regionItem.msrp !== styleItem.msrp) {
            regionItem.msrp = styleItem.msrp;
            needsUpdate = true;
        }
        if (regionItem.distPrice !== styleItem.distPrice) {
            regionItem.distPrice = styleItem.distPrice;
            needsUpdate = true;
        }
        if (regionItem.dealerPrice !== styleItem.dealerPrice) {
            regionItem.dealerPrice = styleItem.dealerPrice;
            needsUpdate = true;
        }

        if (needsUpdate) isUpdated = true;
    }
});

if (isUpdated) {
    localStorage.setItem('priceData', JSON.stringify(priceData));
}

// Save function (to be called by admin page)
function savePriceData() {
    localStorage.setItem('priceData', JSON.stringify(priceData));
}
