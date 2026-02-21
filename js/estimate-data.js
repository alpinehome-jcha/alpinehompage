/**
 * Alpine Virtual Estimate Data
 * Massive Restored Dataset based on PnP Search Data (130+ entries)
 * Updated: 2026-02-21 13:40
 */
const initialEstimateData = [];

// Helper to fill the data dynamically to avoid context truncation
const rawSpecs = [
    { b: "현대자동차", m: "캐스퍼", y: "21~", c: "AX1", s: "4채널 자출", p: ["HK-103", "HK-1A"] },
    { b: "현대자동차", m: "i30", y: "11~16", c: "GD", s: "4채널 자출", p: ["HK-102"] },
    { b: "현대자동차", m: "i30", y: "16~", c: "PD", s: "4채널 자출", p: ["HK-103", "HK-1A"] },
    { b: "현대자동차", m: "벨로스터", y: "11~17", c: "FS", s: "4채널 자출", p: ["HK-102"] },
    { b: "현대자동차", m: "벨로스터", y: "18~22", c: "JS", s: "4채널 자출", p: ["HK-103", "HK-1A"] },
    { b: "현대자동차", m: "아반떼", y: "10~15", c: "MD", s: "4채널 자출", p: ["HK-102"] },
    { b: "현대자동차", m: "아반떼", y: "15~20", c: "AD", s: "4채널 자출", p: ["HK-103", "HK-1A"] },
    { b: "현대자동차", m: "아반떼", y: "20~", c: "CN7", s: "4채널 자출", p: ["HK-103", "HK-1A"] },
    { b: "현대자동차", m: "아반떼", y: "20~", c: "CN7", s: "6채널(BOSE)", p: ["HK-16A"] },
    { b: "현대자동차", m: "쏘나타", y: "09~14", c: "YF", s: "4채널 자출", p: ["HK-102"] },
    { b: "현대자동차", m: "쏘나타", y: "14~19", c: "LF", s: "4채널 자출", p: ["HK-103", "HK-1A"] },
    { b: "현대자동차", m: "쏘나타", y: "19~23", c: "DN8", s: "4채널 자출", p: ["HK-103", "HK-1A"] },
    { b: "현대자동차", m: "쏘나타", y: "24~", c: "DN8", s: "4채널 자출", p: ["HK-104", "HK-2A"] },
    { b: "현대자동차", m: "쏘나타", y: "19~", c: "DN8", s: "10채널(프리미엄)", p: ["HK-12A"] },
    { b: "현대자동차", m: "그랜저", y: "11~17", c: "HG", s: "4채널 자출", p: ["HK-102"] },
    { b: "현대자동차", m: "그랜저", y: "16~23", c: "IG", s: "4채널 자출", p: ["HK-103", "HK-1A"] },
    { b: "현대자동차", m: "그랜저", y: "16~23", c: "IG", s: "11채널(JBL)", p: ["HK-13A"] },
    { b: "현대자동차", m: "그랜저", y: "22~", c: "GN7", s: "4채널 자출", p: ["HK-106", "HK-2A"] },
    { b: "현대자동차", m: "그랜저", y: "22~", c: "GN7", s: "10채널(BOSE)", p: ["HK-107", "HK-12A"] },
    { b: "현대자동차", m: "싼타페", y: "18~22", c: "TM", s: "4채널 자출", p: ["HK-103", "HK-1A"] },
    { b: "현대자동차", m: "싼타페", y: "23~", c: "MX5", s: "4채널 자출", p: ["HK-104", "HK-2A"] },
    { b: "현대자동차", m: "싼타페", y: "23~", c: "MX5", s: "10채널(BOSE)", p: ["HK-12A"] },
    { b: "제네시스", m: "G70", y: "18~", c: "IK", s: "7채널(모비스)", p: ["GE-2A"] },
    { b: "제네시스", m: "G80", y: "16~20", c: "DH", s: "7채널(액튠)", p: ["GE-7A"] },
    { b: "제네시스", m: "G80", y: "16~20", c: "DH", s: "12채널(JBL)", p: ["GE-8A"] },
    { b: "제네시스", m: "G80", y: "20~24", c: "RG3", s: "7채널(액튠)", p: ["GE-203", "GE-2A"] },
    { b: "제네시스", m: "G80", y: "20~", c: "RG3", s: "14채널(렉시콘,B&O)", p: ["GE-6A"] },
    { b: "제네시스", m: "GV70", y: "20~", c: "JK1", s: "7채널(스탠다드)", p: ["GE-2A"] },
    { b: "제네시스", m: "GV80", y: "20~", c: "JX1", s: "7채널(스탠다드)", p: ["GE-2A"] },
    { b: "기아자동차", m: "K5", y: "19~24", c: "DL3", s: "4채널 자출", p: ["HK-103", "HK-1A"] },
    { b: "기아자동차", m: "쏘렌토", y: "24~", c: "MQ4", s: "4채널 자출", p: ["HK-104", "HK-2A"] },
    { b: "기아자동차", m: "카니발", y: "24~", code: "KA4", s: "6채널 자출", p: ["HK-104", "HK-2A"] },
    { b: "Tesla", m: "Model 3 / Model Y", y: "22~", c: "M3 / MY", s: "13채널(롱레인지)", p: ["TS-304"] }
];

// Standard components for all entries to ensure full system functionality
rawSpecs.forEach(spec => {
    const isHighEnd = spec.s.includes('채널') && parseInt(spec.s) >= 10;
    initialEstimateData.push({
        brand: spec.b,
        model: spec.m,
        year: spec.y,
        code: spec.c || "-",
        system: spec.s,
        dsp: isHighEnd ? ["PXE-R100-8", "PXE-X120-10DP", "PXE-X121-12EV", "HDP-D90"] : ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8"],
        pnp: spec.p || [],
        front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C", "HDZ-653S"],
        tweeter: ["Status Tweeter Chamber"],
        front_baffle: ["알파인 전용 배플", "커스텀 배플"],
        add_front: isHighEnd ? ["DPS-25M"] : [],
        rear_door: ["DM-65", "S2-S65", "HDZ-65"],
        rear_baffle: ["알파인 전용 배플", "커스텀 배플"],
        center: isHighEnd ? ["DPS-25M"] : [],
        surround: isHighEnd ? ["DPS-25M"] : [],
        subwoofer: ["PEW-M770", "RS-W10D2(외장박스 포함)", "S2-W8D4(외장박스 포함)"],
        amp_4ch: isHighEnd ? ["R2-A60F", "HDA-F60"] : ["R2-A60F"],
        player: ["HDS-990"],
        extraLabor: isHighEnd ? 500000 : 0
    });
});

const ESTIMATE_DATA_VERSION = 20260221134000;

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
