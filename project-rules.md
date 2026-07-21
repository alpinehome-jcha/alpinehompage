Project Rules (Alpine Korea Homepage System / alpine-korea)

1. **Context Priority** : 모든 세션 시작 시 최신 `docs/handover-*.md` 파일 및 `c:\Antigravity\infrastructure_YYYYMMDD.md` (최신: `infrastructure_20260721.md`)를 읽고 인프라 및 진행 상황을 파악한다. 프로젝트의 모든 문서(PRD 포함)는 반드시 `docs/` 폴더 내에 위치해야 한다.

2. **Tech Stack & Architecture** :
* **Frontend** : 순수 정적 HTML5, CSS3 (Vanilla CSS), JavaScript (ES6+ Vanilla JS). (Next.js/React 사용 안 함)
* **Web Server** : Nginx (Alpine Docker Image 기반).
* **Database & API** : 로컬 Supabase (`http://183.101.105.167:8000`, PostgreSQL `"alpine-home"` 스키마). 클라우드 Supabase 사용 차단.
* **Deployment** : 로컬 프로덕션 서버(Server 1: `183.101.105.167`) Docker Standalone 기반 GitHub Actions Self-Hosted Runner (`alpine-korea`) 무중단 Blue-Green 배포 (`alpine-korea-blue`: 3062, `alpine-korea-green`: 3063). Vercel 배포 사용 안 함.

3. **Core Business Logic & Structure** :
* **Landing Page** : 순수 정적 렌더링 + HTML `<img>` 기반 히어로 블라인드 슬라이더 UI (`index.html`).
* **Admin & Auth** : Supabase JS Client (`js/supabase-client.js`, `js/auth.js`) 연동을 통한 로컬 DB 간이 인증 및 딜러/관리자 동기화.
* **API / Database Fallback** : `.env.local` 또는 `js/supabase-client.js` 내 로컬 프로덕션 IP(`http://183.101.105.167:8000`) 동적 참조.

4. **GitHub Push & Deployment Protocol (The Golden Rule — 필수 준수)** :
* **No Unauthorized Push** : 깃허브(GitHub) 푸시는 **사용자의 명시적인 직접 지시**가 있을 때만 실행한다.
* **Pre-Push Mandatory Steps** : 푸시 전 다음 단계를 스스로 수행한다.
  1. **`docs/handover-YYYYMMDD.md` 갱신** : 구현 기능, 수정 내용, 미완료 항목 및 인프라 포트/컨테이너 변경 사항 기록.
  2. **`c:\Antigravity\infrastructure_YYYYMMDD.md` 갱신** : 변경된 인프라 및 배포 설정 업데이트.
  3. **코드 검증** : 브라우저 및 정적 HTML/CSS 파싱 오류 검증. (Next.js `pnpm build` 과정 없음)

5. **Environment Variable & Config Management** :
* **Standardization** : `.env.local`에 정의된 로컬 Supabase URL 및 API 키를 사용하며, 프론트엔드 정적 파일(`js/supabase-client.js` 등)에서 하드코딩된 외부 클라우드 URL(Vercel, Supabase Cloud) 사용을 금지하고 로컬 엔드포인트를 동적 참조하도록 유지한다.

6. **Database SQL 작성 규칙 (Local Supabase 전용)** :
* **Search Path 설정** : 모든 SQL 쿼리 작성 시 최상단에 `SET search_path TO "alpine-home", public;`를 명시한다.
* **테이블 참조** : 하이픈(`-`)이 포함된 스키마/테이블 이름은 반드시 큰따옴표(`"`)로 감싼다 (`"alpine-home".table_name`).
* **권한 부여** : 테이블 생성 후 `GRANT ALL ON TABLE "alpine-home".테이블명 TO anon, authenticated, service_role;` 실행.

7. **Language Policy (Strict Korean Enforcement — 필수 준수)** :
* **Documentation & Communication** : 모든 문서와 대화, 코드 내 주석은 반드시 **한국어**로 작성한다. 영문 작성을 엄격히 금지한다.

8. **Encoding & File Handling Standard** :
* **Encoding** : 모든 소스 파일은 **UTF-8 (BOM 없음)** 인코딩을 사용한다.

9. **Autonomous Execution (자율 실행 원칙)** :
* **Skip Redundant Confirmation** : 사용자가 최종 "작업 지시서(또는 구현 계획)"를 승인한 후에는, 개별 코딩 단계나 세부 구현 과정에서 일일이 질문하거나 확인받지 않고 스스로 판단하여 완수한다.

10. **Implementation Plan & Manual Approval Protocol (필수 준수)**:
* 모든 기술적 코드 수정이나 인프라 변경 작업 착수 전에는 반드시 `implementation_plan.md`를 제출하여 계획을 보고한다.
* 사용자가 직접 명시적으로 지시한 경우에만 실행(Execution) 단계로 넘어간다.

11. ## 🖥️ Local Infrastructure & SSH Reference (로컬 인프라 및 SSH 참조 원칙)
* **SSH 접속 가이드**: `c:\Antigravity\alpine-homepage\jchauto-ssh.md` 참조.
  - Server 1 (Primary): `192.168.0.31` (내부망) / `183.101.105.167` (외부망), Port: `8282`, Username: `jchauto`
  - Server 2 (Standby): `192.168.0.30` (내부망), Port: `8282`, Username: `jcha-ready`
  - SSH Key: `C:\Users\martin\.ssh\antigravity_key`
* **인프라 문서 참조**: 최신 `c:\Antigravity\infrastructure_20260721.md` (v1.39.0) 참조.