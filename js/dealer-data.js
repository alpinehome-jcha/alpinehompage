const initialDealerData = [
    {
        "id": 1,
        "category": "Alpine Sound Master",
        "name": "가인 오디오",
        "badge": "알파인사운드마스터",
        "address": "경기도 안양시 만안구 안양로 21",
        "phone": "010-8545-5311",
        "desc": "F#1 Status 및 알파인 모든 사운드 시스템을 취급합니다.",
        "username": "gain",
        "password": "1235",
        "role": "dealer",
        "lat": 37.3887,
        "lng": 126.9238,
        "region": "경기중앙(성남,안양,용인,과천)"
    },
    {
        "id": 2,
        "category": "Team Alpine",
        "name": "개구리 카오디오",
        "badge": "Team Alpine",
        "address": "경기도 성남시 분당구 대왕판교로 255",
        "phone": "010-5283-6277",
        "desc": "F#1 Status 및 알파인 모든 사운드 시스템을 취급합니다.",
        "username": "Frog",
        "password": "1234",
        "role": "dealer",
        "lat": 35.1796,
        "lng": 129.0756,
        "region": "경기중앙(성남,안양,용인,과천)"
    },
    {
        "id": 3,
        "category": "Team Alpine",
        "name": "카오디오팩토리",
        "badge": "Team Alpine",
        "address": "경기도 화성시 동탄구 여울로4길 15 1층",
        "phone": "010-6580-1975",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "caraudiofactory",
        "password": "1234",
        "role": "dealer",
        "lat": 35.8714,
        "lng": 128.6014,
        "region": "경기남부(수원,화성,평택,안성)"
    },
    {
        "id": 4,
        "category": "Team Alpine",
        "name": "럭셔리 카클럽",
        "badge": "Team Alpine",
        "address": "경기도 양주시 부흥로 1324",
        "phone": "010-9956-3618",
        "desc": "F#1 Status 및 알파인 모든 사운드 시스템을 취급합니다.",
        "username": "luxury",
        "password": "1234",
        "role": "dealer",
        "lat": 37.4563,
        "lng": 126.7052,
        "region": "경기북부(고양,파주,의정부,양주)"
    },
    {
        "id": 5,
        "category": "Team Alpine",
        "name": "오토갤러리",
        "badge": "Team Alpine",
        "address": "서울특별시 송파구 새말로 176 트윈팰리스101동 102호",
        "phone": "010-5220-8034",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "autogallery",
        "password": "1234",
        "role": "dealer",
        "lat": 35.1595,
        "lng": 126.8526,
        "region": "서울"
    },
    {
        "id": 6,
        "category": "Team Alpine",
        "name": "카투오디오",
        "badge": "Team Alpine",
        "address": "경기도 성남시 중원구 둔촌대로64번길 4-16(101호)",
        "phone": "010-3597-1735",
        "desc": "F#1 Status 및 알파인 모든 사운드 시스템을 취급합니다.",
        "username": "catooaudio",
        "password": "1234",
        "role": "dealer",
        "lat": 36.3504,
        "lng": 127.3845,
        "region": "경기중앙(성남,안양,용인,과천)"
    },
    {
        "id": 1770248942602,
        "category": "Team Alpine",
        "name": "썬카팩토리",
        "badge": "Team Alpine",
        "address": "인천광역시 서구 봉수대로 166 2동 101호",
        "phone": "010-9773-9882",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "suncarfactory",
        "password": "1234",
        "role": "dealer",
        "region": "인천"
    },
    {
        "id": 1770249019903,
        "category": "Team Alpine",
        "name": "사운드테크닉",
        "badge": "Team Alpine",
        "address": "경기도 광명시 금오로 745",
        "phone": "010-4764-7777",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "soundtechnic",
        "password": "1234",
        "role": "dealer",
        "region": "경기서부(김포,부천,광명,안산)"
    },
    {
        "id": 1770249089862,
        "category": "Team Alpine",
        "name": "광주카오디오",
        "badge": "Team Alpine",
        "address": "광주광역시 남구 독립로 163",
        "phone": "010-3627-9072",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "gwangju",
        "password": "1234",
        "role": "dealer",
        "region": "광주"
    },
    {
        "id": 1770249157344,
        "category": "Team Alpine",
        "name": "사운드째즈",
        "badge": "Team Alpine",
        "address": "제주특별자치도 제주시 연삼로 124",
        "phone": "010-3693-9499",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "soundjazz",
        "password": "1234",
        "role": "dealer",
        "region": "제주"
    },
    {
        "id": 1770249233020,
        "category": "Team Alpine",
        "name": "퍼니사운드",
        "badge": "Team Alpine",
        "address": "전북특별자치도 전주시 덕진구 쪽구름2길 34 1층 101호",
        "phone": "010-5123-9255",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "funnysound",
        "password": "1234",
        "role": "dealer",
        "region": "전북"
    },
    {
        "id": 1770249301228,
        "category": "Team Alpine",
        "name": "레트로카오디오",
        "badge": "Team Alpine",
        "address": "강원특별자치도 속초시 청호로 40",
        "phone": "010-6879-9255",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "retrocaraudio",
        "password": "1234",
        "role": "dealer",
        "region": "강원"
    },
    {
        "id": 1770249368030,
        "category": "Team Alpine",
        "name": "사운드로우",
        "badge": "Team Alpine",
        "address": "서울특별시 영등포구 도림로 2633 현대빌딩",
        "phone": "010-3606-7521",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "soundraw",
        "password": "1234",
        "role": "dealer",
        "region": "서울"
    },
    {
        "id": 1770249535832,
        "category": "Alpine Style Distributor",
        "name": "바이지츠아우토",
        "badge": "AlpineStyle",
        "address": "경기도 하남시 대성로169번길 34",
        "phone": "010-9126-9223",
        "desc": "알파인 테슬라패키지, 알파인 디지털룸미러, 메티오사운드, 알파인 OEM Fit",
        "username": "beisitauto01",
        "password": "1235",
        "role": "dealer",
        "region": "경기동부(남양주,하남,이천,양평)"
    },
    {
        "id": 1770249644286,
        "category": "Alpine Dealer",
        "name": "사운드닥터",
        "badge": "Alpine Sound",
        "address": "부산광역시 강서구 대저중앙로 139",
        "phone": "010-4855-8949",
        "desc": "F#1 Status 및 알파인 모든 사운드 시스템을 취급합니다.",
        "username": "sounddoctor",
        "password": "1234",
        "role": "dealer",
        "region": "부산"
    },
    {
        "id": 1770251069642,
        "category": "Alpine Dealer",
        "name": "사우스타운카오디오",
        "badge": "Alpine Sound",
        "address": "광주광역시 광산구 북문대로 605 101호",
        "phone": "010-8621-0996",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "southtowncaraudio",
        "password": "1234",
        "role": "dealer",
        "region": "광주"
    },
    {
        "id": 1770251199375,
        "category": "Alpine Dealer",
        "name": "맥스카오디오",
        "badge": "Alpine Sound",
        "address": "광주광역시 광산구 송도로85번길 30",
        "phone": "010-3161-2169",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "maxcaraudio",
        "password": "1234",
        "role": "dealer",
        "region": "광주"
    },
    {
        "id": 1770251278146,
        "category": "Alpine Dealer",
        "name": "뷰티풀사운드",
        "badge": "Alpine Audio",
        "address": "경기도 용인시 처인구 포곡읍 금어리 636",
        "phone": "010-6449-4738",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "beautifulsound",
        "password": "1234",
        "role": "dealer",
        "region": "경기중앙(성남,안양,용인,과천)"
    },
    {
        "id": 1770251356239,
        "category": "Alpine Dealer",
        "name": "일루션사운드",
        "badge": "Alpine Sound",
        "address": "경기도 화성시 효행구 기안동 222-2",
        "phone": "010-2883-8158",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "illusionsound",
        "password": "1234",
        "role": "dealer",
        "region": "경기남부(수원,화성,평택,안성)"
    },
    {
        "id": 1770251431563,
        "category": "Alpine Dealer",
        "name": "사운드포럼",
        "badge": "Alpine Sound",
        "address": "충청북도 제천시 의림대로 590",
        "phone": "010-8382-8400",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "soundforum",
        "password": "1234",
        "role": "dealer",
        "region": "충북"
    },
    {
        "id": 1770251555171,
        "category": "Alpine Dealer",
        "name": "오토사운드21",
        "badge": "Alpine Sound",
        "address": "서울특별시 마포구 백범로 36",
        "phone": "010-8993-9959",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "autosound21",
        "password": "1234",
        "role": "dealer"
    },
    {
        "id": 1770251639994,
        "category": "Alpine Dealer",
        "name": "프로카사운드",
        "badge": "Alpine Sound",
        "address": "경기도 성남시 수정구 성남대로1542번길 43-12 101호",
        "phone": "010-9023-2585",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "procarsound",
        "password": "1234",
        "role": "dealer",
        "region": "경기중앙(성남,안양,용인,과천)"
    },
    {
        "id": 1770251746434,
        "category": "Alpine Dealer",
        "name": "카사운드파크",
        "badge": "Alpine Sound",
        "address": "경기도 화성시 동탄구 10용사3길 3-1 (반송동) 1층",
        "phone": "010-7109-1185",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "carsoundpark",
        "password": "1234",
        "role": "dealer",
        "region": "경기남부(수원,화성,평택,안성)"
    },
    {
        "id": 1770251812987,
        "category": "Alpine Dealer",
        "name": "카사운드메이커",
        "badge": "Alpine Sound",
        "address": "전북특별자치도 익산시 익산대로 68",
        "phone": "010-2618-2455",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "carsoundmaker",
        "password": "1234",
        "role": "dealer",
        "region": "전북"
    },
    {
        "id": 1770251885018,
        "category": "Alpine Dealer",
        "name": "퀄리티하우스",
        "badge": "Alpine Sound",
        "address": "충청남도 아산시 삼동로 70",
        "phone": "010-4816-9221",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "qualityhouse",
        "password": "1234",
        "role": "dealer",
        "region": "충남"
    },
    {
        "id": 1770251944630,
        "category": "Alpine Dealer",
        "name": "현대카오디오",
        "badge": "Alpine Sound",
        "address": "경기도 구리시 수택동 430",
        "phone": "010-3795-4826",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "hyundaicaraudio",
        "password": "1234",
        "role": "dealer",
        "region": "경기동부(남양주,하남,이천,양평)"
    },
    {
        "id": 1770252017508,
        "category": "Alpine Dealer",
        "name": "제이에이치사운드",
        "badge": "Alpine Sound",
        "address": "경상남도 김해시 구지로 181 1층(동상동)",
        "phone": "010-7670-1613",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "jhsound",
        "password": "1234",
        "role": "dealer",
        "region": "경남"
    },
    {
        "id": 1770252102820,
        "category": "Alpine Dealer",
        "name": "에이치코드카오디오",
        "badge": "Alpine Sound",
        "address": "서울특별시 서초구 바우뫼로 140 1층",
        "phone": "010-2783-7775",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "hcodecaraudio",
        "password": "1234",
        "role": "dealer"
    },
    {
        "id": 1770252184174,
        "category": "Alpine Dealer",
        "name": "카사운드메이커(서울)",
        "badge": "Alpine Sound",
        "address": "서울특별시 서초구 강남대로101안길 36",
        "phone": "010-2618-2455",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "carsoundmaker01",
        "password": "1234",
        "role": "dealer"
    },
    {
        "id": 1770252250504,
        "category": "Alpine Dealer",
        "name": "파워뱅크하우스",
        "badge": "Alpine Sound",
        "address": "대전광역시 서구 도산로 465",
        "phone": "010-5407-4999",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "powerbankhouse",
        "password": "1234",
        "role": "dealer",
        "region": "대전"
    },
    {
        "id": 1770252302728,
        "category": "Alpine Dealer",
        "name": "에이스카프라자",
        "badge": "Alpine Sound",
        "address": "대전광역시 중구 충무로 105 (대사동) 우측 에이스카프라자",
        "phone": "010-2055-5082",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "acecarplaza",
        "password": "1234",
        "role": "dealer",
        "region": "대전"
    },
    {
        "id": 1770252367530,
        "category": "Alpine Dealer",
        "name": "트로피칼사운드",
        "badge": "Alpine Sound",
        "address": "서울특별시 서초구 강남대로6길 108-4 (양재동) 1층 트로피칼사운드(양재동)",
        "phone": "010-5853-6659",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "tropicalsound",
        "password": "1234",
        "role": "dealer"
    },
    {
        "id": 1770252423184,
        "category": "Alpine Dealer",
        "name": "커스텀사운드",
        "badge": "Alpine Sound",
        "address": "부산광역시 강서구 평강로397번길 4",
        "phone": "010-3896-1053",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "customsound",
        "password": "1234",
        "role": "dealer",
        "region": "부산"
    },
    {
        "id": 1770252538684,
        "category": "Alpine Dealer",
        "name": "아인스아우토",
        "badge": "Alpine Sound",
        "address": "울산광역시 남구 돋질로 113",
        "phone": "010-4530-8465",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "einsauto",
        "password": "1234",
        "role": "dealer",
        "region": "울산"
    },
    {
        "id": 1770252612776,
        "category": "Alpine Dealer",
        "name": "라우러사운드",
        "badge": "Alpine Sound",
        "address": "경상남도 함안군 칠원읍 경남대로 1742",
        "phone": "010-7114-7499",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "loudersound",
        "password": "1234",
        "role": "dealer",
        "region": "경남"
    },
    {
        "id": 1770252674996,
        "category": "Alpine Dealer",
        "name": "핸즈카오디오",
        "badge": "Alpine Sound",
        "address": "대구광역시 남구 효성로 15 미리내맨션 상가",
        "phone": "010-9077-6658",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "handscaraudio",
        "password": "1234",
        "role": "dealer",
        "region": "대구"
    },
    {
        "id": 1770252725836,
        "category": "Alpine Dealer",
        "name": "째즈카오디오",
        "badge": "Alpine Sound",
        "address": "대구광역시 서구 국채보상로 21",
        "phone": "010-7543-9009",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "jazzcaraudio",
        "password": "1234",
        "role": "dealer",
        "region": "대구"
    },
    {
        "id": 1770252770959,
        "category": "Alpine Dealer",
        "name": "사운드프로",
        "badge": "Alpine Sound",
        "address": "대구광역시 남구 대명복개로 156-1 (대명동) 1층",
        "phone": "010-3312-7980",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "soundpro",
        "password": "1234",
        "role": "dealer",
        "region": "대구"
    },
    {
        "id": 1770252813652,
        "category": "Alpine Dealer",
        "name": "772카오디오",
        "badge": "Alpine Sound",
        "address": "경상북도 경산시 장산로 142",
        "phone": "010-3812-7292",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "772caraudio",
        "password": "1234",
        "role": "dealer",
        "region": "대구"
    },
    {
        "id": 1770252968891,
        "category": "Alpine Dealer",
        "name": "로드마인",
        "badge": "Alpine Sound",
        "address": "서울특별시 중랑구 용마산로139나길 91",
        "phone": "010-9188-0897",
        "desc": "Jimny 전용 메티오사운드",
        "username": "roadmine",
        "password": "1234",
        "role": "dealer"
    },
    {
        "id": 1770253046567,
        "category": "Alpine Dealer",
        "name": "오성카오디오",
        "badge": "Alpine Sound",
        "address": "부산광역시 수영구 광남로 171",
        "phone": "010-4513-5513",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "ohsungcaraudio",
        "password": "1234",
        "role": "dealer",
        "region": "부산"
    },
    {
        "id": 1770253137261,
        "category": "Alpine Dealer",
        "name": "페이즈카오디오",
        "badge": "Alpine Sound",
        "address": "부산광역시 금정구 범어천로 14",
        "phone": "010-9688-0199",
        "desc": "알파인 모든 사운드 시스템을 취급합니다.",
        "username": "phasecaraudio",
        "password": "1234",
        "role": "dealer",
        "lat": 35.2690732,
        "lng": 129.0900833,
        "region": "부산"
    },
    {
        "id": 1770253229315,
        "category": "Alpine Dealer",
        "name": "미스트랄카오디오",
        "badge": "Alpine Sound",
        "address": "경상남도 창원시 진해구 충장로 195",
        "phone": "010-9953-0757",
        "desc": "Hi-Fi 전문, F#1 Status와 Alpine Status 전",
        "username": "mistralcaraudio",
        "password": "1234",
        "role": "dealer",
        "region": "경남"
    }
];
const DEALER_DATA_VERSION = 1770879038207;

let dealerData = [];
if (typeof localStorage !== 'undefined') {
    const storedVersion = localStorage.getItem('dealerDataVersion');
    const stored = localStorage.getItem('dealerData');

    if (typeof DEALER_DATA_VERSION !== 'undefined' && (!storedVersion || parseInt(storedVersion) < DEALER_DATA_VERSION)) {
        // Server has newer version, force update
        dealerData = JSON.parse(JSON.stringify(initialDealerData));
        localStorage.setItem('dealerData', JSON.stringify(dealerData));
        localStorage.setItem('dealerDataVersion', DEALER_DATA_VERSION.toString());
    } else if (stored) {
        dealerData = JSON.parse(stored);
        // Safety Check for empty data
        if (dealerData.length === 0 && initialDealerData.length > 0) {
             dealerData = JSON.parse(JSON.stringify(initialDealerData));
             localStorage.setItem('dealerData', JSON.stringify(dealerData));
             if (typeof DEALER_DATA_VERSION !== 'undefined') localStorage.setItem('dealerDataVersion', DEALER_DATA_VERSION.toString());
        }
    } else {
        dealerData = JSON.parse(JSON.stringify(initialDealerData));
        if (typeof DEALER_DATA_VERSION !== 'undefined') localStorage.setItem('dealerDataVersion', DEALER_DATA_VERSION.toString());
    }
} else {
    dealerData = initialDealerData;
}

if (typeof window !== 'undefined') {
    window.dealerData = dealerData;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = dealerData;
}