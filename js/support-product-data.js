const initialSupport_productData = [
    {
        "id": 1770615678275,
        "date": "2026-02-09",
        "title": "UTS-A100 Sampling Rate 조절을 위한 PC 프로그램",
        "content": "UTS A100은 192kHz로 기본 설정되어 있습니다.\n\n192kHz 지원이 안되는 DSP는 96kHz로 변경해야 합니다.\n\nPC  프로그램을 다운로드하시고 설정하시면 됩니다.\n\n프로그램 다운로드 클릭\nhttps://drive.google.com/file/d/1R8MHdmwf9dexGgQ8p_pGuFhiKsyPJ-QY/view",
        "image": "assets/images/a100pc.jpg",
        "files": [],
        "author": "Admin"
    },
    {
        "id": 1770615347462,
        "date": "2026-02-09",
        "title": "알파인 뮤직 1.4.1",
        "content": "알파인 제품들을 스마트폰으로 컨트롤하는 어플리케이션입니다.\n\nDSP와 연결할 경우 간단한 설정변경이 가능하고, HDS-990과 연결할 경우 재생리스트와 간단한 설정이 가능합니다.\n\n또한 추후 출시된 엠비언트 라이트도 컨트롤 하게 됩니다.\n\n(주의사항: 소프트웨어가 완전하지 않으니 너무 신뢰하지 마십시오. 또한 가끔 중국어가 나타날 수 있습니다.)\n\n \n1.아이폰은 큐알로 스켄하세요\n2.안드로이드 폰은 아래의 링크를 클릭하세요.\nhttps://drive.google.com/file/d/1K5ishCfw3tdW1TlxZMNrwAuglG7wpxtI/view\n\n\nStep1\n첨부파일을 안드로이드 폰에 다운로드한 다음 \"AlpineMusic1.4.1.apk.zip\" --> \"AlpineMusic1.4.1.apk\"로 마지막 .zip 글짜를 지웁니다.\n\nStep2\nAPK 설치파일 항목에서 알파인 뮤직을 실행시킵니다.\n\nStep3\n등록할 기기를 선택하고 블루투스로 연결합니다.\n\n",
        "image": "assets/images/알파인뮤직 큐알.jpg",
        "files": [],
        "author": "Admin"
    },
    {
        "id": 1770615058010,
        "date": "2026-02-09",
        "title": " 알파인 디지털 미러 DVR-DM100KO-IC 제품의 뷰어 프로그램입니다.",
        "content": "**TIP1**\n\n프로그램이 설치되었더라도 바탕화면에 바로가기 아이콘이 설치되지 않습니다.\n\n매번마다 DMR-Series_Viewer.exe 파일을 실행해야 하나 바로가기 버튼을 만들어 사용하시면 편리합니다.\n\n바로가기 버튼 만들기 방법\n\n1. DMR-Series_Viewer.exe 파일에 마우스 커서를 위치하고 오른쪽 마우스 버튼을 클릭합니다.\n\n2. 보내기 --> 바탕화면에 바로가기 만들기\n \n\n**TIP2**\n  - 설정 버튼을 누르시고 언어를 일본어에서 영어로 변경하십시오.\n\n   - 파일 선택 버튼을 누르시고 저장 영상 파일을 선택하십시오. \n\n-다운로드 링크\nhttps://drive.usercontent.google.com/download?id=1EtphkvkuCQqEdgkjZ6oOfvbCvFRRGkEr&export=download&authuser=0",
        "image": "assets/images/DVR Menu.jpg",
        "files": [],
        "author": "Admin"
    }
];

let supportProductData = [];
if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('supportProductData');
    if (stored) {
        supportProductData = JSON.parse(stored);
    } else {
        supportProductData = JSON.parse(JSON.stringify(initialSupport_productData));
    }
} else {
    supportProductData = initialSupport_productData;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = supportProductData;
}