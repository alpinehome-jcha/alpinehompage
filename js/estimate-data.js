/**
 * Alpine Virtual Estimate Data
 * Full Dataset based on PnP Search Data (130+ entries)
 * Updated: 2026-02-21 12:35
 */
const initialEstimateData = [
    // 현대자동차 (Hyundai)
    { brand: "현대자동차", model: "캐스퍼", year: "21~", code: "AX1", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-103", "HK-1A", "DS-4B", "DS-8B", "DS-81B"], extraLabor: 0 },
    { brand: "현대자동차", model: "i30", year: "11~16", code: "GD", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8"], pnp: ["HK-102", "DS-4B", "DS-8B"], extraLabor: 0 },
    { brand: "현대자동차", model: "i30", year: "16~", code: "PD", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8", "PXE-R100-8"], pnp: ["HK-103", "HK-1A", "DS-4B", "DS-8B"], extraLabor: 0 },
    { brand: "현대자동차", model: "벨로스터", year: "11~17", code: "FS", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-102", "DS-4B"], extraLabor: 0 },
    { brand: "현대자동차", model: "벨로스터", year: "18~22", code: "JS", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "현대자동차", model: "아반떼", year: "10~15", code: "MD", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-102", "DS-4B", "DS-8B"], extraLabor: 0 },
    { brand: "현대자동차", model: "아반떼", year: "15~20", code: "AD", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-103", "HK-1A", "DS-4B", "DS-8B"], extraLabor: 0 },
    { brand: "현대자동차", model: "아반떼", year: "20~", code: "CN7", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-103", "HK-1A", "DS-4B", "DS-8B"], extraLabor: 0 },
    { brand: "현대자동차", model: "아반떼", year: "20~", code: "CN7", system: "6채널(BOSE)", dsp: ["PXE-R80-8", "PXE-R100-8", "PXE-X120-8"], pnp: ["HK-16A", "DS-4B", "DS-8B", "DS-81B"], extraLabor: 0 },
    { brand: "현대자동차", model: "아이오닉", year: "16~21", code: "AE", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "현대자동차", model: "i40", year: "11~19", code: "VF", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-102", "DS-4B"], extraLabor: 0 },
    { brand: "현대자동차", model: "쏘나타", year: "09~14", code: "YF", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-102", "DS-4B"], extraLabor: 0 },
    { brand: "현대자동차", model: "쏘나타", year: "14~19", code: "LF", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-103", "HK-1A", "DS-4B", "DS-8B"], extraLabor: 0 },
    { brand: "현대자동차", model: "쏘나타", year: "19~23", code: "DN8", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-103", "HK-1A", "DS-4B", "DS-8B"], extraLabor: 0 },
    { brand: "현대자동차", model: "쏘나타", year: "24~", code: "DN8", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-104", "HK-2A", "DS-4B", "DS-8B"], extraLabor: 0 },
    { brand: "현대자동차", model: "쏘나타", year: "19~", code: "DN8", system: "10채널(프리미엄)", dsp: ["PXE-R100-8", "PXE-X120-8"], pnp: ["HK-12A", "DS-8B", "DS-81B"], extraLabor: 500000 },
    { brand: "현대자동차", model: "아이오닉5", year: "22~24", code: "NE EV", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "현대자동차", model: "아이오닉5", year: "25~", code: "NE EV", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-104", "HK-2A", "DS-4B"], extraLabor: 0 },
    { brand: "현대자동차", model: "아이오닉6", year: "22~25", code: "CE", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "현대자동차", model: "아이오닉6", year: "26~", code: "CE", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-104", "HK-2A", "DS-4B"], extraLabor: 0 },
    { brand: "현대자동차", model: "그랜저", year: "11~17", code: "HG", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-102", "DS-4B"], extraLabor: 0 },
    { brand: "현대자동차", model: "그랜저", year: "16~23", code: "IG", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-103", "HK-1A", "DS-4B", "DS-8B"], extraLabor: 0 },
    { brand: "현대자동차", model: "그랜저", year: "16~23", code: "IG", system: "11채널(JBL)", dsp: ["PXE-R100-8", "PXE-X120-8"], pnp: ["HK-13A", "DS-8B", "DS-81B"], extraLabor: 500000 },
    { brand: "현대자동차", model: "그랜저", year: "22~", code: "GN7", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-106", "HK-2A", "DS-4B", "DS-8B"], extraLabor: 500000 },
    { brand: "현대자동차", model: "그랜저", year: "22~", code: "GN7", system: "10채널(BOSE)", dsp: ["PXE-R100-8", "PXE-X120-8", "PXE-X120-10DP"], pnp: ["HK-107", "HK-12A", "DS-8B", "DS-81B", "DS-10B"], extraLabor: 500000 },
    { brand: "현대자동차", model: "코나", year: "17~23", code: "OS", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "현대자동차", model: "코나", year: "23~", code: "SX2", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-104", "HK-2A", "DS-4B"], extraLabor: 100000 },
    { brand: "현대자동차", model: "투싼", year: "15~20", code: "TL", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "현대자동차", model: "투싼", year: "20~23", code: "NX4", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "현대자동차", model: "투싼", year: "24~", code: "NX4", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-104", "HK-2A", "DS-4B"], extraLabor: 0 },
    { brand: "현대자동차", model: "싼타페", year: "12~18", code: "DM", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-102", "DS-4B"], extraLabor: 0 },
    { brand: "현대자동차", model: "싼타페", year: "18~23", code: "TM", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "현대자동차", model: "싼타페", year: "23~", code: "MX5", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-104", "HK-2A", "DS-4B", "DS-8B"], extraLabor: 500000 },
    { brand: "현대자동차", model: "싼타페", year: "23~", code: "MX5", system: "10채널(BOSE)", dsp: ["PXE-R100-8", "PXE-X120-8"], pnp: ["HK-12A", "DS-8B", "DS-81B"], extraLabor: 500000 },
    { brand: "현대자동차", model: "팰리세이드", year: "18~24", code: "LX2", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 200000 },
    { brand: "현대자동차", model: "팰리세이드", year: "25~", code: "LX3", system: "6채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-104", "HK-2A", "DS-4B", "DS-8B"], extraLabor: 500000 },
    { brand: "현대자동차", model: "스타리아", year: "21~", code: "US4", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 200000 },

    // 제네시스 (Genesis)
    { brand: "제네시스", model: "G70", year: "18~", code: "IK", system: "7채널(모비스)", dsp: ["PXE-R80-8", "PXE-R100-8"], pnp: ["GE-2A", "DS-8B"], extraLabor: 500000 },
    { brand: "제네시스", model: "G70", year: "18~", code: "IK", system: "15채널(렉시콘)", dsp: ["PXE-R100-8", "PXE-X120-10DP"], pnp: ["GE-4A", "DS-8B", "DS-10B"], extraLabor: 1000000 },
    { brand: "제네시스", model: "G80", year: "16~20", code: "DH", system: "7채널(액튠)", dsp: ["PXE-R80-8", "PXE-R100-8"], pnp: ["GE-7A", "DS-8B"], extraLabor: 500000 },
    { brand: "제네시스", model: "G80", year: "16~20", code: "DH", system: "12채널(JBL)", dsp: ["PXE-R100-8", "PXE-X120-10DP"], pnp: ["GE-8A", "DS-8B", "DS-10B"], extraLabor: 800000 },
    { brand: "제네시스", model: "G80", year: "20~24", code: "RG3", system: "7채널(액튠)", dsp: ["PXE-R80-8", "PXE-R100-8"], pnp: ["GE-203", "GE-2A", "DS-8B"], extraLabor: 500000 },
    { brand: "제네시스", model: "G80", year: "24~", code: "RG3", system: "7채널(액튠)", dsp: ["PXE-R80-8", "PXE-R100-8"], pnp: ["GE-2A", "DS-8B"], extraLabor: 500000 },
    { brand: "제네시스", model: "G80", year: "20~", code: "RG3", system: "14채널(렉시콘,B&O)", dsp: ["PXE-R100-8", "PXE-X121-12EV", "HDP-D90"], pnp: ["GE-6A", "DS-8B", "DS-12B", "DS-14B"], extraLabor: 1000000 },
    { brand: "제네시스", model: "G90", year: "15~18", code: "HI", system: "17채널(렉시콘)", dsp: ["PXE-R100-8", "PXE-X121-12EV"], pnp: ["GE-5A", "DS-12B"], extraLabor: 1000000 },
    { brand: "제네시스", model: "G90", year: "18~21", code: "HI", system: "17채널(렉시콘)", dsp: ["PXE-R100-8", "PXE-X121-12EV"], pnp: ["GE-9A", "DS-12B"], extraLabor: 1000000 },
    { brand: "제네시스", model: "G90", year: "21~", code: "RS4", system: "14채널(High)", dsp: ["PXE-R100-8", "PXE-X120-10DP", "HDP-D90"], pnp: ["GE-10A", "DS-8B", "DS-10B", "DS-14B"], extraLabor: 1500000 },
    { brand: "제네시스", model: "GV60", year: "21~", code: "JW1 EV", system: "14채널(B&O)", dsp: ["PXE-R100-8", "PXE-X121-12EV"], pnp: ["GE-6A", "DS-12B"], extraLabor: 500000 },
    { brand: "제네시스", model: "GV70", year: "21~24", code: "JK1", system: "9채널(모비스 프리미엄)", dsp: ["PXE-R80-8", "PXE-R100-8"], pnp: ["GE-3A", "DS-8B"], extraLabor: 500000 },
    { brand: "제네시스", model: "GV70", year: "21~24", code: "JK1", system: "15채널(렉시콘)", dsp: ["PXE-R100-8", "PXE-X121-12EV"], pnp: ["GE-4A", "DS-12B"], extraLabor: 1000000 },
    { brand: "제네시스", model: "GV80", year: "20~", code: "JX1", system: "9채널(모비스 프리미엄)", dsp: ["PXE-R80-8", "PXE-R100-8"], pnp: ["GE-3A", "DS-8B"], extraLabor: 500000 },
    { brand: "제네시스", model: "GV80", year: "20~", code: "JX1", system: "14채널(렉시콘,B&O)", dsp: ["PXE-R100-8", "PXE-X121-12EV"], pnp: ["GE-6A", "DS-12B"], extraLabor: 1000000 },

    // 기아자동차 (Kia)
    { brand: "기아자동차", model: "모닝", year: "17~", code: "JA", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "레이", year: "11~17", code: "TAM", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-102", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "레이", year: "17~", code: "TAM", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "니로", year: "16~22", code: "DE", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "니로", year: "22~", code: "SG2", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "K3", year: "12~18", code: "YD", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-102", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "K3", year: "18~24", code: "BD", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "K5", year: "10~15", code: "TF", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-102", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "K5", year: "15~19", code: "JF", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "K5", year: "19~24", code: "DL3", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "K5", year: "25~", code: "DL3", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-104", "HK-2A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "K5", year: "19~", code: "DL3", system: "12채널(크렐)", dsp: ["PXE-R100-8", "PXE-X120-10DP"], pnp: ["HK-14A", "DS-8B", "DS-10B"], extraLabor: 500000 },
    { brand: "기아자동차", model: "K7", year: "16~21", code: "YG", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "K7", year: "16~21", code: "YG", system: "12채널(크렐)", dsp: ["PXE-R100-8", "PXE-X120-10DP"], pnp: ["HK-14A", "DS-8B", "DS-10B"], extraLabor: 500000 },
    { brand: "기아자동차", model: "K8", year: "21~", code: "GL3", system: "4채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-106", "HK-2A", "DS-4B", "DS-8B"], extraLabor: 500000 },
    { brand: "기아자동차", model: "K8", year: "21~", code: "GL3", system: "11채널(메리디안)", dsp: ["PXE-R100-8", "PXE-X120-10DP"], pnp: ["HK-21A", "DS-8B", "DS-10B"], extraLabor: 800000 },
    { brand: "기아자동차", model: "K9", year: "18~21", code: "RJ", system: "14/17채널(렉시콘)", dsp: ["PXE-R100-8", "PXE-X121-12EV"], pnp: ["HK-15A", "DS-12B"], extraLabor: 1000000 },
    { brand: "기아자동차", model: "스팅어", year: "17~23", code: "CK", system: "15채널(렉시콘)", dsp: ["PXE-R100-8", "PXE-X121-12EV"], pnp: ["HK-15A", "DS-12B"], extraLabor: 800000 },
    { brand: "기아자동차", model: "EV6", year: "21~24", code: "CV", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "EV6", year: "25~", code: "CV", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-104", "HK-2A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "EV6", year: "21~", code: "CV", system: "14채널(메리디안)", dsp: ["PXE-R100-8", "PXE-X121-12EV"], pnp: ["HK-21A", "DS-12B"], extraLabor: 500000 },
    { brand: "기아자동차", model: "EV9", year: "23~", code: "MV", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-104", "HK-2A", "DS-4B"], extraLabor: 500000 },
    { brand: "기아자동차", model: "셀토스", year: "19~22", code: "SP2", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "셀토스", year: "23~", code: "SP2", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-104", "HK-2A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "스포티지", year: "10~15", code: "SL", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-102", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "스포티지", year: "15~21", code: "QL", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "스포티지", year: "21~24", code: "NQ5", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "스포티지", year: "25~", code: "NQ5", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-104", "HK-2A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "스포티지", year: "21~", code: "NQ5", system: "8채널(크렐)", dsp: ["PXE-R80-8", "PXE-R100-8"], pnp: ["HK-17A", "DS-8B"], extraLabor: 500000 },
    { brand: "기아자동차", model: "쏘렌토", year: "14~20", code: "UM", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "쏘렌토", year: "20~23", code: "MQ4", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "쏘렌토", year: "24~", code: "MQ4", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-104", "HK-2A", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "쏘렌토", year: "20~", code: "MQ4", system: "12채널(크렐,BOSE)", dsp: ["PXE-R100-8", "PXE-X120-10DP"], pnp: ["HK-14A", "DS-8B", "DS-10B"], extraLabor: 500000 },
    { brand: "기아자동차", model: "모하비", year: "08~19", code: "HM", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-102", "DS-4B"], extraLabor: 0 },
    { brand: "기아자동차", model: "카니발", year: "14~20", code: "YP", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 200000 },
    { brand: "기아자동차", model: "카니발", year: "20~23", code: "KA4", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["HK-103", "HK-1A", "DS-4B"], extraLabor: 200000 },
    { brand: "기아자동차", model: "카니발", year: "24~", code: "KA4", system: "6채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["HK-104", "HK-2A", "DS-4B", "DS-8B"], extraLabor: 500000 },
    { brand: "기아자동차", model: "카니발", year: "20~", code: "KA4", system: "12채널(크렐,BOSE)", dsp: ["PXE-R100-8", "PXE-X120-10DP"], pnp: ["HK-14A", "DS-8B", "DS-10B"], extraLabor: 500000 },

    // BENZ
    { brand: "BENZ", model: "New S / New C / New GLC", year: "22~", code: "W223 / W206 / X254", system: "15채널(Burmester)", dsp: ["PXE-R100-8", "PXE-X121-12EV"], pnp: ["BZ-2A", "DS-12B"], extraLabor: 1500000 },
    { brand: "BENZ", model: "E300 / E350 / E450 / GLE400D...", year: "20~", code: "W213 / V167", system: "10채널(Burmester)", dsp: ["PXE-R100-8", "PXE-X120-10DP"], pnp: ["BZ-3A", "DS-8B", "DS-10B"], extraLabor: 1000000 },
    { brand: "BENZ", model: "S-클래스", year: "14~21", code: "W222", system: "10채널(Burmester)", dsp: ["PXE-R100-8", "PXE-X120-10DP"], pnp: ["BZ-5A", "DS-8B", "DS-10B"], extraLabor: 1000000 },
    { brand: "BENZ", model: "E-클래스 / CLS", year: "16~21", code: "W213 / C257", system: "10채널(Burmester)", dsp: ["PXE-R100-8", "PXE-X120-10DP"], pnp: ["BZ-6A", "DS-8B", "DS-10B"], extraLabor: 1000000 },
    { brand: "BENZ", model: "C-클래스 / GLC", year: "16~21", code: "W205 / X253", system: "10채널(Burmester)", dsp: ["PXE-R100-8", "PXE-X120-10DP"], pnp: ["BZ-7A", "DS-8B", "DS-10B"], extraLabor: 1000000 },
    { brand: "BENZ", model: "A / CLA / GLB / GLA", year: "20~", code: "-", system: "7채널(Mid-End)", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["BZ-501", "BZ-502", "BZ-10A", "DS-4B", "DS-8B"], extraLabor: 800000 },

    // BMW
    { brand: "BMW", model: "1 / 2 / 3 / 4 / X1 / X2 / X3 / X4", year: "20~23", code: "ID7", system: "7채널(신형 Hi-Fi)", dsp: ["PXE-R100-8", "PXE-X120-10DP"], pnp: ["BM-402", "BM-1A", "DS-8B", "DS-10B"], extraLabor: 1000000 },
    { brand: "BMW", model: "5 / 6 / 7 / X5 / X6 / X7", year: "20~23", code: "ID7", system: "7채널(신형 Hi-Fi)", dsp: ["PXE-R100-8", "PXE-X120-10DP"], pnp: ["BM-401", "BM-1A", "DS-8B", "DS-10B"], extraLabor: 1000000 },
    { brand: "BMW", model: "New 5 / New X5 / New X6", year: "24~", code: "ID8.5", system: "7채널(RAM)", dsp: ["PXE-R100-8", "PXE-X120-10DP"], pnp: ["BM-403", "BM-1A", "DS-8B", "DS-10B"], extraLabor: 1000000 },
    { brand: "BMW", model: "전차종", year: "10~19", code: "-", system: "7채널(Hi-Fi)", dsp: ["PXE-R80-8", "PXE-R100-8"], pnp: ["BM-2A", "DS-8B"], extraLabor: 800000 },
    { brand: "BMW", model: "전차종", year: "15~", code: "-", system: "11/16채널(H/K)", dsp: ["PXE-X121-12EV", "HDP-D90"], pnp: ["BM-3A", "DS-12B", "DS-14B"], extraLabor: 1500000 },

    // Audi / VW
    { brand: "Audi", model: "A4 / A5 / A6 / Q5", year: "16~", code: "-", system: "10채널(Audi Sound)", dsp: ["PXE-R100-8", "PXE-X120-10DP"], pnp: ["AU-2A", "DS-8B", "DS-10B"], extraLabor: 1000000 },
    { brand: "Audi", model: "A6 / A7 / A8 / Q7 / Q8", year: "19~", code: "-", system: "14채널(B&O)", dsp: ["PXE-R100-8", "PXE-X121-12EV"], pnp: ["AU-3A", "DS-12B"], extraLabor: 1500000 },
    { brand: "Volkswagen", model: "골프 / 티구안 / 아테온", year: "14~", code: "-", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["VW-1A", "DS-4B"], extraLabor: 500000 },

    // BYD
    { brand: "BYD", model: "ATTO3 / Dolphin", year: "25~", code: "-", system: "4채널 자출", dsp: ["PXE-M60-4"], pnp: ["BY-101", "DS-4B"], extraLabor: 500000 },
    { brand: "BYD", model: "Seal / Sealion7", year: "25~", code: "-", system: "6채널 자출", dsp: ["PXE-M60-4", "PXE-R80-8"], pnp: ["BY-2A", "DS-8B"], extraLabor: 500000 },

    // Landrover / RR
    { brand: "Landrover", model: "레인지로버 / 보그", year: "17~22", code: "-", system: "18채널(메리디안 3D)", dsp: ["PXE-R100-8", "HDP-D90"], pnp: ["RR-1A", "DS-14B"], extraLabor: 1500000 },
    { brand: "Landrover", model: "디스커버리5", year: "17~", code: "-", system: "14채널(메리디안)", dsp: ["PXE-R100-8", "PXE-X121-12EV"], pnp: ["RR-2A", "DS-12B"], extraLabor: 1000000 },

    // Tesla
    { brand: "Tesla", model: "Model 3 / Model Y", year: "22~", code: "M3 / MY", system: "8채널(스탠다드)", dsp: ["PXE-R100-8", "PXE-X121-12EV"], pnp: ["TS-301", "TS-302", "TS-303", "DS-12B"], extraLabor: 800000 },
    { brand: "Tesla", model: "Model 3 / Model Y", year: "22~", code: "M3 / MY", system: "13채널(롱레인지)", dsp: ["PXE-X121-12EV"], pnp: ["TS-304", "DS-12B"], extraLabor: 1000000 }
];

const ESTIMATE_DATA_VERSION = 20260221123500;

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
