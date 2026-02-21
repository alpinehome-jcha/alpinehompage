/**
 * Alpine Virtual Estimate Data
 * Massive Restored Dataset based on PnP Search Data
 * Fixed: PWE-M770, Baffle Names
 * Updated: 2026-02-21 14:00
 */
const initialEstimateData = [
    { brand: "현대자동차", model: "캐스퍼", year: "21~", code: "AX1", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-103", "HK-1A"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], tweeter: ["Status Tweeter Chamber"], front_baffle: ["현대/기아 6.5\" 배플", "커스텀 배플"], rear_door: ["DM-65", "S2-S65"], rear_baffle: ["현대/기아 6.5\" 배플", "커스텀 배플"], subwoofer: ["PWE-M770", "S2-W8D4(외장박스 포함)"], amp_4ch: ["R2-A60F"], amp_sub: ["S2-A60M"], player: ["HDS-990"], extraLabor: 0 },
    { brand: "현대자동차", model: "아반떼", year: "20~", code: "CN7", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-103", "HK-1A"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], tweeter: ["Status Tweeter Chamber"], front_baffle: ["현대/기아 6.5\" 배플", "커스텀 배플"], rear_door: ["DM-65", "S2-S65"], rear_baffle: ["현대/기아 6.5\" 배플", "커스텀 배플"], subwoofer: ["PWE-M770", "S2-W8D4(외장박스 포함)"], amp_4ch: ["R2-A60F"], amp_sub: ["S2-A60M"], extraLabor: 0 },
    { brand: "현대자동차", model: "그랜저", year: "16~23", code: "IG", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-103", "HK-1A"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], tweeter: ["Status Tweeter Chamber"], front_baffle: ["현대/기아 6.5\" 배플", "커스텀 배플"], rear_door: ["DM-65", "S2-S65"], rear_baffle: ["현대/기아 6.5\" 배플", "커스텀 배플"], subwoofer: ["PWE-M770", "S2-W8D4(외장박스 포함)"], extraLabor: 0 },
    { brand: "현대자동차", model: "그랜저", year: "16~23", code: "IG", system: "11채널(JBL)", dsp: ["PXE-R100-8", "PXE-X120-10DP"], pnp: ["HK-13A"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], tweeter: ["Status Tweeter Chamber"], front_baffle: ["현대/기아 6.5\" 배플", "커스텀 배플"], center: ["DPS-25M"], surround: ["DPS-25M"], subwoofer: ["PWE-M770", "S2-W10D2(외장박스 포함)"], extraLabor: 800000 },
    { brand: "제네시스", model: "G80", year: "16~20", code: "DH", system: "7채널(액튠)", dsp: ["PXE-R80-8", "PXE-R100-8"], pnp: ["GE-7A"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], tweeter: ["Status Tweeter Chamber"], front_baffle: ["현대/기아 6.5\" 배플", "커스텀 배플"], subwoofer: ["PWE-M770", "RS-W10D2(외장박스 포함)"], extraLabor: 500000 },
    { brand: "제네시스", model: "G80", year: "20~", code: "RG3", system: "14채널(렉시콘,B&O)", dsp: ["PXE-R100-8", "PXE-X121-12EV"], pnp: ["GE-6A"], front_door: ["HDZ-653S", "DP2-653", "R2-S653"], front_baffle: ["현대/기아 6.5\" 배플", "커스텀 배플"], center: ["DPS-25M"], subwoofer: ["PWE-M770", "S2-W12D4"], extraLabor: 1000000 }
    // ... (More data will be added by sub-agents or through admin tool)
];

// Combine with full search data patterns
if (typeof pnpSearchData !== 'undefined') {
    pnpSearchData.forEach(man => {
        man.models.forEach(mod => {
            mod.details.forEach(det => {
                const exists = initialEstimateData.find(e => e.brand === man.manufacturer && e.model === mod.model && e.code === det.code && e.system === det.sound);
                if (!exists) {
                    const isHighEnd = det.sound.includes('채널') && parseInt(det.sound) >= 10;
                    initialEstimateData.push({
                        brand: man.manufacturer,
                        model: mod.model,
                        year: det.year,
                        code: det.code || "-",
                        system: det.sound,
                        dsp: isHighEnd ? ["PXE-R100-8", "PXE-X120-10DP", "PXE-X121-12EV", "HDP-D90"] : ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8"],
                        pnp: [det.integrated, det.typeA].filter(p => p && p !== "X"),
                        front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C", "HDZ-653S"],
                        tweeter: ["Status Tweeter Chamber"],
                        front_baffle: ["현대/기아 6.5\" 배플", "커스텀 배플"],
                        add_front: isHighEnd ? ["DPS-25M"] : [],
                        rear_door: ["DM-65", "S2-S65", "HDZ-65"],
                        rear_baffle: ["현대/기아 6.5\" 배플", "커스텀 배플"],
                        center: isHighEnd ? ["DPS-25M"] : [],
                        surround: isHighEnd ? ["DPS-25M"] : [],
                        subwoofer: ["PWE-M770", "S2-W8D4(외장박스 포함)", "S2-W10D2(외장박스 포함)"],
                        amp_4ch: ["R2-A60F"],
                        amp_sub: ["S2-A60M"],
                        player: ["HDS-990"],
                        extraLabor: isHighEnd ? 500000 : 0
                    });
                }
            });
        });
    });
}

const ESTIMATE_DATA_VERSION = 20260221140000;

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
