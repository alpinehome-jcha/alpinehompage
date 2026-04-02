const initialLaborRuleData = [];
const LABOR_RULE_DATA_VERSION = 1775193387829;

let laborRuleData = [];
if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('laborRuleData');
    const storedVersion = localStorage.getItem('laborRuleDataVersion');
    if (typeof LABOR_RULE_DATA_VERSION !== 'undefined' && (!storedVersion || parseInt(storedVersion) < LABOR_RULE_DATA_VERSION)) {
        laborRuleData = JSON.parse(JSON.stringify(initialLaborRuleData));
        localStorage.setItem('laborRuleData', JSON.stringify(laborRuleData));
        localStorage.setItem('laborRuleDataVersion', LABOR_RULE_DATA_VERSION.toString());
    } else if (stored) {
        laborRuleData = JSON.parse(stored);
    } else {
        laborRuleData = JSON.parse(JSON.stringify(initialLaborRuleData));
    }
} else {
    laborRuleData = initialLaborRuleData;
}

if (typeof window !== 'undefined') {
    window.laborRuleData = laborRuleData;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = laborRuleData;
}
