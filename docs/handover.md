# Alpine Homepage Migration Handover (2026-04-25 갱신)

본 문서는 Supabase 클라우드에서 로컬 인프라로의 데이터 이관 및 시스템 전환 작업에 대한 최신 진행 상황입니다.

---

## 1. 데이터 이관 (Data Migration) 완료
- **대상**: 클라우드 Supabase `public` 스키마 ➡️ 로컬 Supabase `alpine-home` 스키마
- **범위**: 주요 테이블 13개
- **정합성**: 클라우드와 로컬 간 행(Row) 수 및 데이터 무결성 검증 완료 (`✅ MATCH`)
- **이관 방식**: n8n 워크플로우를 통한 자동 추출 및 변환(HEX 인코딩 포함) 주입

## 2. 시스템 전환 (Mode Switch) 완료
- **환경 변수**: `.env.local`의 `DB_MODE`를 `local`로 공식 전환
- **클라이언트 설정**: `js/config.js`를 신규 생성/배포하여 브라우저에서 로컬 API(`183.101.105.167:8000`)를 참조하도록 설정
- **전수 패치**: 120여 개의 제품 상세 페이지 및 메인 페이지를 포함한 모든 HTML 파일에 `config.js` 스크립트 주입 완료

---

## 3. 2차 세션 버그 수정 (2026-04-25)

### 3-1. JS 파일 인코딩 손상 복원
- **증상**: `product-data.js`, `estimate-data.js`에서 `Uncaught SyntaxError: Invalid or unexpected token`
- **원인**: 두 파일이 HEAD 커밋 이후 재생성 과정에서 한국어 문자열 인코딩이 손상됨 (EUC-KR 바이트가 UTF-8 문자열 내에 삽입되어 `"`가 포함된 것처럼 파싱됨)
- **해결**: `git checkout HEAD -- js/estimate-data.js js/product-data.js`로 복원

### 3-2. PnP 데이터 중복 선언 오류 수정
- **증상**: `Uncaught SyntaxError: Identifier 'pnpSearchData' has already been declared`, `'pnpRuleData' has already been declared`
- **원인**: `index.html`이 `pnp-search-data.js`(line 841), `pnp-rule-data.js`(line 1190)를 정적으로 로드하는 동시에, `estimate-ui.js`의 `loadDataScripts()`가 동일 파일을 `?t=` 타임스탬프로 동적 재로드하여 `const`/`let` 중복 선언 발생
- **해결**: `js/pnp-search-data.js`의 `const pnpSearchData` → `var pnpSearchData`, `js/pnp-rule-data.js`의 `const initialPnpRuleData`, `const PNP_RULE_DATA_VERSION`, `let pnpRuleData` → 모두 `var`로 변경

### 3-3. 로컬 Supabase 401 Unauthorized 해결 (진행 중)
- **증상**: `GET http://183.101.105.167:8000/rest/v1/price_list` → 401, `Error fetching price list`
- **근본 원인 분석**:
  - Kong 게이트웨이는 클라우드 ANON_KEY(`ref=tlgjgworselvkaatdftz`)로 서명된 토큰만 통과
  - PostgREST(`supabase-rest`)는 로컬 `JWT_SECRET`으로 서명된 토큰만 수용 → 양측이 서로 다른 시크릿 사용으로 어떤 키도 통과 불가
- **해결 과정**:
  1. **config.js ANON_KEY 교체**: 클라우드 ANON_KEY(`SUPABASE_ANON_KEY`)를 로컬 모드에도 적용 (Kong 통과 가능)
     - `js/config.js` `LOCAL.ANON_KEY` → 클라우드 ANON_KEY
     - `.env.local` `NEXT_PUBLIC_LOCAL_SUPABASE_ANON_KEY` → 클라우드 ANON_KEY
  2. **서버 PostgREST JWT_SECRET 교체**: 서버의 `/home/jchauto/supabase/docker/.env`에서
     - `JWT_SECRET` → 클라우드 JWT Secret (`/Z9fFlBTMZ3M46bo...UK3g==`)
     - `JWT_KEYS` → 동일하게 클라우드 JWT Secret으로 교체
     - `docker compose up -d rest`로 재생성
  3. **PostgREST 스키마 노출 추가**: `PGRST_DB_SCHEMAS`에 `alpine-home`, `T-PPO` 추가 후 재생성

- **현재 상태 (미완료)**: `alpine-home` 스키마 접근 시 `permission denied for schema alpine-home` (PostgreSQL 42501)
  - Kong 인증: ✅ 통과 (HTTP 200, public 스키마)
  - PostgREST JWT 검증: ✅ 통과
  - `alpine-home` 스키마 권한: ❌ `anon`, `authenticated` 롤에 USAGE 권한 미부여

- **다음 작업 (서버에서 실행 필요)**:
  - `anon`, `authenticated` 롤의 `alpine-home` 스키마 접근 권한 부여
  - 아래 SQL 실행 필요:
    ```sql
    -- 스키마 소유자 및 롤 존재 확인 먼저
    SELECT schema_name, schema_owner FROM information_schema.schemata WHERE schema_name = 'alpine-home';
    SELECT rolname FROM pg_roles WHERE rolname IN ('anon', 'authenticated');

    -- 만약 롤이 존재한다면:
    GRANT USAGE ON SCHEMA "alpine-home" TO anon, authenticated;
    GRANT SELECT ON ALL TABLES IN SCHEMA "alpine-home" TO anon, authenticated;
    ALTER DEFAULT PRIVILEGES IN SCHEMA "alpine-home" GRANT SELECT ON TABLES TO anon, authenticated;
    ```
  - 이전 시도에서 `WARNING: no privileges were granted for "alpine-home"` 발생 → 스키마 소유자 확인 및 권한 부여 방식 재검토 필요

---

## 4. 서버 인프라 정보
- **로컬 서버 IP**: `183.101.105.167`
- **Kong API Gateway**: `:8000`
- **PostgreSQL**: `:8282` (사용자: postgres, PW: `JCHA_Supabase-Antigravity_2026`)
- **Supabase docker 경로**: `/home/jchauto/supabase/docker/`
- **환경파일**: `/home/jchauto/supabase/docker/.env`
- **클라우드 ANON_KEY**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZ2pnd29yc2VsdmthYXRkZnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MTE4MTUsImV4cCI6MjA4NzM4NzgxNX0.GUiDsLVI3UNZdr8i5aQtSYkt44vqbrZ1OcuoYWzp7us`
- **클라우드 JWT Secret**: `/Z9fFlBTMZ3M46boWuHYBV1DtrZWZ3gulMciLxtonIWbKQV2jy1lZbYBGE8Q0/giRnKR4MCD51KWwJv6U3UK3g==`
- **로컬 JWT Secret (현재 PostgREST 설정 교체됨)**: `z7k9P2wX5mR8vB1nQ4jT6hG3fD9sA0yC2xL5pZ8q/Z9fFlBTMZ3M46boWuHYBV1DtrZWZ3gulMciLxtonIWbKQV2jy1lZbYBGE8Q0/giRnKR4MCD51KWwJv6U3UK3g==`

## 5. 현재 상태 요약
- **개발 서버**: `http://localhost:3000` (Python http.server 또는 로컬 서버)
- **DB 모드**: `Local` (로컬 인프라 직접 연동)
- **JS 에러**: product-data.js, estimate-data.js SyntaxError ✅ 해결 / pnp 중복선언 ✅ 해결
- **401 인증**: Kong + PostgREST JWT ✅ 해결
- **스키마 권한**: `alpine-home` anon 롤 권한 ❌ 미완료

## 6. 3차 세션 버그 수정 (2026-04-25)

### 6-1. 데이터 정합성 검수 완료
- `alpine-home` 스키마 13개 테이블 로컬 ↔ 클라우드 행 수 비교
- **12개 MATCH**, `inbound_analytics` 5행 차이 → 이관 후 오늘 생성된 신규 방문 로그 (마이그레이션 결함 아님)
- 방문 추적 JS가 아직 클라우드로 기록 중 → 추후 로컬 전환 필요
- PGRST205 캐시 오류: **없음** (13개 전체 정상)

### 6-2. PowerShell 주입 손상 수정
- **증상**: 제품 상세 페이지 콘솔 `fetchPriceList not available, using fallback`
- **원인**: PowerShell 스크립트가 `<script>` 태그 삽입 시 `[char]60`, `[char]62` 리터럴을 `src` 속성 안에 그대로 삽입 → `config.js` + `supabase-client.js` 둘 다 로드 실패
- **수정**: `pages/products/` 하위 **140개** HTML 파일 일괄 교체 → 잔존 0개

### 6-3. 카테고리 탭 404 수정
- **증상**: 제품 상세 페이지 카테고리 탭 클릭 시 `pages/index.html` 404
- **원인**: `goToCategory()` 내 `'../index.html'` → `pages/products/` 기준으로 `pages/index.html` (미존재) 이동
- **참고**: Vercel은 SPA 폴백으로 루트 `index.html`을 서빙해 우연히 동작했음
- **수정**: `pages/products/` 하위 **140개** HTML 파일 `'../index.html'` → `'../../index.html'` 일괄 변경

### 6-7. localStorage 스테일 캐시 재발 방지 (2026-04-25 추가)
- **증상**: JS 파일 복원 후에도 인코딩 손상 데이터가 계속 표시
- **원인**: `support/install.html`, `product.html`, `promo.html`이 localStorage를 정적 JS 파일보다 우선 사용 → 한 번 손상된 데이터가 localStorage에 남아 재발
- **수정**: 세 파일 모두 버전 검사 로직 추가
  - 읽기 시 `{key}_version` (첫 항목 id)과 `initialXxxData[0].id` 비교 → 불일치 시 localStorage 자동 삭제 후 JS 파일 데이터 사용
  - 쓰기 시 `{key}_version` 함께 저장

### 6-6. JS data 파일 인코딩 손상 일괄 복원 (2026-04-25 추가)
- **증상**: `support/install.html` 갤러리 목록 한국어 깨짐, 기타 페이지 잠재적 오류
- **원인**: git status 수정된 JS 파일 중 7개가 UTF-8 인코딩 손상 (EUC-KR 바이트 혼입)
- **손상 파일**: `admin-data-manager.js`, `dealer-data.js`, `labor-rule-data.js`, `popup-data.js`, `price-data.js`, `promo-data.js`, `resource-data.js`
- **수정**: `git checkout HEAD --` 로 7개 파일 일괄 복원, 전체 UTF-8 검증 통과
- **주의**: 이 파일들은 재생성 과정에서 반복적으로 손상되는 패턴 — 향후 재생성 시 UTF-8 인코딩 명시 필수

### 6-5. support 페이지 config.js 누락 및 support-product-data.js 인코딩 손상 수정
- **증상**: `support/product.html` — `CONFIG is not loaded` 경고 + `SyntaxError: Invalid or unexpected token`
- **원인 1**: `support/*.html` 6개 파일에 `config.js` 스크립트 태그가 없어 `supabase-client.js`가 클라우드 폴백으로 동작
- **원인 2**: `js/support-product-data.js` 한국어 문자열 인코딩 손상 (이전 재생성 과정에서 발생)
- **수정 1**: `support/product.html`, `install.html`, `partner-board.html`, `price-input.html`, `price-list.html`, `promo.html` 6개에 `../js/config.js` 태그 삽입
- **수정 2**: `git checkout HEAD -- js/support-product-data.js`로 복원

### 6-4. auth.js 로그인 경로 수정
- **증상**: 제품 상세 페이지에서 Login 클릭 또는 미인증 접근 시 `pages/products/login.html` 404
- **원인**: `auth.js`의 경로 계산 로직이 `/pages/products/`를 `/pages/`와 동일하게 처리 → `login.html` (상대경로) → `pages/products/login.html`
- **수정**: `js/auth.js` — `checkAuthAndRedirect()` 및 `authLink.href` 설정 두 곳에 `/pages/products/` 분기 추가 (`loginPath = '../login.html'`)

---

## 7. GEO (Generative Engine Optimization) 검토 결과 (2026-04-25)

LLM 엔진(Gemini, Claude 등)에 잘 노출되는지 분석. **종합 점수: 52/100**

### 7-1. 현황 요약

| 항목 | 상태 | 비고 |
|------|------|------|
| 자연어 콘텐츠 | ✅ 우수 | 제품 상세 페이지 설명 충실 |
| 브랜드/엔티티 명확성 | ✅ 우수 | 회사명·연락처·소셜 일관성 있음 |
| sitemap.xml / robots.txt | ✅ 완비 | 전 페이지 포함, Sitemap 경로 명시 |
| 언어 선언 | ✅ 정상 | `<html lang="ko">` |
| 제품 페이지 canonical | ✅ 있음 | 각 제품 페이지에 정적 설정 |
| 제품 페이지 og: 메타 태그 | ✅ 있음 | title, description, image, url |
| 루트 페이지 메타 태그 | ❌ 없음 | description, og:*, twitter:* 전무 |
| JSON-LD 스키마 | ⚠️ 부분 | JS 동적 생성 → 크롤러 인식 불가 |
| 루트 페이지 h1 | ❌ 없음 | h2로 시작, 페이지 주제 불명확 |
| 로딩 최적화 | ⚠️ 미흡 | preload/prefetch 없음 |

### 7-2. 향후 개선 작업 (미완료)

#### 🔴 1순위 — 빠른 효과 (루트 index.html)
- `<meta name="description">` 추가
- `<meta property="og:title/description/image/url">` 추가
- `<meta name="twitter:card/title/description">` 추가
- `<h1>` 태그 추가 (현재 h2로 시작)
- `<link rel="canonical">` 추가

#### 🟡 2순위 — 제품 페이지 스키마 정적화 (140개 파일)
- 현재 Product·BreadcrumbList JSON-LD가 JavaScript 동적 생성
- LLM 크롤러는 JS 실행 전 HTML만 읽으므로 스키마 인식 불가
- 정적 `<script type="application/ld+json">` 블록으로 전환 필요

#### 🟢 3순위 — 선택 개선
- `og:image` 에 width/height 속성 추가
- 폰트·이미지에 `<link rel="preload">` 추가
- 지원 페이지에 `FAQPage` 스키마 추가

---

MD 파일 추가 기록 사항 (2026-04-25 작업 완료 보고)
1. [완료] 로컬 Supabase 스키마 권한 및 데이터 연결 성공
권한 해결: supabase_admin 계정을 통해 alpine-home 및 T-PPO 스키마에 대한 USAGE, SELECT, DEFAULT PRIVILEGES 부여 완료.

연결 확인: PostgREST API(:8000)를 통해 alpine-home 스키마 데이터 조회 성공.

데이터 검증 결과:

dealers: 623개 행 정상 로드 완료.

price_list: id, category, product_category, product, msrp, dist_price, dealer_price, sort_order 등의 컬럼 구조 확인 완료. (주의: name 컬럼은 존재하지 않으며 product 컬럼을 사용해야 함)

2. [현황] 환경 설정 정보 요약
API Endpoint: http://183.101.105.167:8000/rest/v1 (SSH 터널링 시 localhost:8989)

Key 정보:

ANON_KEY: eyJhbGciOiJIUzI1Ni... (JWT Secret /Z9fFlBT... 기반으로 새로 생성된 키)

Accept-Profile: alpine-home (스키마 전환 헤더)

3. [완료] 데이터 무결성 검사 및 정합성 테스트 (2026-04-25 3차 세션)

### 전체 테이블 행 수 비교 결과
| 테이블 | 로컬(alpine-home) | 클라우드(public) | 결과 |
|---|---|---|---|
| dealers | 46 | 46 | ✅ MATCH |
| inbound_analytics | 238 | 243 | ⚠️ 아래 설명 참조 |
| oem_speaker | 12 | 12 | ✅ MATCH |
| partner_board | 4 | 4 | ✅ MATCH |
| pnp_harness | 8 | 8 | ✅ MATCH |
| price_list | 623 | 623 | ✅ MATCH |
| profiles | 0 | 0 | ✅ MATCH |
| service_management | 41 | 41 | ✅ MATCH |
| users | 0 | 0 | ✅ MATCH |
| vehicle_make | 4 | 4 | ✅ MATCH |
| vehicle_model | 11 | 11 | ✅ MATCH |
| vehicle_trim | 10 | 10 | ✅ MATCH |
| visitor_logs | 143 | 143 | ✅ MATCH |

### inbound_analytics 5행 차이 분석
- 5개 누락 행의 created_at: **2026-04-25 09:28~12:14** — 오늘 이관 완료 이후 생성된 신규 방문 로그
- 이관 전 데이터는 완전 일치 → **마이그레이션 자체의 데이터 손실 없음**
- **근본 원인**: 방문 추적 JS(`inbound_analytics` INSERT 로직)가 아직 클라우드 Supabase로 기록 중
- **다음 작업**: 방문 추적 코드를 로컬 API 엔드포인트로 전환 필요

### PGRST205 캐시 오류 스캔 결과
- 13개 테이블 전체 정상 응답 (PGRST205 없음) ✅

남은 작업 3: T-PPO 스키마 데이터 — 별도 프로젝트, 본 이관 작업 범위 외

---
**작업자**: Antigravity (Autonomous Mode)
**최종 갱신**: 2026-04-25 (2차 세션)
