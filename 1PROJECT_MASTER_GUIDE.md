# Alpine Korea Project Master Guide

이 문서는 Alpine Korea 홈페이지 프로젝트의 단일 진실 공급원(Single Source of Truth)입니다.
AI 에이전트와 모든 개발자는 작업을 시작하기 전과 배포하기 직전에 **반드시 이 문서를 숙지하고 지침을 엄수**해야 합니다.
(본 문서는 기존 handover, project-rules, README_SUPABASE 및 jchauto-gjhan-ssh 가이드를 모두 통합한 최종 문서입니다.)

---

## 1. 기본 원칙 (Core Rules)
1. **한국어 전용 (Korean Language Only)**: 모든 대화, 코드 내 주석, 커밋 메시지, 마크다운 문서는 예외 없이 한국어로 작성합니다.
2. **단일 진실 공급원 (SSOT)**: 데이터는 정적 파일(json, js)에 하드코딩하지 않고, **무조건 Supabase DB에서 가져오는 것을 원칙**으로 합니다.
3. **자율 실행 원칙**: 탐색, 분석, 파일 수정 등은 사용자에게 허락을 구하지 않고 즉시 끝까지 실행합니다. 단, 비가역적인 파괴 작업이나 비용이 발생하는 경우에만 승인을 받습니다.
4. **Push 전 사용자 승인**: 코드를 수정하더라도 `git push` 명령어는 사용자의 명시적인 지시("배포", "푸시" 등)가 있을 때만 실행합니다.
5. **계획 수립 (Planning)**: 단순 버그 수정이 아닌 아키텍처 변경이나 큰 기능 추가 시, 즉시 코딩하지 않고 반드시 `implementation_plan.md`를 작성하여 승인을 받은 후 실행합니다.

---

## 2. 인프라 및 서버 접속 (SSH & Server Details)
본 프로젝트는 외부 클라우드가 아닌 자체 물리 서버(Local) 환경에서 호스팅됩니다.
담당자(`gjhan`)를 위한 전용 SSH 접속 정보는 아래와 같습니다.
- **SSH Key**: `antigravity_gjhan_key` (개인키 위치: `~/.ssh/antigravity_gjhan_key`)

### 2.1 Server 1: Primary Production Web Server (1번 메인 서버)
모든 소스 편집, 컨테이너 제어, 배포는 **오직 1번 메인 서버에서만** 진행합니다.
- **Host (내부망/VPN 권장)**: `192.168.0.31`
- **Host (외부망/공용)**: `183.101.105.167` (사무실 IP 방화벽 적용)
- **Port / Username**: `8282` / `jchauto-gjhan`
- **접속 명령어**: `ssh -p 8282 -i ~/.ssh/antigravity_gjhan_key jchauto-gjhan@183.101.105.167`

### 2.2 Server 2: Standby Clone (2번 대기 서버)
> ⚠️ **절대 주의**: 2번 백업 서버는 자동 백업 시스템에 의해 메인 서버와 동기화됩니다. **어떠한 경우에도 2번 서버를 수동으로 수정하거나 배포해서는 안 됩니다.**
- **Host (내부망/VPN 전용)**: `192.168.0.30`
- **Port / Username**: `8282` / `jchauto-gjhan`

---

## 3. 권한 및 컨테이너 관리 (Docker & Permissions)
`jchauto-gjhan` 계정은 타 서비스를 침범하지 않도록 안전하게 격리된 관리 도구가 기본 탑재되어 있습니다. (솔라가드, 스페라 등 타 프로젝트 접근은 완전 차단됨)

### 3.1 담당 프로젝트 디렉토리 및 컨테이너
| 담당 프로젝트 | 디렉토리 경로 (Server 1) | 허용 Docker 컨테이너 | 세부 권한 |
| :--- | :--- | :--- | :---: |
| **알파인 홈페이지** | `/home/jchauto/alpine-korea-app` | `alpine-korea-blue`, `green`, `blue-clone` | **`rwx` 배포 및 제어** |
| **도요타 PPO** | `/home/jchauto/apps/toyota-ppo` | `toyota-ppo-blue`, `green`, `clone` | **`rwx` 배포 및 제어** |
| **Supabase DB** | `127.0.0.1:5432` / `6543` | - | 터널링/쿼리 가능 |
| **Nginx 서비스** | `/etc/nginx/sites-available/*` | - | reload 및 설정 수정 |

### 3.2 Docker 컨테이너 상태 및 로그 확인
- 상태 확인: `docker ps` 또는 `toyota-docker ps`
- 실시간 로그: `docker logs -f alpine-korea-blue`
- 재시작: `docker restart alpine-korea-blue`

---

## 4. 배포 프로토콜 및 주의사항 (Deployment & Cloudflare)

> ⚠️ **가장 중요한 주의사항 (Cloudflare Cache & 수동 배포)**
> GitHub Actions 배포 스크립트 내 토큰 누락 등으로 인해 GitHub에 푸시하는 것만으로는 실제 서버(1번 메인 서버)에 즉각 반영되지 않을 수 있습니다.
> **따라서, 반드시 서버에 SSH로 접속하여 무중단 배포 명령어(`deploy-alpine`)를 직접 실행하고, 그 직후 Cloudflare 엣지 캐시를 퍼지(Purge)해야 합니다.**

### 4.1 전체 배포 순서
1. 로컬 환경에서 코드 검증 및 수정 완료
2. GitHub 업로드: `git add .` -> `git commit -m "내용"` -> `git push origin main`
3. **[필수] 메인 서버 배포 실행**: 
   - 1번 메인 서버(183.101.105.167)에 SSH 접속 후 `deploy-alpine` (알파인) 또는 `deploy-toyota` (도요타) 명령어 실행
   - *(내부 명령어 동작: `sudo /usr/local/bin/alpine-docker deploy alpine`)*
4. **[필수] 수동 Cloudflare 캐시 퍼지 실행**

### 4.2 수동 캐시 퍼지 명령어 (PowerShell)
```powershell
# 주의: 토큰 값은 .env.local 파일의 CLOUDFLARE_API_TOKEN 값을 사용하세요.
Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/04ad726778cdc824a9d16c79efedda95/purge_cache" -Method Post -Headers @{Authorization="Bearer [CLOUDFLARE_API_TOKEN]"; "Content-Type"="application/json"} -Body '{"purge_everything":true}'
```

---

## 5. 데이터베이스 및 백엔드 (Supabase Local)
Supabase는 `183.101.105.167` 서버에 도커로 직접 구축되어 있습니다.

### 5.1 스키마 및 DB 접근
- 실제 운영 스키마: `alpine-home` (하이픈 포함이므로 SQL 작성 시 큰따옴표 `"alpine-home"` 필수)
- DB 직접 수정 접근법: `docker exec -it supabase-db psql -U supabase_admin`

### 5.2 권한 (GRANT) 및 RPC 규칙
로컬 구축의 특성상 프론트엔드(Client)에서 DB에 접근하려면 권한을 수동으로 명시해야 합니다.
새로운 테이블이나 함수(RPC)를 만들면 **반드시 3가지 GRANT를 실행**해야 합니다.

```sql
-- 1. 테이블 권한
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "alpine-home".테이블명 TO anon, authenticated, service_role;
-- 2. 시퀀스 권한 (있는 경우)
GRANT USAGE, SELECT ON SEQUENCE "alpine-home".시퀀스명 TO anon, authenticated, service_role;
```

RPC(저장 프로시저) 작성 시 권한 문제(RLS 등) 우회를 위해 `SECURITY DEFINER`를 반드시 추가해야 합니다.
```sql
CREATE OR REPLACE FUNCTION "alpine-home".함수명()
RETURNS ...
LANGUAGE plpgsql
SECURITY DEFINER -- 필수
AS $$ ...
```

### 5.3 DB 직접 접근 제약 사항 (CRITICAL)

> ⚠️ **AI 에이전트 필독**: 아래 경로들은 모두 막혀 있습니다. 우회 시도 금지.

| 접근 경로 | 결과 | 이유 |
| :--- | :---: | :--- |
| REST API (`anon` 키) + DELETE/INSERT | ❌ 차단 | RLS 정책 |
| REST API (`service_role` 키) | ❌ 차단 | API Gateway 401 |
| SSH → `docker exec supabase-db psql` | ❌ 차단 | docker socket 권한 없음 |
| SSH → psql 직접 접속 (포트포워딩) | ❌ 차단 | Tenant 인증 실패 |
| MCP supabase 도구 | ❌ 실제 운영 DB 아님 | `public` 스키마만 접근 (클라우드 백업용) |
| **관리자 RPC 함수 호출** | ✅ **유일한 정상 경로** | SECURITY DEFINER로 RLS 우회 |

**결론**: `dealers` 테이블 데이터를 조작할 때는 반드시 **5.4의 관리자 RPC 함수**를 사용해야 합니다.  
배포 스크립트(`scripts/deploy.sh`)에 SQL을 주입하는 방식은 **절대 사용 금지**입니다.

### 5.4 딜러 관리 RPC 함수 (AI 에이전트 DB 접근 공식 경로)

`scripts/dealer_admin_rpc.sql`에 정의된 함수 3종. 배포 시 자동 적용됨.  
호출 엔드포인트: `POST https://supabase.alpine-korea.co.kr/rest/v1/rpc/[함수명]`  
헤더: `apikey: [ANON_KEY]`, `Content-Type: application/json`

#### 딜러 삭제
```javascript
// 함수: public.admin_delete_dealer
// Body: { p_admin_username, p_admin_password, p_id }
const res = await fetch('https://supabase.alpine-korea.co.kr/rest/v1/rpc/admin_delete_dealer', {
  method: 'POST',
  headers: { 'apikey': ANON_KEY, 'Content-Type': 'application/json' },
  body: JSON.stringify({ p_admin_username: 'admin', p_admin_password: '***', p_id: 1234567890 })
});
// 성공 응답: { "success": true, "deleted_id": 1234567890 }
```

#### 딜러 추가/수정 (upsert)
```javascript
// 함수: public.admin_upsert_dealer
// Body: { p_admin_username, p_admin_password, p_data }
// p_data.id 있으면 UPDATE, 없으면 INSERT
const res = await fetch('https://supabase.alpine-korea.co.kr/rest/v1/rpc/admin_upsert_dealer', {
  method: 'POST',
  headers: { 'apikey': ANON_KEY, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    p_admin_username: 'admin',
    p_admin_password: '***',
    p_data: { name: '대리점명', category: 'Alpine Dealer', username: 'id', region: '서울', ... }
  })
});
// 성공 응답: { "success": true, "action": "inserted", "id": 1234567890 }
```

#### 딜러 전체 조회 (관리자용 — RLS 우회)
```javascript
// 함수: public.admin_list_dealers
const res = await fetch('https://supabase.alpine-korea.co.kr/rest/v1/rpc/admin_list_dealers', {
  method: 'POST',
  headers: { 'apikey': ANON_KEY, 'Content-Type': 'application/json' },
  body: JSON.stringify({ p_admin_username: 'admin', p_admin_password: '***' })
});
// 성공 응답: { "success": true, "data": [ ... ] }
```

> **관리자 비밀번호**: `.env.local`에 없음. `admin.html` 접속 후 관리자 로그인 시 입력하는 비밀번호와 동일. `_is_admin()` 함수가 검증.

---

## 6. 환경 변수 참조 (.env.local)
로컬 인프라와 관련된 주요 자격 증명은 `.env.local`에 정의되어 있습니다.

- **DB_MODE**: `"local"` (모든 데이터는 이 로컬 인프라를 바라봄)
- **LOCAL_DB_URL**: `postgresql://postgres:[비밀번호]@183.101.105.167:8282/postgres?schema=alpine-home`
- **로컬 스토리지 (Storage 리디렉션)**: 
  - `NEXT_PUBLIC_LOCAL_STORAGE_URL`: `http://183.101.105.167:8182`
  - `LOCAL_STORAGE_PATH`: `/home/jchauto/storage/alpine-home`
- **CLOUDFLARE_API_TOKEN**: Cloudflare 캐시 퍼지용 토큰 (`cfut_...`)
- **CLOUDFLARE_ZONE_ID**: `04ad726778cdc824a9d16c79efedda95`
- **GITHUB_PAT**: `ghp_...` (GitHub API 호출 및 Actions 확인용)

---
*이 파일은 모든 프로젝트 문서의 단일 진실 공급원입니다. 기존의 문서들(handover-20260721.md, project-rules.md, README_SUPABASE.md, jchauto-gjhan-ssh.md)을 이 파일 하나로 완벽히 대체합니다.*
