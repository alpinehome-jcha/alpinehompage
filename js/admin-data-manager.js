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
        case 'estimate':
            dataName = 'estimateData';
            fileName = 'estimate-data.js';
            dataObj = (typeof estimateData !== 'undefined') ? estimateData : null;
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

async function saveToGitHub(type, silent = false) {
    const token = localStorage.getItem('github_token');
    const repo = localStorage.getItem('github_repo');

    if (!token || !repo) {
        if (!silent) alert('GitHub Settings are missing. Please configure them in Admin > Partner Zone > GitHub Settings.');
        return;
    }

    if (!silent) {
        if (!confirm(`Are you sure you want to commit changes to ${type}-data.js on GitHub? This will trigger a site redeploy.`)) return;
    }

    let dataName = '';
    let fileName = '';
    let dataObj = null;

    switch (type) {
        case 'product':
            dataName = 'productData';
            fileName = 'js/product-data.js';
            dataObj = (typeof productData !== 'undefined') ? productData : null;
            break;
        case 'dealer':
            dataName = 'dealerData';
            fileName = 'js/dealer-data.js';
            dataObj = (typeof dealerData !== 'undefined') ? dealerData : null;
            break;
        case 'popup':
            dataName = 'popupData';
            fileName = 'js/popup-data.js';
            dataObj = (typeof popupList !== 'undefined') ? popupList : null;
            // Fallback to global if not currently in admin scope variables
            if (!dataObj && typeof popupData !== 'undefined') dataObj = popupData;
            break;
        case 'promo':
            dataName = 'promoData';
            fileName = 'js/promo-data.js';
            dataObj = (typeof promoData !== 'undefined') ? promoData : null;
            break;
        case 'resource':
            dataName = 'resourceData';
            fileName = 'js/resource-data.js';
            dataObj = (typeof resourceData !== 'undefined') ? resourceData : null;
            break;
        case 'install':
            dataName = 'installData';
            fileName = 'js/install-data.js';
            dataObj = (typeof installData !== 'undefined') ? installData : null;
            break;
        case 'support_product':
            dataName = 'supportProductData';
            fileName = 'js/support-product-data.js';
            dataObj = (typeof supportProductData !== 'undefined') ? supportProductData : null;
            break;
        case 'estimate':
            dataName = 'estimateData';
            fileName = 'js/estimate-data.js';
            dataObj = (typeof estimateData !== 'undefined') ? estimateData : null;
            break;
    }

    // Try to get from LocalStorage first (most up to date)
    const stored = localStorage.getItem(dataName);
    if (stored) {
        dataObj = JSON.parse(stored);
    }

    if (!dataObj) {
        if (!silent) alert('No data found for ' + type);
        return;
    }

    // Format as JS file content
    const jsonStr = JSON.stringify(dataObj, null, 4);
    const version = Date.now();
    const varName = (type === 'popup') ? 'initialPopupData' :
        (type === 'dealer') ? 'initialDealerData' :
            (type === 'product') ? 'initialProductData' :
                (type === 'promo') ? 'initialPromoData' :
                    (type === 'resource') ? 'initialResourceData' :
                        (type === 'install') ? 'initialInstallData' :
                            (type === 'support_product') ? 'initialSupportProductData' :
                                (type === 'estimate') ? 'initialEstimateData' :
                                    'initial' + type.charAt(0).toUpperCase() + type.slice(1) + 'Data';

    const versionVarName = (type === 'dealer') ? 'DEALER_DATA_VERSION' :
        (type === 'product') ? 'PRODUCT_DATA_VERSION' :
            (type === 'popup') ? 'POPUP_DATA_VERSION' :
                (type === 'promo') ? 'PROMO_DATA_VERSION' :
                    (type === 'resource') ? 'RESOURCE_DATA_VERSION' :
                        (type === 'install') ? 'INSTALL_DATA_VERSION' :
                            (type === 'support_product') ? 'SUPPORT_PRODUCT_DATA_VERSION' :
                                (type === 'estimate') ? 'ESTIMATE_DATA_VERSION' :
                                    'DATA_VERSION';

    let fileContent = `const ${varName} = ${jsonStr};\n`;
    fileContent += `const ${versionVarName} = ${version};\n\n`;

    let logicVar = dataName;
    let versionKey = dataName + 'Version';

    fileContent += `let ${logicVar} = [];\n`;
    fileContent += `if (typeof localStorage !== 'undefined') {\n`;
    fileContent += `    const storedVersion = localStorage.getItem('${versionKey}');\n`;
    fileContent += `    const stored = localStorage.getItem('${dataName}');\n\n`;

    fileContent += `    if (typeof ${versionVarName} !== 'undefined' && (!storedVersion || parseInt(storedVersion) < ${versionVarName})) {\n`;
    fileContent += `        // Server has newer version, force update\n`;
    fileContent += `        ${logicVar} = JSON.parse(JSON.stringify(${varName}));\n`;
    fileContent += `        localStorage.setItem('${dataName}', JSON.stringify(${logicVar}));\n`;
    fileContent += `        localStorage.setItem('${versionKey}', ${versionVarName}.toString());\n`;
    fileContent += `    } else if (stored) {\n`;
    fileContent += `        ${logicVar} = JSON.parse(stored);\n`;
    fileContent += `        // Safety Check for empty data\n`;
    fileContent += `        if (${logicVar}.length === 0 && ${varName}.length > 0) {\n`;
    fileContent += `             ${logicVar} = JSON.parse(JSON.stringify(${varName}));\n`;
    fileContent += `             localStorage.setItem('${dataName}', JSON.stringify(${logicVar}));\n`;
    fileContent += `             if (typeof ${versionVarName} !== 'undefined') localStorage.setItem('${versionKey}', ${versionVarName}.toString());\n`;
    fileContent += `        }\n`;
    fileContent += `    } else {\n`;
    fileContent += `        ${logicVar} = JSON.parse(JSON.stringify(${varName}));\n`;
    fileContent += `        if (typeof ${versionVarName} !== 'undefined') localStorage.setItem('${versionKey}', ${versionVarName}.toString());\n`;
    fileContent += `    }\n`;
    fileContent += `} else {\n`;
    fileContent += `    ${logicVar} = ${varName};\n`;
    fileContent += `}\n\n`;

    fileContent += `if (typeof window !== 'undefined') {\n`;
    fileContent += `    window.${logicVar} = ${logicVar};\n`;
    fileContent += `}\n\n`;

    fileContent += `if (typeof module !== 'undefined' && module.exports) {\n`;
    fileContent += `    module.exports = ${logicVar};\n`;
    fileContent += `}`;

    // Execute Commit
    // Check if ghClient exists
    if (typeof ghClient === 'undefined') {
        alert('GitHub Client Library (github-client.js) is not loaded.');
        return;
    }

    // Ensure client is configured
    if (!ghClient.isConfigured()) {
        ghClient.configure(token, repo);
    }

    try {
        const msg = silent ? `Auto-save ${type} data` : `Update ${type} data from Admin/Resource Panel`;
        if (silent) console.log(`Auto-saving ${type} to GitHub...`);

        await ghClient.commitFile(fileName, fileContent, msg);

        if (silent) {
            const toast = document.createElement('div');
            toast.style.cssText = 'position:fixed; bottom:20px; right:20px; background:#2ecc71; color:white; padding:10px 20px; border-radius:4px; z-index:9999; box-shadow:0 2px 10px rgba(0,0,0,0.2); animation: fadein 0.5s, fadeout 0.5s 2.5s forwards;';
            toast.textContent = `${type} data saved to GitHub!`;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        } else {
            alert(`Successfully saved ${fileName} to GitHub!`);
        }
    } catch (err) {
        console.error(err);
        if (silent) {
            const toast = document.createElement('div');
            toast.style.cssText = 'position:fixed; bottom:20px; right:20px; background:#e74c3c; color:white; padding:10px 20px; border-radius:4px; z-index:9999; box-shadow:0 2px 10px rgba(0,0,0,0.2);';
            toast.textContent = `Auto-save failed: ${err.message}`;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 5000);
        } else {
            alert(`Error saving to GitHub: ${err.message}`);
        }
    }
}
