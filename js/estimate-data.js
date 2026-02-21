/**
 * Alpine Virtual Estimate Data
 * Full Dataset with Restored Speaker & Component Data
 * Updated: 2026-02-21 13:05
 */
const initialEstimateData = [
    // --- 현대자동차 (Hyundai) ---
    { brand: "현대자동차", model: "캐스퍼", year: "21~", code: "AX1", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8"], pnp: ["HK-103", "HK-1A", "DS-4B", "DS-8B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], tweeter: ["Status Tweeter Chamber"], front_baffle: ["현대/기아 6.5\" 배플", "커스텀 배플"], rear_door: ["DM-65", "S2-S65", "HDZ-65"], rear_baffle: ["현대/기아 6.5\" 배플", "커스텀 배플"], subwoofer: ["PEW-M770", "S2-W8D4(외장박스 포함)"], amp_4ch: ["R2-A60F"], player: ["HDS-990"], extraLabor: 0 },
    { brand: "현대자동차", model: "i30", year: "11~16", code: "GD", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-102", "DS-4B", "DS-8B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C"], front_baffle: ["현대/기아 6.5\" 배플"], rear_door: ["DM-65", "S2-S65"], extraLabor: 0 },
    { brand: "현대자동차", model: "아반떼", year: "20~", code: "CN7", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-103", "HK-1A", "DS-4B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], tweeter: ["Status Tweeter Chamber"], front_baffle: ["현대/기아 6.5\" 배플"], rear_door: ["DM-65", "S2-S65"], extraLabor: 0 },
    { brand: "현대자동차", model: "아반떼", year: "20~", code: "CN7", system: "6채널(BOSE)", dsp: ["PXE-R80-8", "PXE-R100-8", "PXE-X120-10DP"], pnp: ["HK-16A", "DS-8B", "DS-10B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], tweeter: ["Status Tweeter Chamber"], front_baffle: ["현대/기아 6.5\" 배플"], center: ["DPS-25M"], subwoofer: ["S2-W8D4(외장박스 포함)"], extraLabor: 0 },
    { brand: "현대자동차", model: "쏘나타", year: "19~23", code: "DN8", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-103", "HK-1A", "DS-4B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], front_baffle: ["현대/기아 6.5\" 배플"], extraLabor: 0 },
    { brand: "현대자동차", model: "쏘나타", year: "19~", code: "DN8", system: "10채널(프리미엄)", dsp: ["PXE-R100-8", "PXE-X120-10DP"], pnp: ["HK-12A", "DS-8B", "DS-10B"], front_door: ["DM-65C + DPS-25M", "S2-S65C + DSP-25M", "HDZ-65C + DPS-25M"], center: ["DPS-25M"], extraLabor: 0 },
    { brand: "현대자동차", model: "그랜저", year: "16~23", code: "IG", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-103", "HK-1A", "DS-4B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], front_baffle: ["현대/기아 6.5\" 배플"], tweeter: ["Status Tweeter Chamber"], extraLabor: 0 },
    { brand: "현대자동차", model: "그랜저", year: "16~23", code: "IG", system: "11채널(JBL)", dsp: ["PXE-R100-8", "PXE-X120-10DP"], pnp: ["HK-13A", "DS-8B", "DS-10B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], tweeter: ["Status Tweeter Chamber"], front_baffle: ["현대/기아 6.5\" 배플"], center: ["DPS-25M"], surround: ["DPS-25M"], extraLabor: 0 },
    { brand: "현대자동차", model: "그랜저", year: "22~", code: "GN7", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-106", "HK-2A", "DS-4B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], front_baffle: ["현대/기아 6.5\" 배플"], extraLabor: 500000 },
    { brand: "현대자동차", model: "그랜저", year: "22~", code: "GN7", system: "10채널(BOSE)", dsp: ["PXE-R100-8", "PXE-X120-10DP"], pnp: ["HK-107", "HK-12A", "DS-8B", "DS-10B"], front_door: ["DM-65C + DPS-25M", "S2-S65C + DSP-25M", "HDZ-65C + DPS-25M"], center: ["DPS-25M"], extraLabor: 500000 },
    { brand: "현대자동차", model: "싼타페", year: "23~", code: "MX5", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-104", "HK-2A", "DS-4B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], tweeter: ["Status Tweeter Chamber"], front_baffle: ["현대/기아 6.5\" 배플"], extraLabor: 500000 },
    { brand: "현대자동차", model: "싼타페", year: "23~", code: "MX5", system: "10채널(BOSE)", dsp: ["PXE-R100-8", "PXE-X120-10DP"], pnp: ["HK-12A", "DS-8B", "DS-10B"], front_door: ["DM-65C + DPS-25M", "S2-S65C + DSP-25M", "HDZ-65C + DPS-25M"], center: ["DPS-25M"], extraLabor: 500000 },
    { brand: "현대자동차", model: "팰리세이드", year: "18~24", code: "LX2", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C"], extraLabor: 200000 },
    { brand: "현대자동차", model: "팰리세이드", year: "25~", code: "LX3", system: "6채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-104", "HK-2A", "DS-4B", "DS-8B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], surround: ["DPS-25M"], extraLabor: 500000 },

    // --- 제네시스 (Genesis) ---
    { brand: "제네시스", model: "G70", year: "18~", code: "IK", system: "7채널(모비스)", dsp: ["PXE-R80-8", "PXE-R100-8"], pnp: ["GE-2A", "DS-8B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], tweeter: ["Status Tweeter Chamber"], front_baffle: ["현대/기아 6.5\" 배플"], extraLabor: 500000 },
    { brand: "제네시스", model: "G80", year: "16~20", code: "DH", system: "7채널(액튠)", dsp: ["PXE-R80-8", "PXE-R100-8"], pnp: ["GE-7A", "DS-8B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], tweeter: ["Status Tweeter Chamber"], front_baffle: ["현대/기아 6.5\" 배플"], extraLabor: 500000 },
    { brand: "제네시스", model: "G80", year: "16~20", code: "DH", system: "12채널(JBL)", dsp: ["PXE-R100-8", "PXE-X120-10DP"], pnp: ["GE-8A", "DS-8B", "DS-10B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], tweeter: ["Status Tweeter Chamber"], front_baffle: ["현대/기아 6.5\" 배플"], center: ["DPS-25M"], extraLabor: 800000 },
    { brand: "제네시스", model: "G80", year: "20~24", code: "RG3", system: "7채널(액튠)", dsp: ["PXE-R80-8", "PXE-R100-8"], pnp: ["GE-203", "GE-2A", "DS-8B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], tweeter: ["Status Tweeter Chamber"], front_baffle: ["현대/기아 6.5\" 배플"], extraLabor: 500000 },
    { brand: "제네시스", model: "G80", year: "20~", code: "RG3", system: "14채널(렉시콘,B&O)", dsp: ["PXE-R100-8", "PXE-X121-12EV"], pnp: ["GE-6A", "DS-8B", "DS-12B"], front_door: ["DP2-653", "R2-S653", "HDZ-653S"], center: ["DPS-25M"], extraLabor: 1000000 },
    { brand: "제네시스", model: "GV70", year: "21~24", code: "JK1", system: "9채널(모비스 프리미엄)", dsp: ["PXE-R80-8", "PXE-R100-8"], pnp: ["GE-3A", "DS-8B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], extraLabor: 500000 },
    { brand: "제네시스", model: "GV80", year: "20~", code: "JX1", system: "14채널(렉시콘,B&O)", dsp: ["PXE-R100-8", "PXE-X121-12EV"], pnp: ["GE-6A", "DS-12B"], front_door: ["DP2-653", "R2-S653", "HDZ-653S"], center: ["DPS-25M"], extraLabor: 1000000 },

    // --- 기아자동차 (Kia) ---
    { brand: "기아자동차", model: "K5", year: "19~24", code: "DL3", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-103", "HK-1A", "DS-4B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], front_baffle: ["현대/기아 6.5\" 배플"], extraLabor: 0 },
    { brand: "기아자동차", model: "K8", year: "21~", code: "GL3", system: "11채널(메리디안)", dsp: ["PXE-R100-8", "PXE-X120-10DP"], pnp: ["HK-21A", "DS-8B", "DS-10B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], tweeter: ["Status Tweeter Chamber"], center: ["DPS-25M"], extraLabor: 800000 },
    { brand: "기아자동차", model: "쏘렌토", year: "24~", code: "MQ4", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-104", "HK-2A", "DS-4B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C"], front_baffle: ["현대/기아 6.5\" 배플"], extraLabor: 0 },
    { brand: "기아자동차", model: "카니발", year: "24~", code: "KA4", system: "6채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-104", "HK-2A", "DS-4B", "DS-8B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], front_baffle: ["현대/기아 6.5\" 배플"], extraLabor: 500000 },

    // --- 외산차 (Imported) ---
    { brand: "BENZ", model: "E-클래스 / CLS", year: "16~21", code: "W213 / C257", system: "10채널(Burmeater)", dsp: ["PXE-R100-8", "PXE-X120-10DP"], pnp: ["BZ-6A", "DS-8B", "DS-10B"], front_door: ["DP2-65C", "HDZ-65C"], front_baffle: ["벤츠 전용 배플"], subwoofer: ["S2-W8D4(외장박스 포함)"], extraLabor: 1000000 },
    { brand: "BMW", model: "5 / 6 / 7 / X5 / X6 / X7", year: "20~23", code: "ID7", system: "7채널(신형 Hi-Fi)", dsp: ["PXE-R100-8", "PXE-X120-10DP"], pnp: ["BM-401", "BM-1A", "DS-8B", "DS-10B"], front_door: ["DP2-65C", "HDZ-65C"], tweeter: ["Status Tweeter Chamber"], front_baffle: ["BMW 전용 배플"], extraLabor: 1000000 },
    { brand: "Tesla", model: "Model 3 / Model Y", year: "22~", code: "M3 / MY", system: "13채널(롱레인지)", dsp: ["PXE-X121-12EV"], pnp: ["TS-304", "DS-12B"], front_door: ["DP2-65CF"], center: ["EV-40M-T"], surround: ["EV-40MR-T"], subwoofer: ["EV-100SW"], player: ["HDS-990"], extraLabor: 1000000 }
];

const ESTIMATE_DATA_VERSION = 20260221130500;

let estimateData = [];
if (typeof localStorage !== 'undefined') {
    const storedVersion = localStorage.getItem('estimateDataVersion');
    if (!storedVersion || parseInt(storedVersion) < ESTIMATE_DATA_VERSION) {
        estimateData = JSON.parse(JSON.stringify(initialEstimateData));
        localStorage.setItem('estimateData', JSON.stringify(estimateData));
        localStorage.setItem('estimateDataVersion', ESTIMATE_DATA_VERSION.toString());
        localStorage.setItem('estimate_sync_pending', 'true');
    } else {
        const stored = localStorage.getItem('estimateData');
        estimateData = stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(initialEstimateData));
    }
} else {
    estimateData = initialEstimateData;
}

if (typeof window !== 'undefined') {
    window.estimateData = estimateData;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = estimateData;
}
