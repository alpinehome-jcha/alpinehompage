const initialDealerData = [
    {
        "id": 1,
        "category": "Alpine Sound Master",
        "name": "가인 오디오",
        "username": "gain",
        "password": "123",
        "badge": "알파인사운드마스터",
        "address": "경기 안양시 만안구 안양로 21",
        "phone": "010-8545-5311",
        "desc": "F#1 Status 및 알파인 모든 사운드 시스템을 취급합니다.",
        "lat": 37.3887,
        "lng": 126.9238
    },
    {
        "id": 2,
        "category": "Team Alpine",
        "name": "Busan Sound Studio",
        "username": "busan",
        "password": "123",
        "badge": "Team Alpine",
        "address": "456 Haeundae-ro, Busan",
        "phone": "051-987-6543",
        "desc": "Certified Installation Team",
        "lat": 35.1796,
        "lng": 129.0756
    },
    {
        "id": 3,
        "category": "Alpine Style Distributor",
        "name": "Daegu Car Audio",
        "username": "daegu",
        "password": "123",
        "badge": "",
        "address": "789 Dongdaegu-ro, Daegu",
        "phone": "053-111-2222",
        "desc": "Alpine Style Official Distributor",
        "lat": 35.8714,
        "lng": 128.6014
    },
    {
        "id": 4,
        "category": "Alpine Regional Distributor",
        "name": "Incheon Auto Sound",
        "username": "incheon",
        "password": "123",
        "badge": "",
        "address": "321 Incheon-daero, Incheon",
        "phone": "032-444-5555",
        "desc": "Regional Distributor & Service Center",
        "lat": 37.4563,
        "lng": 126.7052
    },
    {
        "id": 5,
        "category": "Alpine Regional Distributor",
        "name": "Gwangju Premium Audio",
        "username": "gwangju",
        "password": "123",
        "badge": "",
        "address": "654 Gwangju-ro, Gwangju",
        "phone": "062-777-8888",
        "desc": "Regional Distributor & Audio Tuning",
        "lat": 35.1595,
        "lng": 126.8526
    },
    {
        "id": 6,
        "category": "Alpine Dealer",
        "name": "Daejeon Masters",
        "username": "daejeon",
        "password": "123",
        "badge": "",
        "address": "987 Daejeon-ro, Daejeon",
        "phone": "042-999-0000",
        "desc": "Authorized Alpine Dealer",
        "lat": 36.3504,
        "lng": 127.3845
    },
    {
        "id": 7,
        "category": "Alpine Dealer",
        "name": "Eunpyeong Auto Gallery",
        "username": "autogallery",
        "password": "123",
        "badge": "",
        "address": "서울특별시 은평구",
        "phone": "02-123-4567",
        "desc": "Alpine Dealer in Seoul",
        "lat": 37.6027,
        "lng": 126.9291
    }
];

// Version control
const DATA_VERSION = "2026-02-11-v1";

let dealerData = [];
if (typeof localStorage !== 'undefined') {
    const storedVersion = localStorage.getItem('dealerDataVersion');
    const stored = localStorage.getItem('dealerData');

    // If version mismatch or no stored version, force update from initial data
    if (storedVersion !== DATA_VERSION) {
        console.log(`Detected new dealer data version. Updating from ${storedVersion} to ${DATA_VERSION}`);
        dealerData = JSON.parse(JSON.stringify(initialDealerData));
        localStorage.setItem('dealerData', JSON.stringify(dealerData));
        localStorage.setItem('dealerDataVersion', DATA_VERSION);
    } else if (stored) {
        dealerData = JSON.parse(stored);

        // Migration: Check for legacy data without username or coordinates
        let modified = false;

        // Create a map of initial data for easy lookup
        const initialMap = {};
        initialDealerData.forEach(d => initialMap[d.id] = d);

        dealerData.forEach(d => {
            // Username migration
            if (!d.username && d.id) {
                d.username = 'dealer' + d.id;
                d.password = '123';
                modified = true;
            }

            // Coordinates migration - Check aggressively
            // If ID matches original data, and coordinates are missing or invalid (0,0 is suspicious if originally not)
            const original = initialMap[d.id];
            if (original) {
                if (!d.lat || !d.lng) {
                    d.lat = original.lat;
                    d.lng = original.lng;
                    modified = true;
                }
            }
        });

        if (modified) {
            localStorage.setItem('dealerData', JSON.stringify(dealerData));
            console.log('Dealer data migrated with coordinates.');
        }
    } else {
        dealerData = JSON.parse(JSON.stringify(initialDealerData));
        localStorage.setItem('dealerData', JSON.stringify(dealerData));
        localStorage.setItem('dealerDataVersion', DATA_VERSION);
    }
} else {
    dealerData = initialDealerData;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = dealerData;
}