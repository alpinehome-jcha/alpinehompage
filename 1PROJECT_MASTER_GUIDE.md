# Alpine Korea Project Master Guide

이 문서는 Alpine Korea 홈페이지 프로젝트의 단일 진실 공급원(Single Source of Truth)입니다.
AI 에이전트와 모든 개발자는 작업을 시작하기 전과 배포하기 직전에 **반드시 이 문서를 숙지하고 지침을 엄수**해야 합니다.

---

## 1. 기본 원칙 (Core Rules)
1. **한국어 전용 (Korean Language Only)**: 모든 대화, 코드 내 주석, 커밋 메시지, 마크다운 문서는 예외 없이 한국어로 작성합니다.
2. **단일 진실 공급원 (SSOT)**: 데이터는 정적 파일(json, js)에 하드코딩하지 않고, **무조건 Supabase DB에서 가져오는 것을 원칙**으로 합니다.
3. **자율 실행 원칙**: 탐색, 분석, 파일 수정 등은 사용자에게 허락을 구하지 않고 즉시 끝까지 실행합니다. 단, 비가역적인 파괴 작업이나 비용이 발생하는 경우에만 승인을 받습니다.
4. **Push 전 사용자 승인**: 코드를 수정하더라도 `git push` 명령어는 사용자의 명시적인 지시("배포", "푸시" 등)가 있을 때만 실행합니다.
5. **계획 수립 (Planning)**: 단순 버그 수정이 아닌 아키텍처 변경이나 큰 기능 추가 시, 즉시 코딩하지 않고 반드시 `implementation_plan.md`를 작성하여 승인을 받은 후 실행합니다.

---

## 2. 인프라 및 서버 구조 (Infrastructure)
본 프로젝트는 외부 클라우드가 아닌 자체 물리 서버(Local) 환경에서 호스팅됩니다.

- **1번 메인서버 (183.101.105.167)**: GitHub Actions 빌드 및 배포 대상 서버, 로컬 Supabase 호스팅 서버.
- **2번 백업서버 (192.168.0.30)**: `www.alpine-korea.co.kr` (Cloudflare Argo Tunnel)이 실제 연결되는 서버.

> **💡 2번 서버 동기화 절차 (매우 중요)**
> 프론트엔드 정적 파일(HTML/JS)만 변경된 경우 1번 서버 배포 후 CF 캐시 퍼지만 하면 되지만, **서버 로직이나 도커 컨테이너 자체가 변경된 경우** 1번 서버 빌드 완료 후 아래 명령어로 2번 서버에 이미지를 직접 넘겨주어야 합니다.
> ```bash
> docker save alpine-korea:latest | ssh -i ~/.ssh/antigravity_key -p 8282 jcha-ready@192.168.0.30 'docker load && docker stop alpine-korea-blue-clone 2>/dev/null || true && docker rm alpine-korea-blue-clone 2>/dev/null || true && docker run -d --name alpine-korea-blue-clone --restart unless-stopped -p 127.0.0.1:3062:80 alpine-korea:latest'
> ```

---

## 3. 배포 프로토콜 및 주의사항 (Deployment & Cloudflare)

> ⚠️ **가장 중요한 주의사항 (Cloudflare Cache)**
> GitHub Actions 배포 스크립트 내 토큰 누락으로 인해, 코드를 푸시하고 빌드가 성공하더라도 **실제 사이트에는 구버전이 노출**됩니다 (4시간 캐시).
> **반드시 배포 직후 아래 PowerShell 명령어를 실행하여 수동으로 엣지 캐시를 퍼지(Purge)해야 합니다.**

### 3.1 배포 순서
1. 코드 검증 및 수정 완료
2. `git add .` -> `git commit -m "내용"` -> `git push origin main`
3. GitHub Actions `deploy.yml` 성공 여부 확인
4. **[필수] 수동 Cloudflare 캐시 퍼지 실행**

### 3.2 수동 캐시 퍼지 명령어 (PowerShell)
```powershell
# 주의: 토큰 값은 .env.local 파일의 CLOUDFLARE_API_TOKEN 값을 사용하세요.
Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/04ad726778cdc824a9d16c79efedda95/purge_cache" -Method Post -Headers @{Authorization="Bearer [CLOUDFLARE_API_TOKEN]"; "Content-Type"="application/json"} -Body '{"purge_everything":true}'
```

---

## 4. 데이터베이스 및 백엔드 (Supabase Local)
Supabase는 `183.101.105.167` 서버에 도커로 직접 구축되어 있습니다.

### 4.1 스키마 및 DB 접근
- 실제 운영 스키마: `alpine-home` (하이픈 포함이므로 SQL 작성 시 큰따옴표 `"alpine-home"` 필수)
- DB 직접 수정 접근법: `docker exec -it supabase-db psql -U supabase_admin`

### 4.2 권한 (GRANT) 및 RPC 규칙
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

---

## 5. 환경 변수 참조 (.env.local)
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
*이 파일은 모든 프로젝트 문서의 단일 진실 공급원입니다. 기존의 문서들(`handover-20260721.md`, `project-rules.md`, `README_SUPABASE.md`)을 이 파일 하나로 완벽히 대체합니다.*
