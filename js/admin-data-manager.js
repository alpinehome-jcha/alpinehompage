/**
 * Admin Data Manager
 * Handles exporting localStorage data to downloadable JS files.
 */

const DATA_FILES = {
    product: {
        key: 'productData',
        filename: 'product-data.js',
        varName: 'initialProductData' // The variable name in the file
    },
    dealer: {
        key: 'dealerData',
        filename: 'dealer-data.js',
        varName: 'initialDealerData'
    },
    popup: {
        key: 'popupList', // Note: key in localStorage is popupList, file is popup-data.js
        filename: 'popup-data.js',
        varName: 'initialPopupData'
    },
    promo: {
        key: 'promoData',
        filename: 'promo-data.js',
        varName: 'initialPromoData'
    },
    resource: {
        key: 'resourceData',
        filename: 'resource-data.js',
        varName: 'initialResourceData'
    },
    install: {
        key: 'installData',
        filename: 'install-data.js',
        varName: 'initialInstallData'
    },
    support_product: {
        key: 'supportProductData',
        filename: 'support-product-data.js',
        varName: 'initialSupportProductData'
    }
};

function downloadData(type) {
    const config = DATA_FILES[type];
    if (!config) {
        console.error('Unknown data type:', type);
        return;
    }

    const rawData = localStorage.getItem(config.key);
    if (!rawData) {
        alert(`No data found in Local Storage for ${type}.`);
        return;
    }

    let parsedData;
    try {
        parsedData = JSON.parse(rawData);
    } catch (e) {
        alert(`Error parsing data for ${type}.`);
        return;
    }

    // Generate File Content
    // We want to reconstruct the file format:
    // const initialX = [...]; ... logic ...

    // 1. Stringify with pretty print
    const jsonString = JSON.stringify(parsedData, null, 4);

    // 2. Build the script content
    // We use a simplified template that works for all files based on the pattern we identified.
    // Note: We need to match the variable names exactly to what the existing files use.

    let content = `const ${config.varName} = ${jsonString};\n\n`;

    // Add the loading logic (Standard Pattern)
    // We can just use a generic loader logic, or try to mimic the specific one.
    // The standard pattern used in this project:
    content += `let ${type === 'popup' ? 'popupData' : config.key} = [];\n`;
    content += `if (typeof localStorage !== 'undefined') {\n`;
    content += `    const stored = localStorage.getItem('${config.key}');\n`;
    content += `    if (stored) {\n`;
    content += `        ${type === 'popup' ? 'popupData' : config.key} = JSON.parse(stored);\n`;
    content += `    } else {\n`;
    content += `        ${type === 'popup' ? 'popupData' : config.key} = JSON.parse(JSON.stringify(${config.varName}));\n`;
    content += `    }\n`;
    content += `} else {\n`;
    content += `    ${type === 'popup' ? 'popupData' : config.key} = ${config.varName};\n`;
    content += `}\n\n`;

    content += `if (typeof module !== 'undefined' && module.exports) {\n`;
    content += `    module.exports = ${type === 'popup' ? 'popupData' : config.key};\n`;
    content += `}\n`;

    // 3. Create Blob and Download
    const blob = new Blob([content], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = config.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function downloadAll() {
    if (!confirm('This will download 7 JavaScript files. Please allow multiple file downloads if prompted.')) return;

    const types = Object.keys(DATA_FILES);
    let delay = 0;

    types.forEach((type) => {
        setTimeout(() => {
            downloadData(type);
        }, delay);
        delay += 500; // Stagger downloads to avoid browser blocking
    });
}

function clearAllLocalStorage() {
    if (confirm('WARNING: This will delete ALL data in your browser\'s Local Storage and reset the Admin panel to default state associated with the current files.\n\nAre you sure?')) {
        localStorage.clear();
        alert('Local Storage cleared. Reloading page...');
        location.reload();
    }
}
