// PnP Rule Mapping Data (DSP to Compatible Cables)
// Hierarchy: DSP -> { integrated: [...], typeB: [...] }

const initialPnpRuleData = [
    {
        dsp: "PXE-M60-4",
        integrated: ["HK-101", "HK-102", "HK-103", "HK-104", "HK-106"],
        typeB: ["DS-4B"]
    },
    {
        dsp: "PXE-X120-10DP",
        integrated: ["HK-107", "BM-401", "BM-402", "BM-403", "BZ-503"],
        typeB: ["DS-10B"]
    },
    {
        dsp: "PXE-C80-88",
        integrated: ["GE-203", "BZ-501", "BZ-502"],
        typeB: ["DS-82B"]
    },
    {
        dsp: "PXE-X121-12EV",
        integrated: ["TS-301", "TS-302", "TS-303", "TS-304"],
        typeB: ["DS-12B"]
    },
    {
        dsp: "PXE-R80-8",
        integrated: [],
        typeB: ["DS-8B"]
    },
    {
        dsp: "PXE-R100-8",
        integrated: [],
        typeB: ["DS-8B"]
    },
    {
        dsp: "PXE-R100-10",
        integrated: [],
        typeB: ["DS-10B"]
    },
    {
        dsp: "PXE-X120-8",
        integrated: [],
        typeB: ["DS-81B"]
    },
    {
        dsp: "HDP-D90",
        integrated: [],
        typeB: ["DS-14B"]
    }
];

const PNP_RULE_DATA_VERSION = Date.now();

let pnpRuleData = [];
if (typeof localStorage !== 'undefined') {
    const storedVersion = localStorage.getItem('pnpRuleDataVersion');
    const stored = localStorage.getItem('pnpRuleData');

    if (typeof PNP_RULE_DATA_VERSION !== 'undefined' && (!storedVersion || parseInt(storedVersion) < PNP_RULE_DATA_VERSION)) {
        pnpRuleData = JSON.parse(JSON.stringify(initialPnpRuleData));
        localStorage.setItem('pnpRuleData', JSON.stringify(pnpRuleData));
        localStorage.setItem('pnpRuleDataVersion', PNP_RULE_DATA_VERSION.toString());
    } else if (stored) {
        pnpRuleData = JSON.parse(stored);
        if (pnpRuleData.length === 0 && initialPnpRuleData.length > 0) {
            pnpRuleData = JSON.parse(JSON.stringify(initialPnpRuleData));
            localStorage.setItem('pnpRuleData', JSON.stringify(pnpRuleData));
        }
    } else {
        pnpRuleData = JSON.parse(JSON.stringify(initialPnpRuleData));
        localStorage.setItem('pnpRuleDataVersion', PNP_RULE_DATA_VERSION.toString());
    }
} else {
    pnpRuleData = initialPnpRuleData;
}

if (typeof window !== 'undefined') {
    window.pnpRuleData = pnpRuleData;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = pnpRuleData;
}
