const initialPnpRuleData = [
    {
        "dsp": "PXE-M60-4",
        "integrated": [
            "HK-101",
            "HK-102",
            "HK-103",
            "HK-104",
            "HK-106"
        ],
        "typeB": [
            "DS-M60-2B",
            "DS-M60-4B"
        ]
    },
    {
        "dsp": "PXE-X120-10DP",
        "integrated": [
            "HK-107",
            "BM-401",
            "BM-402",
            "BM-403",
            "BZ-503"
        ],
        "typeB": [
            "DS-10DP-6B",
            "DS-10DP-8B"
        ]
    },
    {
        "dsp": "PXE-C80-88",
        "integrated": [
            "GE-203",
            "BZ-501",
            "BZ-502"
        ],
        "typeB": [
            "DS-C80-4B",
            "DS-C80-6B"
        ]
    },
    {
        "dsp": "PXE-X121-12EV",
        "integrated": [
            "TS-301",
            "TS-302",
            "TS-303",
            "TS-304"
        ],
        "typeB": [
            "DS-12EV-B"
        ]
    },
    {
        "dsp": "PXE-R80-8",
        "integrated": [],
        "typeB": [
            "DS-R80-4B",
            "DS-R80-6B"
        ]
    },
    {
        "dsp": "PXE-R100-8",
        "integrated": [],
        "typeB": [
            "DS-R80-4B",
            "DS-R80-6B"
        ]
    },
    {
        "dsp": "PXE-X120-8",
        "integrated": [],
        "typeB": [
            "DS-X12-4B",
            "DS-X12-6B"
        ]
    },
    {
        "dsp": "HDP-D90",
        "integrated": [],
        "typeB": [
            "DS-D90-B"
        ]
    }
];
const PNP_RULE_DATA_VERSION = 1772434801568;

let pnpRuleData = [];
if (typeof localStorage !== 'undefined') {
    const storedVersion = localStorage.getItem('pnpRuleDataVersion');
    const stored = localStorage.getItem('pnpRuleData');

    if (typeof PNP_RULE_DATA_VERSION !== 'undefined' && (!storedVersion || parseInt(storedVersion) < PNP_RULE_DATA_VERSION)) {
        // Server has newer version, force update
        pnpRuleData = JSON.parse(JSON.stringify(initialPnpRuleData));
        localStorage.setItem('pnpRuleData', JSON.stringify(pnpRuleData));
        localStorage.setItem('pnpRuleDataVersion', PNP_RULE_DATA_VERSION.toString());
    } else if (stored) {
        pnpRuleData = JSON.parse(stored);
        // Safety Check for empty data
        if (pnpRuleData.length === 0 && initialPnpRuleData.length > 0) {
             pnpRuleData = JSON.parse(JSON.stringify(initialPnpRuleData));
             localStorage.setItem('pnpRuleData', JSON.stringify(pnpRuleData));
             if (typeof PNP_RULE_DATA_VERSION !== 'undefined') localStorage.setItem('pnpRuleDataVersion', PNP_RULE_DATA_VERSION.toString());
        }
    } else {
        pnpRuleData = JSON.parse(JSON.stringify(initialPnpRuleData));
        if (typeof PNP_RULE_DATA_VERSION !== 'undefined') localStorage.setItem('pnpRuleDataVersion', PNP_RULE_DATA_VERSION.toString());
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