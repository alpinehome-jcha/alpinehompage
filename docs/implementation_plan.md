# 구현 계획서: Mixed Content 문제 해결 (2번 이슈)

- **작성일**: 2026-07-21
- **대상 이슈**: HTTPS로 서빙되는 사이트에서 클라이언트 JS가 평문 HTTP Supabase 엔드포인트를 호출하여 브라우저에 의해 차단될 수 있는 문제

## 1. 현황 분석 (완료)

- `js/auth.js`, `js/supabase-client.js`, `pages/admin.html` 3개 파일 모두 `window.ENV.NEXT_PUBLIC_SUPABASE_URL`이 없을 경우 아래 값으로 폴백함:
  ```
  http://183.101.105.167:8000
  ```
- `window.ENV`를 실제로 주입하는 코드가 사이트 어디에도 없음(전수 검색 결과 0건) → **항상 이 평문 HTTP 폴백이 사용됨**.
- 사이트는 현재 Cloudflare(HTTPS, SSL 모드 `Full`)를 통해 정상 서빙 중(1번 이슈에서 확인 완료).
- HTTPS 페이지에서 평문 HTTP로 `fetch`(활성 콘텐츠)를 호출하면 최신 브라우저는 기본적으로 Mixed Content를 차단 → 로그인, 가격표, 딜러 목록, 관리자 동기화 등 Supabase 의존 기능이 실사용자 브라우저에서 실패할 가능성이 높음.
- Kong(8000번 포트)은 TLS를 제공하지 않으므로, 브라우저가 직접 `https://183.101.105.167:8000`으로 호출하는 것도 불가능(포트 자체에 인증서가 없음).

## 2. 조치 계획

### Step 1. Cloudflare DNS 레코드 추가 (인프라, 가역적)
- `supabase.alpine-korea.co.kr` A 레코드 → `183.101.105.167`, Proxied 켬
- 기존 `.env.local`에 저장된 `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ZONE_ID`로 API를 통해 생성
- 문제 발생 시 Cloudflare API로 즉시 삭제 가능

### Step 2. 로컬 서버 nginx 설정 추가 (인프라)
- 신규 파일: `/etc/nginx/sites-available/supabase.alpine-korea.co.kr`
- 80 → 443 리다이렉트, 443에서는 기존 `/home/jchauto/ssl/alpine-korea.crt`/`.key`를 재사용
  - 확인 결과 이 인증서는 자체서명이며 SAN 확장이 없는 CN 단일 인증서지만, Cloudflare SSL 모드가 `Full`(strict 아님)이라 호스트네임 검증을 하지 않으므로 재사용에 문제 없음(현재도 www/non-www/alpine-audio 등 여러 호스트에 동일 인증서를 쓰고 있는 것과 동일한 방식)
- `proxy_pass http://127.0.0.1:8000;`로 Kong에 프록시 (기존 `supabase.jchauto.co.kr` 설정과 동일 패턴)
- `nginx -t` 통과 확인 후 `sites-enabled`에 심볼릭 링크 생성 및 `systemctl reload nginx`
- Kong의 CORS 플러그인은 전 라우트에 설정값 없이 적용되어 있어(기본값 = 전체 허용) 별도 CORS 조정 불필요함을 확인함

### Step 3. 클라이언트 코드 수정
- 아래 3개 파일의 로컬 폴백 URL을 평문 HTTP → 신규 HTTPS 서브도메인으로 변경
  - `js/auth.js` (`DEFAULT_LOCAL_SUPABASE_URL`)
  - `js/supabase-client.js` (`DEFAULT_LOCAL_SUPABASE_URL`)
  - `pages/admin.html` (`_LOCAL_SUPA_URL`)
  - 변경 후 값: `https://supabase.alpine-korea.co.kr`
- ANON KEY는 변경하지 않음(그대로 유지)

### Step 4. 검증
- `curl -I https://supabase.alpine-korea.co.kr/` 정상 응답(401/200 등 Kong 응답) 확인
- 로컬에서 정적 파일을 브라우저로 열어 콘솔에 Mixed Content 경고가 사라지는지, 가격표/딜러 목록 fetch가 정상 동작하는지 확인
- 배포 후 실사이트(`https://www.alpine-korea.co.kr`)에서 동일하게 콘솔 에러 없는지 확인

### Step 5. 배포 (별도 승인 필요)
- 위 코드 변경은 로컬에 반영만 하고, **GitHub 푸시는 프로젝트 규칙(Golden Rule)에 따라 사용자의 별도 명시적 지시가 있을 때만 실행**함
- 푸시 전 `docs/handover.md` 갱신 및 빌드/문법 검증 수행

## 3. 리스크 및 롤백

| 항목 | 리스크 | 롤백 방법 |
|---|---|---|
| Cloudflare DNS 레코드 | 거의 없음(신규 서브도메인 추가일 뿐, 기존 레코드 변경 없음) | API로 레코드 삭제 |
| nginx 신규 conf | 오타 시 reload 실패 가능 → `nginx -t`로 사전 검증 후에만 reload, 기존 사이트(alpine-korea.co.kr) 설정 파일은 건드리지 않음 | 심볼릭 링크 제거 후 reload |
| 클라이언트 코드 변경 | 신규 도메인이 아직 전파/검증 전 상태로 배포되면 일시적으로 API 호출 실패 가능 | git revert, 또는 재배포 |

## 4. 이번 범위에 포함하지 않는 것
- Kong/PostgREST 자체의 `alpine-home` 스키마 권한 이슈(별도 트래킹된 미해결 항목) — 이번 작업은 "전송 구간 암호화" 문제만 다룸
- admin.html 인증 부재, `service_management` 테이블 RLS 문제(3·4번 이슈) — 별도 계획으로 진행 예정
