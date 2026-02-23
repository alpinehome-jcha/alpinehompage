/**
 * i18n.js - Shared translation logic and data
 */

const translations = {
    ko: {
        // Navigation
        nav_about: '회사소개(About)',
        nav_products: '제품소개',
        nav_dealers: '전국 대리점 목록',
        nav_support: '고객지원',
        nav_support_product: '제품 자료실',
        nav_support_install: '시공자료실',
        nav_support_promo: '홍보자료실',
        nav_company: '회사소개',

        // Sections & Filters
        section_products: 'Product Lineup',
        filter_all: '전체',
        filter_others: '기타상품',

        // Footer
        footer_ceo: '대표 | 이정현',
        footer_address: '경기도 안양시 동안구 엘에스로 136, A동 1401호(호계동, 금정역2차SKV1타워)',
        footer_contact: 'TEL | 1670-7425   FAX | 031-477-7220',
        footer_hours: '상담시간 | 월~금 09:00~17:00 (토,일,공휴일 휴무)',
        footer_biz_info: '사업자등록번호 | 619-81-07276   개인정보보호책임자 | 한길전',
        footer_products: 'Products',
        footer_support: 'Support',
        footer_global: 'Global',
        footer_global_japan: '일본',
        footer_global_asia: '아시아',
        footer_global_australia: '호주',
        footer_global_europe: '유럽',
        footer_global_china: '중국',
        footer_global_na: '북미',

        // General UI
        btn_view: '자세히 보기',

        // About Page
        about_title: 'About Alpine',
        about_history_title: '알파인의 역사',
        history_1967: '알프스 전기와 모토로라 주식회사의 합작회사의 알프스 모토로라 주식회사가 설립 되었습니다.',
        history_1968: '최초 제품으로 8트랙 휴대용 플레이어 사업부가 시작되었습니다.',
        history_1969: '공장이 설립 되었습니다',
        history_1971: '8트랙 카트리지 플레이어 \'Handy-8\' 을 제조 및 판매를 개시했습니다.',
        history_1978: '알파인 전기로 변경해서 알파인 브랜드가 시작 되었습니다.',
        history_1981: '자동차 내비게이션 시스템\'Electro-Gyrocator\'를 공동 개발했습니다.',
        history_1987: '산업단지에 회사 건물이 완공되었습니다. Australia Pty, ltd. 사의 Alpine Electronics가 호주에 설립 되었습니다.',
        history_1988: '증권거래소 제2섹션에 알파인 주식이 상장 되었습니다',
        history_1991: '증권거래서 제1섹션에 알파인 주식이 상장 되었습니다',
        history_1995: 'Alpine Technology Manufacturing Co.,Ltd. 제조법인이 설립 되었습니다.',
        history_1998: 'Tech Audio와 총판 계약을 체결하며 태국 시장에 개시 하였습니다.',
        history_2000: '플래그십 시리즈 F#1 Status를 출시 했습니다.',
        history_2005: 'D.Power의 조사에서 알파인 자동차 내비게이션은 4년 연속 품질 1위를 차지했습니다.',
        history_2006: '자체 개발 시스템 플랫폼을 갖춘 mobile Media Station인 X07을 출시했습니다.',
        history_2007: '태평양 헤드쿼터로 태국의 Alpine Eledtronics of Asia Pacific이 설립되었습니다. 세계최초 아이팟용 헤드유닛 iDA-X001을 판매하였습니다.',
        history_2010: '인도지사를 설립했습니다.',
        history_2012: '중동지사를 설립했습니다.',
        history_2013: '시리즈는 2년 연속 J.D 파워카 내비게이션 고객만족상을 수상했습니다. 알파인 인도네시아가 자카르타에 설립되었습니다.',
        history_2014: 'Vision2020"의 새로인 기업 로고와 메시지를 발표했습니다.',
        history_2017: '50주년, Alpine Style 맞춤형 자동차를 판매 개시했으며, 일본 최초 공식 딜러를 오픈했습니다.',
        history_2024: '한국 총판 계약을 체결했습니다.',
        about_philosophy_title: '알파인 사운드 철학',
        phil_id_title: '알파인 ID',
        phil_id_desc: '알파인 ID는 사운드 이미징을 통해 이상적인 청취 경험을 달성하려는 알파인의 철학입니다. 완벽한 사운드 무대를 만들기 위해 알파인은 스튜디오 녹음 세션에서 사용자가 각 악기와 보컬의 위치를 인식하고, 이를 통해 청취자가 의도한 대로 음악을 경험할 수 있도록 하는 엔지니어링 최적화된 시스템 구성 요소에 중점을 둡니다. 차량의 환경은 사실적인 사운드 스테이지를 경험하는 것을 어렵게 만듭니다. 알파인 ID는 다음과 같은 부분에 중점을 두고 차량 내 사운드 성능에 대한 새로운 벤치마크를 만들어 이러한 문제를 해결합니다.',
        phil_amp_title: '앰프 위상 이동 및 감쇠 계수',
        phil_amp_desc: '위상 이동은 사운드 주파수의 도달 시간에 영향을 미쳐 부자연스러운 사운드 스테이지를 만듭니다. 알파인 ID 신제품은 왜곡을 방지하기 위해 스피커의 최대 전기 제어를 위한 전례 없는 높은 감쇠 계수를 갖추고 있으며 이상적인 영상 촬영을 위해 최소한의 위상 이동을 제공합니다.',
        phil_speaker_title: '스피커 디테일과 역학',
        phil_speaker_desc: '위상 이동은 사운드 주파수의 도달 시간에 영향을 미쳐 부자연스러운 사운드 스테이지를 만듭니다. 알파인 ID 신제품은 왜곡을 방지하기 위해 스피커의 최대 전기 제어를 위한 전례 없는 높은 감쇠 계수를 갖추고 있으며 이상적인 영상 촬영을 위해 최소한의 위상 이동을 제공합니다.',
        phil_sub_title: '서브우퍼 로컬화',
        phil_sub_desc: 'THD(전체 고조파 왜곡)가 높은 서브우퍼는 차량에서 현지화하기 쉬워 영상 촬영이 제대로 되지 않습니다. 출력을 높이면서도 THD를 줄이고 과도 응답을 극대화하기 위해 새로운 서브우퍼는 전체 전력 범위에서 제어 기능을 높였습니다.',
        phil_conclusion: '증폭기, 스피커 및 서브우퍼로 구성된 알파인의 최고급 X-시리즈는 알파인 ID 사양을 충족하도록 재설계된 첫 번째 제품입니다. 이 제품들은 처음부터 제작되었으며 최상의 사운드 이미징을 달성하기 위해 함께 사용하도록 설계되었습니다. 알파인의 R-시리즈 및 S-시리즈 제품은 향후 몇 년 동안 알파인 ID 사양으로 재건될 것이므로 세 시리즈의 제품 모두 최종적으로 분명히 알파인으로 식별된 사운드 이미징 DNA를 갖게 될 것입니다.',

        // Dealers Page
        cat_sound_master: '알파인 사운드 마스터',
        cat_team_alpine: '팀 알파인',
        cat_style_dist: '알파인스타일 총판',
        cat_regional_dist: '알파인 지역 총판',
        cat_dealer: '알파인 대리점'
    },
    en: {
        // Navigation
        nav_about: 'About Us',
        nav_products: 'Products',
        nav_dealers: 'Dealers',
        nav_support: 'Support',
        nav_support_product: 'Product Archives',
        nav_support_install: 'Installation Guides',
        nav_support_promo: 'Promo Materials',
        nav_company: 'Company',

        // Sections & Filters
        section_products: 'Product Lineup',
        filter_all: 'All',
        filter_others: 'Others',

        // Footer
        footer_ceo: 'CEO | Martin Lee',
        footer_address: '1401, A-dong, 136, LS-ro, Dongan-gu, Anyang-si, Gyeonggi-do, Republic of Korea',
        footer_contact: 'TEL | +82-1670-7425   FAX | +82-31-477-7220',
        footer_hours: 'Hours | Mon-Fri 09:00-17:00 (Closed on Sat, Sun, Holidays)',
        footer_biz_info: 'Biz Reg No. | 619-81-07276   Privacy Officer | Giljeon Han',
        footer_products: 'Products',
        footer_support: 'Support',
        footer_global: 'Global',
        footer_global_japan: 'Japan',
        footer_global_asia: 'Asia',
        footer_global_australia: 'Australia',
        footer_global_europe: 'Europe',
        footer_global_china: 'China',
        footer_global_na: 'North America',

        // General UI
        btn_view: 'View Details',

        // About Page
        about_title: 'About Alpine',
        about_history_title: 'Alpine History',
        history_1967: 'Alps Motorola Co., Ltd. was established as a joint venture between Alps Electric and Motorola Inc.',
        history_1968: 'The 8-track portable player division was launched as the first product.',
        history_1969: 'The factory was established.',
        history_1971: 'Manufacturing and sales of the 8-track cartridge player "Handy-8" began.',
        history_1978: 'The company name was changed to Alpine Electronics, marking the start of the Alpine brand.',
        history_1981: 'Co-developed the "Electro-Gyrocator" car navigation system.',
        history_1987: 'The company building was completed in the industrial complex. Alpine Electronics of Australia Pty, Ltd. was established.',
        history_1988: 'Alpine stock was listed on the Second Section of the Stock Exchange.',
        history_1991: 'Alpine stock was listed on the First Section of the Stock Exchange.',
        history_1995: 'Alpine Technology Manufacturing Co., Ltd. manufacturing corporation was established.',
        history_1998: 'Entered the Thai market by signing a distributorship agreement with Tech Audio.',
        history_2000: 'Launched the flagship series F#1 Status.',
        history_2005: 'Alpine car navigation ranked 1st in quality for 4 consecutive years in the J.D. Power survey.',
        history_2006: 'Launched X07, a mobile Media Station with a self-developed system platform.',
        history_2007: 'Alpine Electronics of Asia Pacific was established in Thailand as the Pacific headquarters. World\'s first iPod head unit iDA-X001 was sold.',
        history_2010: 'Established India branch.',
        history_2012: 'Established Middle East branch.',
        history_2013: 'The series won the J.D. Power Car Navigation Customer Satisfaction Award for two consecutive years. Alpine Indonesia was established in Jakarta.',
        history_2014: 'Announced the new corporate logo and message "Vision2020".',
        history_2017: '50th Anniversary. Started sales of Alpine Style custom cars and opened the first official dealer in Japan.',
        history_2024: 'Signed a Korean distributorship agreement.',
        about_philosophy_title: 'Alpine Sound Philosophy',
        phil_id_title: 'Alpine ID',
        phil_id_desc: 'Alpine ID is Alpine\'s philosophy to achieve the ideal listening experience through sound imaging. To create the perfect sound stage, Alpine focuses on engineering-optimized system components that allow users to perceive the position of each instrument and vocal from a studio recording session, thereby experiencing music as intended by the listener. The car environment makes it difficult to experience a realistic sound stage. Alpine ID solves these problems by creating new benchmarks for in-car sound performance focusing on the following areas:',
        phil_amp_title: 'Amplifier Phase Shift and Damping Factor',
        phil_amp_desc: 'Phase shift affects the arrival time of sound frequencies, creating an unnatural sound stage. Alpine ID new products feature an unprecedented high damping factor for maximum electrical control of speakers to prevent distortion and provide minimal phase shift for ideal imaging.',
        phil_speaker_title: 'Speaker Detail and Dynamics',
        phil_speaker_desc: 'Phase shift affects the arrival time of sound frequencies, creating an unnatural sound stage. Alpine ID new products feature an unprecedented high damping factor for maximum electrical control of speakers to prevent distortion and provide minimal phase shift for ideal imaging.',
        phil_sub_title: 'Subwoofer Localization',
        phil_sub_desc: 'Subwoofers with high THD (Total Harmonic Distortion) are easily localized in the vehicle, resulting in poor imaging. To maximize transient response while reducing THD even at high output, new subwoofers have increased control across the entire power range.',
        phil_conclusion: 'Alpine\'s top-of-the-line X-Series consisting of amplifiers, speakers, and subwoofers are the first products redesigned to meet Alpine ID specifications. These products were built from the ground up and designed to be used together to achieve the best sound imaging. Alpine\'s R-Series and S-Series products will be rebuilt to Alpine ID specifications over the next few years, so products in all three series will eventually have sound imaging DNA clearly identified as Alpine.',

        // Dealers Page
        cat_sound_master: 'Alpine Sound Master',
        cat_team_alpine: 'Team Alpine',
        cat_style_dist: 'Alpine Style Distributor',
        cat_regional_dist: 'Alpine Regional Distributor',
        cat_dealer: 'Alpine Dealer'
    }
};

/**
 * Apply selected language to the page
 * @param {string} newLang 'ko' or 'en'
 */
function applyLanguage(newLang) {
    const langText = document.querySelector('.curr-lang');
    if (langText) langText.textContent = newLang.toUpperCase();
    localStorage.setItem('lang', newLang);

    // Switch Footer Logo
    const footerLogo = document.getElementById('footer-logo-img');
    if (footerLogo) {
        const currentSrc = footerLogo.getAttribute('src');
        // Extract the path before the filename (e.g., "../assets/images/")
        const pathPrefix = currentSrc.substring(0, currentSrc.lastIndexOf('/') + 1);
        footerLogo.src = pathPrefix + (newLang === 'en' ? 'jch_logo_en.png' : 'jch_logo.png');
    }

    // Update i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[newLang] && translations[newLang][key]) {
            el.textContent = translations[newLang][key];
        }
    });

    // Special case for detail buttons in index.html (if they don't use data-i18n)
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.textContent = translations[newLang].btn_view;
    });

    // Price Conversion (Index page)
    const exchangeRate = 1400;
    document.querySelectorAll('.product-price[data-price-krw]').forEach(priceEl => {
        const krw = parseInt(priceEl.getAttribute('data-price-krw'), 10);
        if (newLang === 'en') {
            const usd = Math.round(krw / exchangeRate);
            priceEl.textContent = '$' + usd.toLocaleString('en-US');
        } else {
            priceEl.textContent = '₩' + krw.toLocaleString('ko-KR');
        }
    });
}

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Init Language from Storage
    const savedLang = localStorage.getItem('lang') || 'ko';
    applyLanguage(savedLang);
});

// 이벤트 위임: layout.js가 헤더를 동적으로 렌더링한 후에도 클릭이 잡힘
document.addEventListener('click', (e) => {
    const toggle = e.target.closest('.lang-toggle');
    if (!toggle) return;
    e.preventDefault();
    const langText = document.querySelector('.curr-lang');
    const currentLang = langText ? langText.textContent.trim().toLowerCase() : 'ko';
    const newLang = currentLang === 'ko' ? 'en' : 'ko';
    applyLanguage(newLang);
});
