# 🚀 로컬(자체 서버) 수퍼베이스(Supabase) DB 수정 및 동기화 완벽 가이드

이 문서는 외부(클라우드)가 아닌 **로컬 서버 내 도커(Docker) 컨테이너로 폐쇄 구축된 수퍼베이스 DB**를 다룰 때, 삽질(시간 낭비)을 방지하기 위한 핵심 가이드입니다. 

향후 DB 스키마(구조) 변경이나 새로운 함수(RPC) 추가 작업 시 **반드시 아래의 절차와 주의사항**을 따라주세요.

---

## 1. 수퍼베이스 DB 직접 접근 방법 (마스터키)

외부에서 `service_role` 키 등을 이용해 테이블 구조를 수정하려 하면 권한 에러(Permission Denied)로 튕겨 나옵니다. **반드시 서버에 SSH로 접속하여 도커 컨테이너 내부에서 직접 쿼리를 실행**해야 합니다.

### 💡 표준 작업 흐름 (Workflow)
1. **작업할 SQL 스크립트 작성** (예: `update_db.sql`)
2. **서버로 SQL 파일 전송** (SCP 활용)
   ```bash
   scp -P 8282 update_db.sql user@183.101.105.167:/tmp/
   ```
3. **서버 SSH 접속 후 도커 컨테이너로 파일 복사 및 실행**
   ```bash
   # 도커 컨테이너 내부로 파일 밀어넣기
   docker cp /tmp/update_db.sql supabase-db:/tmp/update_db.sql
   
   # supabase_admin 권한으로 SQL 파일 강제 실행
   docker exec supabase-db psql -U supabase_admin -d postgres -t -A -f /tmp/update_db.sql
   ```
*(※ 직접 터미널에 접속해서 쿼리를 칠 때는 `docker exec -it supabase-db psql -U supabase_admin` 을 사용합니다.)*

---

## 2. ⚠️ 가장 많이 하는 실수: 권한(Permission) 누락 방지

로컬 수퍼베이스는 보안이 매우 깐깐합니다. `supabase_admin` 계정으로 테이블을 만들거나 함수를 생성하면, **프론트엔드(일반 사용자, anon)가 접근할 수 있도록 반드시 명시적으로 출입문을 열어주어야(GRANT) 합니다.**

### 🚨 필수 권한 부여 목록 (GRANT 체크리스트)

**① 테이블(Table) 권한 열기** (데이터 읽기/쓰기/수정)
```sql
GRANT ALL ON TABLE "스키마명".테이블명 TO anon, authenticated, service_role, supabase_admin;
```

**② 시퀀스(Sequence) 권한 열기** (새로운 데이터 삽입 시, 자동 번호표 발급용)
> *주의: 테이블 권한만 열고 시퀀스 권한을 열지 않으면, 기존 데이터 '수정(UPDATE)'은 되지만 '새로 만들기(INSERT)' 시 에러가 발생합니다.*
```sql
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA "스키마명" TO anon, authenticated, service_role;
```

**③ 함수(RPC) 권한 열기** (프론트엔드에서 `client.rpc()` 호출 허용)
```sql
GRANT EXECUTE ON FUNCTION "스키마명".함수명 TO anon, authenticated, service_role;
```

---

## 3. 스키마(Schema) 구조와 네이밍 주의사항

이 프로젝트의 DB는 기본 스키마인 `public` 외에도 **`"alpine-home"`이라는 커스텀 스키마**를 혼용하고 있습니다. 
(예: 대리점 데이터는 `public.dealers`, 관리자 계정은 `"alpine-home".users` 등)

1. **하이픈(-)이 들어간 스키마명 주의:**
   - SQL을 작성할 때 `alpine-home` 스키마는 **반드시 큰따옴표(`""`)로 감싸주어야 합니다.**
   - ⭕ 올바른 예: `SELECT * FROM "alpine-home".users;`
   - ❌ 틀린 예: `SELECT * FROM alpine-home.users;` (문법 에러 발생)

2. **RPC(함수) 작성 시 타겟 명확화:**
   - 함수 내부에서 INSERT나 UPDATE를 할 때 단순히 `dealers`라고만 쓰지 말고, `public.dealers`처럼 **스키마까지 포함된 절대 경로를 명시**하세요. 의도치 않은 테이블(동일한 이름의 다른 스키마 테이블)을 건드리는 사고를 막아줍니다.

---

## 4. 함수(RPC) 작성 시 `SECURITY DEFINER` 활용

프론트엔드에서 익명(`anon`)으로 접속하더라도 관리자 급의 데이터를 수정해야 할 때가 있습니다. (예: 대리점 정보 저장)
이때는 함수 정의 시 **`SECURITY DEFINER`**를 반드시 붙여주세요.

```sql
CREATE OR REPLACE FUNCTION public.admin_upsert_dealer(...)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER -- 핵심! 함수 실행 시 호출자가 아닌 생성자(admin)의 권한을 빌려씀
 SET search_path TO 'alpine-home', 'extensions', 'public'
AS $function$
...
```
이 옵션을 주면, 일반 유저 권한으로 접근하더라도 함수가 실행되는 동안에는 최상위 권한으로 DB를 안전하게 조작할 수 있습니다.
