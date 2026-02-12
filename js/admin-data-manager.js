// Admin Data Manager - Export & Import Logic

function downloadData(type) {
    let dataName = '';
    let fileName = '';
    let dataObj = null;

    switch (type) {
        case 'product':
            dataName = 'productData';
            fileName = 'product-data.js';
            dataObj = (typeof productData !== 'undefined') ? productData : null;
            break;
        case 'dealer':
            dataName = 'dealerData';
            fileName = 'dealer-data.js';
            dataObj = (typeof dealerData !== 'undefined') ? dealerData : null;
            break;
        case 'popup':
            dataName = 'popupData';
            fileName = 'popup-data.js';
            dataObj = (typeof popupList !== 'undefined') ? popupList : null; // popupList is the variable in admin
            if (!dataObj && typeof popupData !== 'undefined') dataObj = popupData;
            break;
        case 'promo':
            dataName = 'promoData';
            fileName = 'promo-data.js';
            dataObj = (typeof promoData !== 'undefined') ? promoData : null;
            break;
        case 'resource':
            dataName = 'resourceData';
            fileName = 'resource-data.js';
            dataObj = (typeof resourceData !== 'undefined') ? resourceData : null;
            break;
        case 'install':
            dataName = 'installData';
            fileName = 'install-data.js';
            dataObj = (typeof installData !== 'undefined') ? installData : null;
            break;
        case 'support_product':
            dataName = 'supportProductData';
            fileName = 'support-product-data.js';
            dataObj = (typeof supportProductData !== 'undefined') ? supportProductData : null;
            break;
    }

    // Try to get from LocalStorage first (most up to date)
    const stored = localStorage.getItem(dataName);
    if (stored) {
        dataObj = JSON.parse(stored);
    }

    if (!dataObj) {
        alert('No data found for ' + type);
        return;
    }

    // Format as JS file
    const jsonStr = JSON.stringify(dataObj, null, 4);
    const varName = (type === 'popup') ? 'initialPopupData' :
        (type === 'dealer') ? 'initialDealerData' :
            (type === 'product') ? 'initialProductData' :
                (type === 'promo') ? 'initialPromoData' :
                    (type === 'resource') ? 'initialResourceData' :
                        (type === 'install') ? 'initialInstallData' :
                            'initial' + type.charAt(0).toUpperCase() + type.slice(1) + 'Data';

    // Construct File Content
    let fileContent = `const ${varName} = ${jsonStr};\n`;

    // Inject Version
    const version = Date.now();
    const versionVarName = (type === 'dealer') ? 'DEALER_DATA_VERSION' :
        (type === 'product') ? 'PRODUCT_DATA_VERSION' :
            (type === 'popup') ? 'POPUP_DATA_VERSION' :
                (type === 'promo') ? 'PROMO_DATA_VERSION' :
                    (type === 'resource') ? 'RESOURCE_DATA_VERSION' :
                        (type === 'install') ? 'INSTALL_DATA_VERSION' :
                            (type === 'support_product') ? 'SUPPORT_PRODUCT_DATA_VERSION' :
                                'DATA_VERSION';

    fileContent += `const ${versionVarName} = ${version};\n\n`;

    // Add logic block (standard boilerplate for each file)
    let logicVar = dataName; // e.g. productData
    let versionKey = dataName + 'Version';

    fileContent += `let ${logicVar} = [];\n`;
    fileContent += `if (typeof localStorage !== 'undefined') {\n`;
    fileContent += `    const stored = localStorage.getItem('${dataName}');\n`;
    fileContent += `    const storedVer = localStorage.getItem('${dataName}_version');\n`;
    fileContent += `    if (stored) {\n`;
    fileContent += `        ${logicVar} = JSON.parse(stored);\n`;
    fileContent += `    } else {\n`;
    fileContent += `        ${logicVar} = JSON.parse(JSON.stringify(${varName}));\n`;
    fileContent += `    }\n`;
    fileContent += `} else {\n`;
    fileContent += `    ${logicVar} = ${varName};\n`;
    fileContent += `}\n\n`;
    fileContent += `if (typeof module !== 'undefined' && module.exports) {\n`;
    fileContent += `    module.exports = ${logicVar};\n`;
    fileContent += `}`;

    // Trigger Download
    const blob = new Blob([fileContent], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function downloadAll() {
    const types = ['product', 'dealer', 'popup', 'promo', 'resource', 'install', 'support_product'];
    let delay = 0;
    types.forEach(type => {
        setTimeout(() => {
            downloadData(type);
        }, delay);
        delay += 500; // Stagger downloads
    });
}

function clearAllLocalStorage() {
    if (confirm('Are you sure you want to clear ALL Admin data from this browser? This will revert everything to the state of the files on disk.')) {
        localStorage.clear();
        alert('Local Storage Cleared. Page will reload.');
        location.reload();
    }
}
