const initialInstallData = [
    {
        "id": 1770615804817,
        "date": "2026-02-09",
        "title": "대구 핸즈 카오디오 무쏘EV 파워앰프 & 박스일체형 알파인 M770 서브우퍼 & 도어방음 시공!| 핸즈카오디오",
        "contentBlocks": [
            {
                "type": "text",
                "value": "무쏘EV\n\n​\n\n - 작업내용 -\n\n​\n\n 1. 파워앰프 & 서브우퍼 일체형 :\n\n알파인 PWE-M770\n\n​\n\n2. 기타 :\n\n사운드EQ셋팅\n\n​\n\n3. 도어방음 & 도어트림방진 :\n\n퓨어아날로그 방진패드\n\n​\n\n​\n\n안녕하세요.\n\n오픈마인드의 카오디오샵!\n\n핸즈카오디오 & 틴트컴퍼니입니다.\n\n카오디오와 관련한 모든 작업 및 \n\n썬팅, PPF, 전장장비 관련하여\n\n20년이상 쌓인 인스톨경험으로\n\n합리적인 대안을 제시합니다.\n\n​\n\n글라루스썬팅 공식대리점\n\n무스웨이 공식대리점\n\n덴마크 스캔스픽 공식대리점\n\n독일 문드로프 공식대리점\n\n마에스트로 공식대리점\n\n알파인 공식대리점\n\n파스(PHASS) 공식대리점\n\n어빌리티\n\n(소닉디자인, 어쿠어스틱하모니, 모렐,\n\n레인보우, 그라운드제로 등)\n\n...\n\n​\n\n다양한 솔루션을 합리적으로\n\n제안해드립니다.\n\n(앞산순환로673 검색하셔서 오세요.^^)\n[출처] 대구카오디오 무쏘EV 파워앰프 & 박스일체형 알파인 M770 서브우퍼 & 도어방음 시공!|작성자 핸즈카오디오"
            },
            {
                "type": "image",
                "value": "assets/images/무쏘EV.jpg"
            }
        ],
        "content": "무쏘EV\n\n​\n\n - 작업내용 -\n\n​\n\n 1. 파워앰프 & 서브우퍼 일체형 :\n\n알파인 PWE-M770\n\n​\n\n2. 기타 :\n\n사운드EQ셋팅\n\n​\n\n3. 도어방음 & 도어트림방진 :\n\n퓨어아날로그 방진패드\n\n​\n\n​\n\n안녕하세요.\n\n오픈마인드의 카오디오샵!\n\n핸즈카오디오 & 틴트컴퍼니입니다.\n\n카오디오와 관련한 모든 작업 및 \n\n썬팅, PPF, 전장장비 관련하여\n\n20년이상 쌓인 인스톨경험으로\n\n합리적인 대안을 제시합니다.\n\n​\n\n글라루스썬팅 공식대리점\n\n무스웨이 공식대리점\n\n덴마크 스캔스픽 공식대리점\n\n독일 문드로프 공식대리점\n\n마에스트로 공식대리점\n\n알파인 공식대리점\n\n파스(PHASS) 공식대리점\n\n어빌리티\n\n(소닉디자인, 어쿠어스틱하모니, 모렐,\n\n레인보우, 그라운드제로 등)\n\n...\n\n​\n\n다양한 솔루션을 합리적으로\n\n제안해드립니다.\n\n(앞산순환로673 검색하셔서 오세요.^^)\n[출처] 대구카오디오 무쏘EV 파워앰프 & 박스일체형 알파인 M770 서브우퍼 & 도어방음 시공!|작성자 핸즈카오디오\nassets/images/무쏘EV.jpg",
        "files": [],
        "author": "Admin"
    }
];

const INSTALL_DATA_VERSION = "2026-02-11-REV2";

let installData = [];
if (typeof localStorage !== 'undefined') {
    // Priority: LocalStorage > Initial File Data
    const stored = localStorage.getItem('installData');
    if (stored) {
        installData = JSON.parse(stored);
    } else {
        installData = JSON.parse(JSON.stringify(initialInstallData));
        localStorage.setItem('installData', JSON.stringify(installData));
    }
} else {
    installData = initialInstallData;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = installData;
}