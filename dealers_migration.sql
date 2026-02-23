-- ============================================================
-- ALPINE Korea - Supabase dealers 테이블 생성 및 데이터 일괄 삽입
-- Supabase 대시보드 → SQL Editor에서 복사하여 실행하세요.
-- 기존 users 테이블과 분리되어 웹사이트에 표시될 대리점 정보를 담당합니다.
-- ============================================================

-- 1. dealers 테이블 생성
CREATE TABLE IF NOT EXISTS public.dealers (
    id BIGINT PRIMARY KEY,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    badge TEXT,
    address TEXT,
    phone TEXT,
    "desc" TEXT,
    username TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    region TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS(Row Level Security) 활성화
ALTER TABLE public.dealers ENABLE ROW LEVEL SECURITY;

-- 2.1 누구나 데이터를 읽을 수 있게 허용 (지도, 리스트 화면용)
CREATE POLICY "Allow public read access to dealers"
ON public.dealers
FOR SELECT
USING (true);

-- 2.2 인증/익명 여부 관계없이 수정 가능하도록 임시 허용
-- (현재 홈페이지 구조상 admin.html에서 anon 키로 직접 DB 통신하므로 전체 허용)
CREATE POLICY "Allow all insert/update/delete for dealers"
ON public.dealers
FOR ALL
USING (true)
WITH CHECK (true);

-- 3. 기존 대리점 데이터 일괄 삽입
INSERT INTO public.dealers (id, category, name, badge, address, phone, "desc", username, lat, lng, region) VALUES
(1, 'Alpine Sound Master', '가인 오디오', '알파인사운드마스터', '경기도 안양시 만안구 안양로 21', '010-8545-5311', 'F#1 Status 및 알파인 모든 사운드 시스템을 취급합니다.', 'gain', 37.3887, 126.9238, '경기중앙(성남,안양,용인,과천)'),
(2, 'Team Alpine', '개구리 카오디오', 'Team Alpine', '경기도 성남시 분당구 대왕판교로 255', '010-5283-6277', 'F#1 Status 및 알파인 모든 사운드 시스템을 취급합니다.', 'Frog', 35.1796, 129.0756, '경기중앙(성남,안양,용인,과천)'),
(3, 'Team Alpine', '카오디오팩토리', 'Team Alpine', '경기도 화성시 동탄구 여울로4길 15 1층', '010-6580-1975', '알파인 모든 사운드 시스템을 취급합니다.', 'caraudiofactory', 35.8714, 128.6014, '경기남부(수원,화성,평택,안성)'),
(4, 'Team Alpine', '럭셔리 카클럽', 'Team Alpine', '경기도 양주시 부흥로 1324', '010-9956-3618', 'F#1 Status 및 알파인 모든 사운드 시스템을 취급합니다.', 'luxury', 37.4563, 126.7052, '경기북부(고양,파주,의정부,양주)'),
(5, 'Team Alpine', '오토갤러리', 'Team Alpine', '서울특별시 송파구 새말로 176 트윈팰리스101동 102호', '010-5220-8034', '알파인 모든 사운드 시스템을 취급합니다.', 'autogallery', 35.1595, 126.8526, '서울'),
(6, 'Team Alpine', '카투오디오', 'Team Alpine', '경기도 성남시 중원구 둔촌대로64번길 4-16(101호)', '010-3597-1735', 'F#1 Status 및 알파인 모든 사운드 시스템을 취급합니다.', 'catooaudio', 36.3504, 127.3845, '경기중앙(성남,안양,용인,과천)'),
(1770248942602, 'Team Alpine', '썬카팩토리', 'Team Alpine', '인천광역시 서구 봉수대로 166 2동 101호', '010-9773-9882', '알파인 모든 사운드 시스템을 취급합니다.', 'suncarfactory', NULL, NULL, '인천'),
(1770249019903, 'Team Alpine', '사운드테크닉', 'Team Alpine', '경기도 광명시 금오로 745', '010-4764-7777', '알파인 모든 사운드 시스템을 취급합니다.', 'soundtechnic', NULL, NULL, '경기서부(김포,부천,광명,안산)'),
(1770249089862, 'Team Alpine', '광주카오디오', 'Team Alpine', '광주광역시 남구 독립로 163', '010-3627-9072', '알파인 모든 사운드 시스템을 취급합니다.', 'gwangju', NULL, NULL, '광주'),
(1770249157344, 'Team Alpine', '사운드째즈', 'Team Alpine', '제주특별자치도 제주시 연삼로 124', '010-3693-9499', '알파인 모든 사운드 시스템을 취급합니다.', 'soundjazz', NULL, NULL, '제주'),
(1770249233020, 'Team Alpine', '퍼니사운드', 'Team Alpine', '전북특별자치도 전주시 덕진구 쪽구름2길 34 1층 101호', '010-5123-9255', '알파인 모든 사운드 시스템을 취급합니다.', 'funnysound', NULL, NULL, '전북'),
(1770249301228, 'Team Alpine', '레트로카오디오', 'Team Alpine', '강원특별자치도 속초시 청호로 40', '010-6879-9255', '알파인 모든 사운드 시스템을 취급합니다.', 'retrocaraudio', NULL, NULL, '강원'),
(1770249368030, 'Team Alpine', '사운드로우', 'Team Alpine', '서울특별시 영등포구 도림로 2633 현대빌딩', '010-3606-7521', '알파인 모든 사운드 시스템을 취급합니다.', 'soundraw', NULL, NULL, '서울'),
(1770249535832, 'Alpine Style Distributor', '바이지츠아우토', 'AlpineStyle', '경기도 하남시 대성로169번길 34', '010-9126-9223', '알파인 테슬라패키지, 알파인 디지털룸미러, 메티오사운드, 알파인 OEM Fit', 'beisitauto01', NULL, NULL, '경기동부(남양주,하남,이천,양평)'),
(1770249644286, 'Alpine Dealer', '사운드닥터', 'Alpine Sound', '부산광역시 강서구 대저중앙로 139', '010-4855-8949', 'F#1 Status 및 알파인 모든 사운드 시스템을 취급합니다.', 'sounddoctor', NULL, NULL, '부산'),
(1770251069642, 'Alpine Dealer', '사우스타운카오디오', 'Alpine Sound', '광주광역시 광산구 북문대로 605 101호', '010-8621-0996', '알파인 모든 사운드 시스템을 취급합니다.', 'southtowncaraudio', NULL, NULL, '광주'),
(1770251199375, 'Alpine Dealer', '맥스카오디오', 'Alpine Sound', '광주광역시 광산구 송도로85번길 30', '010-3161-2169', '알파인 모든 사운드 시스템을 취급합니다.', 'maxcaraudio', NULL, NULL, '광주'),
(1770251278146, 'Alpine Dealer', '뷰티풀사운드', 'Alpine Audio', '경기도 용인시 처인구 포곡읍 금어리 636', '010-6449-4738', '알파인 모든 사운드 시스템을 취급합니다.', 'beautifulsound', NULL, NULL, '경기중앙(성남,안양,용인,과천)'),
(1770251356239, 'Alpine Dealer', '일루션사운드', 'Alpine Sound', '경기도 화성시 효행구 기안동 222-2', '010-2883-8158', '알파인 모든 사운드 시스템을 취급합니다.', 'illusionsound', NULL, NULL, '경기남부(수원,화성,평택,안성)'),
(1770251431563, 'Alpine Dealer', '사운드포럼', 'Alpine Sound', '충청북도 제천시 의림대로 590', '010-8382-8400', '알파인 모든 사운드 시스템을 취급합니다.', 'soundforum', NULL, NULL, '충북'),
(1770251555171, 'Alpine Dealer', '오토사운드21', 'Alpine Sound', '서울특별시 마포구 백범로 36', '010-8993-9959', '알파인 모든 사운드 시스템을 취급합니다.', 'autosound21', NULL, NULL, NULL),
(1770251639994, 'Alpine Dealer', '프로카사운드', 'Alpine Sound', '경기도 성남시 수정구 성남대로1542번길 43-12 101호', '010-9023-2585', '알파인 모든 사운드 시스템을 취급합니다.', 'procarsound', NULL, NULL, '경기중앙(성남,안양,용인,과천)'),
(1770251746434, 'Alpine Dealer', '카사운드파크', 'Alpine Sound', '경기도 화성시 동탄구 10용사3길 3-1 (반송동) 1층', '010-7109-1185', '알파인 모든 사운드 시스템을 취급합니다.', 'carsoundpark', NULL, NULL, '경기남부(수원,화성,평택,안성)'),
(1770251812987, 'Alpine Dealer', '카사운드메이커', 'Alpine Sound', '전북특별자치도 익산시 익산대로 68', '010-2618-2455', '알파인 모든 사운드 시스템을 취급합니다.', 'carsoundmaker', NULL, NULL, '전북'),
(1770251885018, 'Alpine Dealer', '퀄리티하우스', 'Alpine Sound', '충청남도 아산시 삼동로 70', '010-4816-9221', '알파인 모든 사운드 시스템을 취급합니다.', 'qualityhouse', NULL, NULL, '충남'),
(1770251944630, 'Alpine Dealer', '현대카오디오', 'Alpine Sound', '경기도 구리시 수택동 430', '010-3795-4826', '알파인 모든 사운드 시스템을 취급합니다.', 'hyundaicaraudio', NULL, NULL, '경기동부(남양주,하남,이천,양평)'),
(1770252017508, 'Alpine Dealer', '제이에이치사운드', 'Alpine Sound', '경상남도 김해시 구지로 181 1층(동상동)', '010-7670-1613', '알파인 모든 사운드 시스템을 취급합니다.', 'jhsound', NULL, NULL, '경남'),
(1770252102820, 'Alpine Dealer', '에이치코드카오디오', 'Alpine Sound', '서울특별시 서초구 바우뫼로 140 1층', '010-2783-7775', '알파인 모든 사운드 시스템을 취급합니다.', 'hcodecaraudio', NULL, NULL, NULL),
(1770252184174, 'Alpine Dealer', '카사운드메이커(서울)', 'Alpine Sound', '서울특별시 서초구 강남대로101안길 36', '010-2618-2455', '알파인 모든 사운드 시스템을 취급합니다.', 'carsoundmaker01', NULL, NULL, NULL),
(1770252250504, 'Alpine Dealer', '파워뱅크하우스', 'Alpine Sound', '대전광역시 서구 도산로 465', '010-5407-4999', '알파인 모든 사운드 시스템을 취급합니다.', 'powerbankhouse', NULL, NULL, '대전'),
(1770252302728, 'Alpine Dealer', '에이스카프라자', 'Alpine Sound', '대전광역시 중구 충무로 105 (대사동) 우측 에이스카프라자', '010-2055-5082', '알파인 모든 사운드 시스템을 취급합니다.', 'acecarplaza', NULL, NULL, '대전'),
(1770252367530, 'Alpine Dealer', '트로피칼사운드', 'Alpine Sound', '서울특별시 서초구 강남대로6길 108-4 (양재동) 1층 트로피칼사운드(양재동)', '010-5853-6659', '알파인 모든 사운드 시스템을 취급합니다.', 'tropicalsound', NULL, NULL, NULL),
(1770252423184, 'Alpine Dealer', '커스텀사운드', 'Alpine Sound', '부산광역시 강서구 평강로397번길 4', '010-3896-1053', '알파인 모든 사운드 시스템을 취급합니다.', 'customsound', NULL, NULL, '부산'),
(1770252538684, 'Alpine Dealer', '아인스아우토', 'Alpine Sound', '울산광역시 남구 돋질로 113', '010-4530-8465', '알파인 모든 사운드 시스템을 취급합니다.', 'einsauto', NULL, NULL, '울산'),
(1770252612776, 'Alpine Dealer', '라우러사운드', 'Alpine Sound', '경상남도 함안군 칠원읍 경남대로 1742', '010-7114-7499', '알파인 모든 사운드 시스템을 취급합니다.', 'loudersound', NULL, NULL, '경남'),
(1770252674996, 'Alpine Dealer', '핸즈카오디오', 'Alpine Sound', '대구광역시 남구 효성로 15 미리내맨션 상가', '010-9077-6658', '알파인 모든 사운드 시스템을 취급합니다.', 'handscaraudio', NULL, NULL, '대구'),
(1770252725836, 'Alpine Dealer', '째즈카오디오', 'Alpine Sound', '대구광역시 서구 국채보상로 21', '010-7543-9009', '알파인 모든 사운드 시스템을 취급합니다.', 'jazzcaraudio', NULL, NULL, '대구'),
(1770252770959, 'Alpine Dealer', '사운드프로', 'Alpine Sound', '대구광역시 남구 대명복개로 156-1 (대명동) 1층', '010-3312-7980', '알파인 모든 사운드 시스템을 취급합니다.', 'soundpro', NULL, NULL, '대구'),
(1770252813652, 'Alpine Dealer', '772카오디오', 'Alpine Sound', '경상북도 경산시 장산로 142', '010-3812-7292', '알파인 모든 사운드 시스템을 취급합니다.', '772caraudio', NULL, NULL, '대구'),
(1770252968891, 'Alpine Dealer', '로드마인', 'Alpine Sound', '서울특별시 중랑구 용마산로139나길 91', '010-9188-0897', 'Jimny 전용 메티오사운드', 'roadmine', NULL, NULL, NULL),
(1770253046567, 'Alpine Dealer', '오성카오디오', 'Alpine Sound', '부산광역시 수영구 광남로 171', '010-4513-5513', '알파인 모든 사운드 시스템을 취급합니다.', 'ohsungcaraudio', NULL, NULL, '부산'),
(1770253137261, 'Alpine Dealer', '페이즈카오디오', 'Alpine Sound', '부산광역시 금정구 범어천로 14', '010-9688-0199', '알파인 모든 사운드 시스템을 취급합니다.', 'phasecaraudio', 35.2690732, 129.0900833, '부산'),
(1770253229315, 'Alpine Dealer', '미스트랄카오디오', 'Alpine Sound', '경상남도 창원시 진해구 충장로 195', '010-9953-0757', 'Hi-Fi 전문, F#1 Status와 Alpine Status 전', 'mistralcaraudio', NULL, NULL, '경남')
ON CONFLICT (id) DO UPDATE SET
category = EXCLUDED.category,
name = EXCLUDED.name,
badge = EXCLUDED.badge,
address = EXCLUDED.address,
phone = EXCLUDED.phone,
"desc" = EXCLUDED."desc",
username = EXCLUDED.username,
lat = EXCLUDED.lat,
lng = EXCLUDED.lng,
region = EXCLUDED.region,
updated_at = NOW();
