/**
 * Alpine Virtual Estimate Data
 * Full Dataset based on provided Excel sheet & PnP Search Data (80+ models)
 * Updated: 2026-02-21
 */
const initialEstimateData = [
    // 현대자동차 (Hyundai)
    { brand: "현대자동차", model: "캐스퍼", year: "21~", code: "AX1", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-103", "HK-1A", "DS-4B", "DS-8B", "DS-81B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], tweeter: ["Status Tweeter Chamber"], front_baffle: ["현대/기아 6.5\" 배플", "커스텀 배플"], rear_door: ["DM-65", "S2-S65", "HDZ-65"], rear_baffle: ["현대/기아 6.5\" 배플", "커스텀 배플"], subwoofer: ["PEW-M770", "S2-W8D4(외장박스 포함)", "S2-W10D2(외장박스 포함)", "S2-W12D2(외장박스 포함)", "RS-W10D2(외장박스 포함)"], amp_4ch: ["R2-A60F", "HDA-F60"], amp_sub: ["S2-A60M", "HDA-F60"], player: ["HDS-990"], extraLabor: 0 },
    { brand: "현대자동차", model: "i30", year: "11~16", code: "GD", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-102", "DS-4B", "DS-8B", "DS-81B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], tweeter: ["Status Tweeter Chamber"], front_baffle: ["현대/기아 6.5\" 배플", "커스텀 배플"], rear_door: ["DM-65", "S2-S65", "HDZ-65"], rear_baffle: ["현대/기아 6.5\" 배플", "커스텀 배플"], subwoofer: ["PEW-M770", "RS-W10D2(외장박스 포함)"], amp_4ch: ["R2-A60F"], amp_sub: ["S2-A60M"], player: ["HDS-990"], extraLabor: 0 },
    { brand: "현대자동차", model: "i30", year: "16~", code: "PD", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-103", "HK-1A", "DS-4B", "DS-8B", "DS-81B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], tweeter: ["Status Tweeter Chamber"], front_baffle: ["현대/기아 6.5\" 배플", "커스텀 배플"], rear_door: ["DM-65", "S2-S65", "HDZ-65"], rear_baffle: ["현대/기아 6.5\" 배플", "커스텀 배플"], subwoofer: ["PEW-M770", "RS-W10D2(외장박스 포함)"], player: ["HDS-990"], extraLabor: 0 },
    { brand: "현대자동차", model: "벨로스터", year: "11~17", code: "FS", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-102", "DS-4B", "DS-8B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], front_baffle: ["현대/기아 6.5\" 배플"], rear_door: ["DM-65", "S2-S65"], extraLabor: 0 },
    { brand: "현대자동차", model: "벨로스터", year: "18~22", code: "JS", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-103", "HK-1A", "DS-4B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C"], front_baffle: ["현대/기아 6.5\" 배플"], rear_door: ["DM-65", "S2-S65"], extraLabor: 0 },
    { brand: "현대자동차", model: "아반떼", year: "10~15", code: "MD", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-102", "DS-4B", "DS-8B", "DS-81B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], front_baffle: ["현대/기아 6.5\" 배플"], rear_door: ["DM-65", "S2-S65"], extraLabor: 0 },
    { brand: "현대자동차", model: "아반떼", year: "15~20", code: "AD", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-103", "HK-1A", "DS-4B", "DS-8B", "DS-81B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], front_baffle: ["현대/기아 6.5\" 배플"], rear_door: ["DM-65", "S2-S65"], extraLabor: 0 },
    { brand: "현대자동차", model: "아반떼", year: "20~", code: "CN7", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-103", "HK-1A", "DS-4B", "DS-8B", "DS-81B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], front_baffle: ["현대/기아 6.5\" 배플"], rear_door: ["DM-65", "S2-S65"], extraLabor: 0 },
    { brand: "현대자동차", model: "아반떼", year: "20~", code: "CN7", system: "6채널(BOSE)", dsp: ["PXE-R80-8", "PXE-R100-8", "PXE-X120-8", "PXE-X120-10DP", "PXE-X121-12EV"], pnp: ["HK-16A", "DS-8B", "DS-81B", "DS-10B", "DS-12B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], tweeter: ["Status Tweeter Chamber"], front_baffle: ["현대/기아 6.5\" 배플", "커스텀 배플"], rear_door: ["DM-65", "S2-S65", "HDZ-65"], rear_baffle: ["현대/기아 6.5\" 배플", "커스텀 배플"], subwoofer: ["S2-W8D4(외장박스 포함)", "S2-W10D2(외장박스 포함)", "S2-W12D2(외장박스 포함)"], amp_4ch: ["R2-A60F", "HDA-F60"], amp_sub: ["S2-A60M", "HDA-F60"], player: ["HDS-990"], extraLabor: 0 },
    { brand: "현대자동차", model: "아이오닉", year: "16~21", code: "AE", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-103", "HK-1A", "DS-4B", "DS-8B", "DS-81B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], front_baffle: ["현대/기아 6.5\" 배플"], rear_door: ["DM-65", "S2-S65"], extraLabor: 0 },
    { brand: "현대자동차", model: "i40", year: "11~19", code: "VF", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-102", "DS-4B", "DS-8B", "DS-81B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], front_baffle: ["현대/기아 6.5\" 배플"], extraLabor: 0 },
    { brand: "현대자동차", model: "쏘나타", year: "09~14", code: "YF", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-102", "DS-4B", "DS-8B", "DS-81B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], front_baffle: ["현대/기아 6.5\" 배플"], rear_door: ["DM-65", "S2-S65"], extraLabor: 0 },
    { brand: "현대자동차", model: "쏘나타", year: "14~19", code: "LF", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-103", "HK-1A", "DS-4B", "DS-8B", "DS-81B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], extraLabor: 0 },
    { brand: "현대자동차", model: "쏘나타", year: "19~23", code: "DN8", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-103", "HK-1A", "DS-4B", "DS-8B", "DS-81B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], extraLabor: 0 },
    { brand: "현대자동차", model: "쏘나타", year: "24~", code: "DN8", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-104", "HK-2A", "DS-4B", "DS-8B", "DS-81B"], extraLabor: 0 },
    { brand: "현대자동차", model: "쏘나타", year: "19~", code: "DN8", system: "10채널(프리미엄)", dsp: ["PXE-R100-8", "PXE-X120-8", "PXE-X120-10DP", "PXE-X121-12EV", "HDP-D90"], pnp: ["HK-12A", "DS-8B", "DS-81B", "DS-10B", "DS-12B", "DS-14B"], front_door: ["DM-65C + DPS-25M", "S2-S65C + DSP-25M", "DP2-65C + DPS-25M", "HDZ-65C + DPS-25M"], tweeter: ["Status Tweeter Chamber"], front_baffle: ["현대/기아 6.5\" 배플", "커스텀 배플"], rear_door: ["DM-65C", "S2-S65C", "DP2-65C"], center: ["DPS-25M"], extraLabor: 0 },
    { brand: "현대자동차", model: "아이오닉5", year: "22~24", code: "NE EV", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-103", "HK-1A", "DS-4B", "DS-8B", "DS-81B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], extraLabor: 0 },
    { brand: "현대자동차", model: "아이오닉5", year: "25~", code: "NE EV", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-104", "HK-2A", "DS-4B", "DS-8B", "DS-81B"], extraLabor: 0 },
    { brand: "현대자동차", model: "아이오닉5", year: "22~", code: "NE EV", system: "6채널 ", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-16A", "DS-4B", "DS-8B", "DS-81B"], extraLabor: 0 },
    { brand: "현대자동차", model: "아이오닉6", year: "22~25", code: "CE", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-103", "HK-1A", "DS-4B", "DS-8B", "DS-81B"], extraLabor: 0 },
    { brand: "현대자동차", model: "아이오닉6", year: "26~", code: "CE", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-104", "HK-2A", "DS-4B", "DS-8B", "DS-81B"], extraLabor: 0 },
    { brand: "현대자동차", model: "그랜저", year: "11~17", code: "HG", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-102", "DS-4B", "DS-8B"], extraLabor: 0 },
    { brand: "현대자동차", model: "그랜저", year: "16~23", code: "IG", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-10", "PXE-X120-10"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "현대자동차", model: "그랜저", year: "16~23", code: "IG", system: "11채널(JBL)", dsp: ["PXE-R100-8", "PXE-X120-8", "PXE-X120-10DP", "PXE-X121-12EV", "HDP-D90"], pnp: ["HK-13A", "DS-8B", "DS-81B", "DS-10B", "DS-12B", "DS-14B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], tweeter: ["Status Tweeter Chamber"], add_front: ["DPS-25M"], front_baffle: ["현대/기아 6.5\" 배플", "커스텀 배플"], rear_door: ["DM-65C", "S2-S65C", "DP2-65C"], center: ["DPS-25M"], surround: ["DPS-25M"], extraLabor: 0 },
    { brand: "현대자동차", model: "그랜저", year: "22~", code: "GN7", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-106", "HK-2A", "DS-4B", "DS-8B", "DS-81B"], extraLabor: 500000 },
    { brand: "현대자동차", model: "그랜저", year: "22~", code: "GN7", system: "10채널(BOSE)", dsp: ["PXE-R100-8", "PXE-X120-8", "PXE-X120-10DP", "PXE-X121-12EV", "HDP-D90"], pnp: ["HK-107", "HK-12A", "DS-8B", "DS-81B", "DS-10B", "DS-12B", "DS-14B"], front_door: ["DM-65C + DPS-25M", "S2-S65C + DSP-25M", "DP2-65C + DPS-25M", "HDZ-65C + DPS-25M"], extraLabor: 500000 },
    { brand: "현대자동차", model: "코나", year: "17~23", code: "OS", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "현대자동차", model: "코나", year: "23~", code: "SX2", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-104", "HK-2A", "DS-4B"], extraLabor: 0 },
    { brand: "현대자동차", model: "투싼", year: "15~21", code: "TL", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "현대자동차", model: "투싼", year: "20~23", code: "NX4", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "현대자동차", model: "투싼", year: "24~", code: "NX4", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-104", "HK-2A", "DS-4B"], extraLabor: 0 },
    { brand: "현대자동차", model: "싼타페", year: "18~22", code: "TM", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "현대자동차", model: "싼타페", year: "23~", code: "MX5", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-104", "HK-2A", "DS-4B", "DS-8B", "DS-81B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], extraLabor: 500000 },
    { brand: "현대자동차", model: "싼타페", year: "23~", code: "MX5", system: "10채널(BOSE)", dsp: ["PXE-R100-8", "PXE-X120-8", "PXE-X120-10DP", "PXE-X121-12EV", "HDP-D90"], pnp: ["HK-12A", "DS-8B", "DS-81B", "DS-10B", "DS-12B", "DS-14B"], front_door: ["DM-65C + DPS-25M", "S2-S65C + DSP-25M", "DP2-65C + DPS-25M", "HDZ-65C + DPS-25M"], extraLabor: 500000 },
    { brand: "현대자동차", model: "팰리세이드", year: "18~24", code: "LX2", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 500000 },
    { brand: "현대자동차", model: "팰리세이드", year: "25~", code: "LX3", system: "6채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-104", "HK-2A", "DS-4B", "DS-8B", "DS-81B"], front_door: ["DM-65C", "S2-S65C", "DP2-65C", "HDZ-65C"], surround: ["DPS-25M"], extraLabor: 500000 },

    // 제네시스 (Genesis)
    { brand: "제네시스", model: "G70", year: "18~", code: "IK", system: "7채널(모비스)", dsp: ["PXE-R80-8", "PXE-R100-8", "PXE-X120-8", "PXE-X120-10DP", "PXE-X121-12EV"], pnp: ["GE-2A", "DS-8B", "DS-8B", "DS-81B", "DS-10B", "DS-12B"], extraLabor: 500000 },
    { brand: "제네시스", model: "G80", year: "16~20", code: "DH", system: "7채널(액튠)", dsp: ["PXE-R80-8", "PXE-R100-8"], pnp: ["GE-7A", "DS-8B"], extraLabor: 500000 },
    { brand: "제네시스", model: "G80", year: "20~", code: "RG3", system: "14채널(렉시콘,B&O)", dsp: ["PXE-R100-8", "PXE-X120-8", "PXE-X120-10DP", "PXE-X121-12EV", "HDP-D90"], pnp: ["GE-6A", "DS-8B", "DS-81B", "DS-10B", "DS-12B", "DS-14B"], front_door: ["DM-65C + DPS-25M", "S2-S65C + DSP-25M", "DP2-653", "R2-S653", "HDZ-653S"], extraLabor: 1000000 },
    { brand: "제네시스", model: "G90", year: "21~", code: "RS4", system: "14채널(High)", dsp: ["PXE-R100-8", "PXE-X120-8", "PXE-X120-10DP", "PXE-X121-12EV", "HDP-D90"], pnp: ["GE-10A", "DS-8B", "DS-81B", "DS-10B", "DS-12B", "DS-14B"], extraLabor: 1500000 },
    { brand: "제네시스", model: "GV60", year: "21~", code: "JW1 EV", system: "14채널(B&O)", dsp: ["PXE-R100-8", "PXE-X120-8", "PXE-X120-10DP", "PXE-X121-12EV", "HDP-D90"], pnp: ["GE-6A", "DS-8B", "DS-81B", "DS-10B", "DS-12B", "DS-14B"], extraLabor: 500000 },
    { brand: "제네시스", model: "GV80", year: "20~", code: "JX1", system: "14채널(프리미엄)", dsp: ["PXE-R100-8", "PXE-X120-8", "PXE-X120-10DP", "PXE-X121-12EV", "HDP-D90"], pnp: ["GE-6A", "DS-8B", "DS-81B", "DS-10B", "DS-12B", "DS-14B"], extraLabor: 1500000 },

    // 기아자동차 (Kia)
    { brand: "기아자동차", model: "모닝", year: "17~", code: "JA", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "K3", year: "18~24", code: "BD", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "K5", year: "19~24", code: "DL3", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "K5", year: "25~", code: "DL3", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-104", "HK-2A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "K8", year: "21~", code: "GL3", system: "11채널(메리디안)", dsp: ["PXE-R100-8", "PXE-X120-8", "PXE-X120-10DP", "PXE-X121-12EV", "HDP-D90"], pnp: ["HK-21A", "DS-8B", "DS-81B", "DS-10B", "DS-12B", "DS-14B"], extraLabor: 500000 },
    { brand: "기아자동차", model: "EV6", year: "21~24", code: "CV", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "EV9", year: "23~", code: "MV1", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-104", "HK-2A", "DS-4B"], extraLabor: 500000 },
    { brand: "기아자동차", model: "스포티지", year: "21~24", code: "NQ5", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "쏘렌토", year: "21~23", code: "MQ4", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "카니발", year: "24~", code: "KA4", system: "6채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-104", "HK-2A", "DS-4B", "DS-8B", "DS-8B", "DS-81B"], extraLabor: 500000 },

    // 외산차 (Imported)
    { brand: "BENZ", model: "Stereo 4채널 차량", year: "-", code: "-", system: "4채널", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["BZ-1A", "DS-4B"], extraLabor: 500000 },
    { brand: "BENZ", model: "E300 / E350 / E450 / GLE400D / CLS450 / EQC(p,e)", year: "20~", code: "-", system: "10채널(Burmeater)", dsp: ["PXE-R100-8", "PXE-X120-8", "PXE-X120-10DP", "PXE-X121-12EV", "HDP-D90"], pnp: ["BZ-3A", "DS-8B", "DS-81B", "DS-10B", "DS-12B", "DS-14B"], extraLabor: 1000000 },
    { brand: "BMW", model: "520 / 320 / X4 / X3 / X1 / 118D / 218D", year: "20~23", code: "-", system: "7채널(신형 Hi-Fi)", dsp: ["PXE-R100-8", "PXE-X120-8", "PXE-X120-10DP", "PXE-X121-12EV", "HDP-D90"], pnp: ["BM-402", "BM-1A", "DS-8B", "DS-81B", "DS-10B", "DS-12B", "DS-14B"], extraLabor: 1000000 },

    // 누락된 제조사 (Audi, VW, BYD, Landrover, Chevrolet)
    { brand: "Audi", model: "6채널 자출 차량", year: "-", code: "-", system: "6채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8"], pnp: ["AU-1A", "DS-8B", "DS-81B"], extraLabor: 1000000 },
    { brand: "Volkswagen", model: "4채널 자출 차량", year: "14~", code: "-", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["VW-1A", "DS-4B", "DS-8B"], extraLabor: 1000000 },
    { brand: "BYD", model: "ATTO3 / Dolphin", year: "25~", code: "-", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["BY-101", "DS-4B", "DS-8B"], extraLabor: 500000 },
    { brand: "BYD", model: "Seal / Sealion7", year: "25~", code: "-", system: "6채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8"], pnp: ["BY-2A", "DS-8B", "DS-81B"], extraLabor: 500000 },
    { brand: "Landrover", model: "레인지로버", year: "-", code: "-", system: "18채널(메리디안 3D)", dsp: ["PXE-R100-8", "PXE-X120-8", "HDP-D90"], pnp: ["RR-1A", "DS-14B"], extraLabor: 1500000 },
    { brand: "Landrover", model: "디스커버리", year: "-", code: "-", system: "14채널(메리디안)", dsp: ["PXE-R100-8", "PXE-X120-8"], pnp: ["RR-2A", "DS-14B"], extraLabor: 1000000 },
    { brand: "CHEVROLET", model: "4채널 자출 차량", year: "22~", code: "-", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["CH-1A", "DS-4B", "DS-8B"], extraLabor: 500000 },

    // Tesla
    { brand: "Tesla", model: "Model 3 / Model Y_롱레인지", year: "22~24", code: "M3 / MY", system: "13채널", dsp: ["PXE-X121-12EV"], pnp: ["TS-304"], front_door: ["DP2-65CF"], center: ["EV-40M-T"], surround: ["EV-40MR-T"], subwoofer: ["EV-100SW 3 or EV 100SW Y"], player: ["HDS-990"], extraLabor: 0 }
];

const ESTIMATE_DATA_VERSION = 20260221104500;

let estimateData = [];
if (typeof localStorage !== 'undefined') {
    const storedVersion = localStorage.getItem('estimateDataVersion');
    const stored = localStorage.getItem('estimateData');

    if (typeof ESTIMATE_DATA_VERSION !== 'undefined' && (!storedVersion || parseInt(storedVersion) < ESTIMATE_DATA_VERSION)) {
        estimateData = JSON.parse(JSON.stringify(initialEstimateData));
        localStorage.setItem('estimateData', JSON.stringify(estimateData));
        localStorage.setItem('estimateDataVersion', ESTIMATE_DATA_VERSION.toString());
        localStorage.setItem('estimate_sync_pending', 'true');
    } else if (stored) {
        estimateData = JSON.parse(stored);
        if (estimateData.length === 0 && initialEstimateData.length > 0) {
            estimateData = JSON.parse(JSON.stringify(initialEstimateData));
            localStorage.setItem('estimateData', JSON.stringify(estimateData));
            if (typeof ESTIMATE_DATA_VERSION !== 'undefined') localStorage.setItem('estimateDataVersion', ESTIMATE_DATA_VERSION.toString());
        }
    } else {
        estimateData = JSON.parse(JSON.stringify(initialEstimateData));
        if (typeof ESTIMATE_DATA_VERSION !== 'undefined') localStorage.setItem('estimateDataVersion', ESTIMATE_DATA_VERSION.toString());
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
