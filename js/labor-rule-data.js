const initialLaborRuleData = [
    {
        "category": "AMP",
        "name": "HDA-F90",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 30,
        "discountRatio": 0
    },
    {
        "category": "AMP",
        "name": "HDA-F60",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 30,
        "discountRatio": 0
    },
    {
        "category": "AMP",
        "name": "R2-A60F",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 30,
        "discountRatio": 0
    },
    {
        "category": "AMP",
        "name": "S2-A60M",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 30,
        "discountRatio": 0
    },
    {
        "category": "DSP",
        "name": "HDP-D90",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 30,
        "discountRatio": 40
    },
    {
        "category": "DSP",
        "name": "PXE-M60-4",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 30,
        "discountRatio": 40
    },
    {
        "category": "DSP",
        "name": "PXE-R80-8",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 30,
        "discountRatio": 40
    },
    {
        "category": "DSP",
        "name": "PXE-R100-8",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 30,
        "discountRatio": 40
    },
    {
        "category": "DSP",
        "name": "PXE-X120-8",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 30,
        "discountRatio": 40
    },
    {
        "category": "DSP",
        "name": "PXE-X120-10DP",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 30,
        "discountRatio": 40
    },
    {
        "category": "DSP",
        "name": "PXE-X121-12EV",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 30,
        "discountRatio": 40
    },
    {
        "category": "DSP",
        "name": "PXE-X121-12EV x 2",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 30,
        "discountRatio": 40
    },
    {
        "category": "DSP",
        "name": "PXE-C80-88",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 30,
        "discountRatio": 40
    },
    {
        "category": "ETC",
        "name": "KGM 5.5\" to 6.5\" 배플",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "ETC",
        "name": "RUX-C810",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "ETC",
        "name": "KTX-990",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "ETC",
        "name": "PWE-770-RCU",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "ETC",
        "name": "EV-65CF-Converter P",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "ETC",
        "name": "UTS-A100",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "ETC",
        "name": "DVR-DM1000KO-IC",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 10,
        "discountRatio": 0
    },
    {
        "category": "ETC",
        "name": "MS-165-KO-WH",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 20,
        "discountRatio": 0
    },
    {
        "category": "ETC",
        "name": "Status Tweeter Chamber",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "ETC",
        "name": "현대/기아 6.5\" 배플",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "ETC",
        "name": "Universal Speaker Wire(2P)",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "ETC",
        "name": "DPS-25M-Uni Baffle",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "ETC",
        "name": "Speaker Connector A",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "ETC",
        "name": "Speaker Connector B",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "ETC",
        "name": "Speaker Connector C",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "ETC",
        "name": "Speaker Connector D",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "ETC",
        "name": "Speaker Connector E",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "ETC",
        "name": "S2-W8D그릴 (KTE-8G.3)",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "ETC",
        "name": "S2-W10D그릴 (KTE-10G.3)",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "ETC",
        "name": "S2-W12D그릴 (KTE-12G.3)",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "ETC",
        "name": "Toyota 6.9\" 배플",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "Player",
        "name": "HDS-990",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 10,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "HK-101 / HK-102 / HK-103",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "HK-104",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "HK-106",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "HK-107",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "HK-1A",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "HK-2A",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "HK-12A / HK-13A / HK-15A / HK-16A",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "HK-14A / HK-19A / HK-20A / HK-21A / HK-23A /  HK-24A / HK-26A / HK-28A",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "GE-2A / GE-3A / GE-6A / GE-7A / GE-8A / GE-9A / GE-10A / GE-11A",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "BM-401",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "BM-402",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "BM-403",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "BM-1A",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "BM-2A",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "BZ-501",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "BZ-502",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "BZ-503",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "BZ-1A",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "BZ-2A",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "BZ-3A",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "BY-101",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "BY-2A",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "RR-1A",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "RR-2A",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "AU-1A",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "DS-M60-2B",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "DS-M60-4B",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "DS_R80-4B",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "DS-R80-6B",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "DS-X12-4B",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "DS-X12-6B",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "DS-C80-4B",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "DS-10DP-6B",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "DS-10DP-8B",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "DS-12EV-B",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "DS-D90-B",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "M60 3M 연장케이블",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "M60 유니버셜 젠더 (20P)",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "3.5M 연장 케이블",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "PXE-M770 External Cable(8M)",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "TS-301",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "TS-302",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "TS-303",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "TS-304",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "VW-1A",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "CH-1A",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "GE-203",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "KG-1A",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "DS-C80-6B",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "PnP",
        "name": "TY-1A",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "Speaker",
        "name": "HDZ-653",
        "desc": "",
        "basePrice": 200000,
        "percentPrice": 0,
        "discountRatio": 60
    },
    {
        "category": "Speaker",
        "name": "HDZ-653S",
        "desc": "",
        "basePrice": 200000,
        "percentPrice": 0,
        "discountRatio": 60
    },
    {
        "category": "Speaker",
        "name": "HDZ-65C",
        "desc": "",
        "basePrice": 200000,
        "percentPrice": 0,
        "discountRatio": 60
    },
    {
        "category": "Speaker",
        "name": "HDZ-65",
        "desc": "",
        "basePrice": 200000,
        "percentPrice": 0,
        "discountRatio": 60
    },
    {
        "category": "Speaker",
        "name": "R2-S653",
        "desc": "",
        "basePrice": 200000,
        "percentPrice": 0,
        "discountRatio": 60
    },
    {
        "category": "Speaker",
        "name": "DP2-653",
        "desc": "",
        "basePrice": 200000,
        "percentPrice": 0,
        "discountRatio": 60
    },
    {
        "category": "Speaker",
        "name": "DP2-653NW",
        "desc": "",
        "basePrice": 200000,
        "percentPrice": 0,
        "discountRatio": 60
    },
    {
        "category": "Speaker",
        "name": "DP2-65C",
        "desc": "",
        "basePrice": 200000,
        "percentPrice": 0,
        "discountRatio": 60
    },
    {
        "category": "Speaker",
        "name": "DP2-35M",
        "desc": "",
        "basePrice": 200000,
        "percentPrice": 0,
        "discountRatio": 60
    },
    {
        "category": "Speaker",
        "name": "S2-S65C",
        "desc": "",
        "basePrice": 200000,
        "percentPrice": 0,
        "discountRatio": 60
    },
    {
        "category": "Speaker",
        "name": "S2-S65",
        "desc": "",
        "basePrice": 200000,
        "percentPrice": 0,
        "discountRatio": 60
    },
    {
        "category": "Speaker",
        "name": "S2-S10TW",
        "desc": "",
        "basePrice": 200000,
        "percentPrice": 0,
        "discountRatio": 60
    },
    {
        "category": "Speaker",
        "name": "DM-65C",
        "desc": "",
        "basePrice": 200000,
        "percentPrice": 0,
        "discountRatio": 60
    },
    {
        "category": "Speaker",
        "name": "DM-65",
        "desc": "",
        "basePrice": 200000,
        "percentPrice": 0,
        "discountRatio": 60
    },
    {
        "category": "Speaker",
        "name": "DPS-25M",
        "desc": "",
        "basePrice": 200000,
        "percentPrice": 0,
        "discountRatio": 60
    },
    {
        "category": "Speaker",
        "name": "EV-65CF",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "Speaker",
        "name": "EV-40M-T",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "Speaker",
        "name": "EV-40MR-T",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "Speaker",
        "name": "DP2-45C-B",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "Speaker",
        "name": "DP2-45-B",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "Speaker",
        "name": "DP2-40C-B",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "Speaker",
        "name": "DP2-15TW-B",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "Speaker",
        "name": "RAV4 Lift Up Speaker",
        "desc": "",
        "basePrice": 200000,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "Subwoofer",
        "name": "HDZ-W10",
        "desc": "",
        "basePrice": 300000,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "Subwoofer",
        "name": "PWE-M770",
        "desc": "",
        "basePrice": 200000,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "Subwoofer",
        "name": "RS-W10D2",
        "desc": "",
        "basePrice": 200000,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "Subwoofer",
        "name": "S2-W12D2",
        "desc": "",
        "basePrice": 200000,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "Subwoofer",
        "name": "S2-W10D2",
        "desc": "",
        "basePrice": 200000,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "Subwoofer",
        "name": "S2-W8D4",
        "desc": "",
        "basePrice": 200000,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "Subwoofer",
        "name": "RS-W10D2 (외장박스 포함)",
        "desc": "",
        "basePrice": 150000,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "Subwoofer",
        "name": "S2-W12D2 (외장박스 포함)",
        "desc": "",
        "basePrice": 150000,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "Subwoofer",
        "name": "S2-W10D2 (외장박스 포함)",
        "desc": "",
        "basePrice": 150000,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "Subwoofer",
        "name": "S2-W8D4 (외장박스 포함)",
        "desc": "",
        "basePrice": 150000,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "Subwoofer",
        "name": "EV-100SW 3",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "Subwoofer",
        "name": "EV-100SW Y",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    },
    {
        "category": "Subwoofer",
        "name": "DP2-80WF-B",
        "desc": "",
        "basePrice": 0,
        "percentPrice": 0,
        "discountRatio": 0
    }
];
const LABOR_RULE_DATA_VERSION = 1775106425248;

let laborRuleData = [];
if (typeof localStorage !== 'undefined') {
    const storedVersion = localStorage.getItem('laborRuleDataVersion');
    const stored = localStorage.getItem('laborRuleData');

    if (typeof LABOR_RULE_DATA_VERSION !== 'undefined' && (!storedVersion || parseInt(storedVersion) < LABOR_RULE_DATA_VERSION)) {
        // Server has newer version, force update
        laborRuleData = JSON.parse(JSON.stringify(initialLaborRuleData));
        localStorage.setItem('laborRuleData', JSON.stringify(laborRuleData));
        localStorage.setItem('laborRuleDataVersion', LABOR_RULE_DATA_VERSION.toString());
    } else if (stored) {
        laborRuleData = JSON.parse(stored);
        // Safety Check for empty data
        if (laborRuleData.length === 0 && initialLaborRuleData.length > 0) {
             laborRuleData = JSON.parse(JSON.stringify(initialLaborRuleData));
             localStorage.setItem('laborRuleData', JSON.stringify(laborRuleData));
             if (typeof LABOR_RULE_DATA_VERSION !== 'undefined') localStorage.setItem('laborRuleDataVersion', LABOR_RULE_DATA_VERSION.toString());
        }
    } else {
        laborRuleData = JSON.parse(JSON.stringify(initialLaborRuleData));
        if (typeof LABOR_RULE_DATA_VERSION !== 'undefined') localStorage.setItem('laborRuleDataVersion', LABOR_RULE_DATA_VERSION.toString());
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