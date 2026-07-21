-- ============================================================
-- ALPINE Korea - alpine-home 스키마 인증 시스템 복구
-- (기존 supabase-setup.sql을 alpine-home 스키마에 맞게 재작성)
-- 로컬 Supabase DB(supabase-db 컨테이너)에서 postgres 계정으로 실행
-- ============================================================

SET search_path TO "alpine-home", extensions, public;

-- ------------------------------------------------------------
-- 1. users 테이블 보호: anon/authenticated의 직접 SELECT 차단
--    (password_hash 노출 방지, RPC(security definer)로만 접근)
-- ------------------------------------------------------------
REVOKE SELECT ON "alpine-home".users FROM anon, authenticated;
ALTER TABLE "alpine-home".users ENABLE ROW LEVEL SECURITY;
-- 정책 없음 = anon/authenticated 직접 접근 완전 차단 (RPC만 허용)

-- ------------------------------------------------------------
-- 2. RPC: 로그인 검증
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION "alpine-home".verify_login(p_username text, p_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = "alpine-home", extensions, public
AS $$
DECLARE
  v_user "alpine-home".users%rowtype;
BEGIN
  SELECT * INTO v_user
  FROM "alpine-home".users
  WHERE username = p_username
    AND password_hash = crypt(p_password, password_hash);

  IF NOT FOUND THEN
    RETURN json_build_object('error', 'wrong_password');
  END IF;

  RETURN json_build_object(
    'id',          v_user.id,
    'username',    v_user.username,
    'role',        v_user.role,
    'dealer_name', v_user.dealer_name,
    'category',    v_user.category
  );
END;
$$;
GRANT EXECUTE ON FUNCTION "alpine-home".verify_login(text, text) TO anon;

-- ------------------------------------------------------------
-- 3. RPC: 비밀번호 변경
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION "alpine-home".update_password(
  p_username         text,
  p_current_password text,
  p_new_password     text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = "alpine-home", extensions, public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM "alpine-home".users
    WHERE username = p_username
      AND password_hash = crypt(p_current_password, password_hash)
  ) THEN
    RETURN false;
  END IF;

  UPDATE "alpine-home".users
  SET password_hash = crypt(p_new_password, gen_salt('bf'))
  WHERE username = p_username;

  RETURN true;
END;
$$;
GRANT EXECUTE ON FUNCTION "alpine-home".update_password(text, text, text) TO anon;

-- ------------------------------------------------------------
-- 4. 내부 헬퍼: 관리자 여부 검증 (admin/master 롤만 통과)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION "alpine-home"._is_admin(p_admin_username text, p_admin_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = "alpine-home", extensions, public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "alpine-home".users
    WHERE username = p_admin_username
      AND password_hash = crypt(p_admin_password, password_hash)
      AND role IN ('admin', 'master')
  );
END;
$$;
-- 외부 실행 권한 부여 안 함 (다른 SECURITY DEFINER 함수 내부에서만 호출)

-- ------------------------------------------------------------
-- 5. RPC: 대리점 정보 + 계정 통합 Upsert (dealers + users 동시 처리)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION "alpine-home".admin_upsert_dealer(
  p_admin_username text,
  p_admin_password text,
  p_old_username    text,
  p_new_username    text,
  p_new_password    text,
  p_role            text,
  p_dealer_name     text,
  p_category        text,
  p_badge           text DEFAULT NULL,
  p_address         text DEFAULT NULL,
  p_phone           text DEFAULT NULL,
  p_desc            text DEFAULT NULL,
  p_lat             numeric DEFAULT NULL,
  p_lng             numeric DEFAULT NULL,
  p_region          text DEFAULT NULL,
  p_homepage        text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = "alpine-home", extensions, public
AS $$
BEGIN
  IF NOT "alpine-home"._is_admin(p_admin_username, p_admin_password) THEN
    RETURN json_build_object('error', 'unauthorized');
  END IF;

  -- dealers 테이블: username 기준으로 upsert
  IF EXISTS (SELECT 1 FROM "alpine-home".dealers WHERE username = p_old_username) THEN
    UPDATE "alpine-home".dealers SET
      category = p_category, name = p_dealer_name, badge = p_badge,
      address = p_address, phone = p_phone, "desc" = p_desc,
      username = p_new_username, lat = p_lat, lng = p_lng,
      region = p_region, homepage = p_homepage, updated_at = now()
    WHERE username = p_old_username;
  ELSE
    INSERT INTO "alpine-home".dealers
      (category, name, badge, address, phone, "desc", username, lat, lng, region, homepage)
    VALUES
      (p_category, p_dealer_name, p_badge, p_address, p_phone, p_desc, p_new_username, p_lat, p_lng, p_region, p_homepage);
  END IF;

  -- users 테이블: 로그인 계정 upsert (비밀번호 입력 시에만 갱신)
  IF EXISTS (SELECT 1 FROM "alpine-home".users WHERE username = COALESCE(p_old_username, p_new_username)) THEN
    UPDATE "alpine-home".users SET
      username = p_new_username,
      role = p_role,
      dealer_name = p_dealer_name,
      category = p_category,
      password_hash = CASE WHEN p_new_password IS NOT NULL AND p_new_password <> ''
                            THEN crypt(p_new_password, gen_salt('bf'))
                            ELSE password_hash END
    WHERE username = COALESCE(p_old_username, p_new_username);
  ELSIF p_new_password IS NOT NULL AND p_new_password <> '' THEN
    INSERT INTO "alpine-home".users (username, password_hash, role, dealer_name, category)
    VALUES (p_new_username, crypt(p_new_password, gen_salt('bf')), p_role, p_dealer_name, p_category);
  END IF;

  RETURN json_build_object('success', true);
END;
$$;
GRANT EXECUTE ON FUNCTION "alpine-home".admin_upsert_dealer(text,text,text,text,text,text,text,text,text,text,text,text,numeric,numeric,text,text) TO anon;

-- ------------------------------------------------------------
-- 6. RPC: 대리점 삭제 (dealers + users 동시 삭제)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION "alpine-home".admin_delete_dealer(
  p_admin_username text,
  p_admin_password text,
  p_username        text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = "alpine-home", extensions, public
AS $$
BEGIN
  IF NOT "alpine-home"._is_admin(p_admin_username, p_admin_password) THEN
    RETURN json_build_object('error', 'unauthorized');
  END IF;

  DELETE FROM "alpine-home".dealers WHERE username = p_username;
  DELETE FROM "alpine-home".users WHERE username = p_username;

  RETURN json_build_object('success', true);
END;
$$;
GRANT EXECUTE ON FUNCTION "alpine-home".admin_delete_dealer(text,text,text) TO anon;

-- ------------------------------------------------------------
-- 7. RPC: 서비스 관리자 목록 조회
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION "alpine-home".admin_list_service_admins(
  p_admin_username text,
  p_admin_password text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = "alpine-home", extensions, public
AS $$
DECLARE
  v_data json;
BEGIN
  IF NOT "alpine-home"._is_admin(p_admin_username, p_admin_password) THEN
    RETURN json_build_object('error', 'unauthorized');
  END IF;

  SELECT json_agg(json_build_object('id', id, 'username', username, 'dealer_name', dealer_name))
  INTO v_data
  FROM "alpine-home".users
  WHERE role = 'service_admin';

  RETURN json_build_object('success', true, 'data', COALESCE(v_data, '[]'::json));
END;
$$;
GRANT EXECUTE ON FUNCTION "alpine-home".admin_list_service_admins(text,text) TO anon;

-- ------------------------------------------------------------
-- 8. RPC: 서비스(AS) 기록 조회/저장/삭제 (관리자 전용)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION "alpine-home".admin_list_service_records(
  p_admin_username text,
  p_admin_password text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = "alpine-home", extensions, public
AS $$
DECLARE
  v_data json;
BEGIN
  IF NOT "alpine-home"._is_admin(p_admin_username, p_admin_password) THEN
    RETURN json_build_object('error', 'unauthorized');
  END IF;

  SELECT json_agg(row_to_json(t))
  INTO v_data
  FROM (
    SELECT * FROM "alpine-home".service_management
    ORDER BY receive_date DESC NULLS LAST, id DESC
  ) t;

  RETURN json_build_object('success', true, 'data', COALESCE(v_data, '[]'::json));
END;
$$;
GRANT EXECUTE ON FUNCTION "alpine-home".admin_list_service_records(text,text) TO anon;

CREATE OR REPLACE FUNCTION "alpine-home".admin_upsert_service_record(
  p_admin_username text,
  p_admin_password text,
  p_id              bigint,
  p_record          jsonb
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = "alpine-home", extensions, public
AS $$
DECLARE
  v_new_id bigint;
BEGIN
  IF NOT "alpine-home"._is_admin(p_admin_username, p_admin_password) THEN
    RETURN json_build_object('error', 'unauthorized');
  END IF;

  IF p_id IS NOT NULL THEN
    UPDATE "alpine-home".service_management SET
      receive_date = (p_record->>'receive_date')::date,
      status = p_record->>'status',
      customer_name = p_record->>'customer_name',
      address = p_record->>'address',
      vehicle_info = p_record->>'vehicle_info',
      reserve_date = (p_record->>'reserve_date')::date,
      car_model = p_record->>'car_model',
      phone = p_record->>'phone',
      symptom = p_record->>'symptom',
      method = p_record->>'method',
      complete_date = (p_record->>'complete_date')::date,
      manager = p_record->>'manager',
      cost = NULLIF(regexp_replace(p_record->>'cost', '[^0-9.-]', '', 'g'), '')::numeric,
      recovery_status = p_record->>'recovery_status',
      failure_cause = p_record->>'failure_cause',
      details = p_record->>'details',
      images = COALESCE(p_record->'images', '[]'::jsonb)
    WHERE id = p_id;
    RETURN json_build_object('success', true, 'id', p_id);
  ELSE
    INSERT INTO "alpine-home".service_management
      (receive_date, status, customer_name, address, vehicle_info, reserve_date,
       car_model, phone, symptom, method, complete_date, manager, cost,
       recovery_status, failure_cause, details, images)
    VALUES (
      (p_record->>'receive_date')::date, p_record->>'status', p_record->>'customer_name',
      p_record->>'address', p_record->>'vehicle_info', (p_record->>'reserve_date')::date,
      p_record->>'car_model', p_record->>'phone', p_record->>'symptom', p_record->>'method',
      (p_record->>'complete_date')::date, p_record->>'manager',
      NULLIF(regexp_replace(p_record->>'cost', '[^0-9.-]', '', 'g'), '')::numeric,
      p_record->>'recovery_status', p_record->>'failure_cause', p_record->>'details',
      COALESCE(p_record->'images', '[]'::jsonb)
    )
    RETURNING id INTO v_new_id;
    RETURN json_build_object('success', true, 'id', v_new_id);
  END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION "alpine-home".admin_upsert_service_record(text,text,bigint,jsonb) TO anon;

CREATE OR REPLACE FUNCTION "alpine-home".admin_delete_service_record(
  p_admin_username text,
  p_admin_password text,
  p_id              bigint
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = "alpine-home", extensions, public
AS $$
BEGIN
  IF NOT "alpine-home"._is_admin(p_admin_username, p_admin_password) THEN
    RETURN json_build_object('error', 'unauthorized');
  END IF;

  DELETE FROM "alpine-home".service_management WHERE id = p_id;
  RETURN json_build_object('success', true);
END;
$$;
GRANT EXECUTE ON FUNCTION "alpine-home".admin_delete_service_record(text,text,bigint) TO anon;

-- ------------------------------------------------------------
-- 9. 계정 시드 데이터 (기존 supabase-setup.sql 값 그대로 복원)
-- ------------------------------------------------------------
INSERT INTO "alpine-home".users (username, password_hash, role, dealer_name) VALUES
  ('alpineaudio', crypt('<CHANGE_ME>', gen_salt('bf')), 'admin',  '관리자'),
  ('master',      crypt('<CHANGE_ME>', gen_salt('bf')), 'master', 'Sound Master'),
  ('team',        crypt('<CHANGE_ME>', gen_salt('bf')), 'team',   'Team Alpine'),
  ('style',       crypt('<CHANGE_ME>', gen_salt('bf')), 'style',  'Alpine Style'),
  ('region',      crypt('<CHANGE_ME>', gen_salt('bf')), 'region', 'Regional Dist'),
  ('dealer',      crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', 'Dealer')
ON CONFLICT (username) DO NOTHING;

INSERT INTO "alpine-home".users (username, password_hash, role, dealer_name, category) VALUES
  ('gain',              crypt('<CHANGE_ME>', gen_salt('bf')), 'master', '가인 오디오',           'Alpine Sound Master'),
  ('Frog',              crypt('<CHANGE_ME>', gen_salt('bf')), 'team',   '개구리 카오디오',        'Team Alpine'),
  ('caraudiofactory',   crypt('<CHANGE_ME>', gen_salt('bf')), 'team',   '카오디오팩토리',         'Team Alpine'),
  ('luxury',            crypt('<CHANGE_ME>', gen_salt('bf')), 'team',   '럭셔리 카클럽',          'Team Alpine'),
  ('autogallery',       crypt('<CHANGE_ME>', gen_salt('bf')), 'team',   '오토갤러리',             'Team Alpine'),
  ('catooaudio',        crypt('<CHANGE_ME>', gen_salt('bf')), 'team',   '카투오디오',             'Team Alpine'),
  ('suncarfactory',     crypt('<CHANGE_ME>', gen_salt('bf')), 'team',   '썬카팩토리',             'Team Alpine'),
  ('soundtechnic',      crypt('<CHANGE_ME>', gen_salt('bf')), 'team',   '사운드테크닉',           'Team Alpine'),
  ('gwangju',           crypt('<CHANGE_ME>', gen_salt('bf')), 'team',   '광주카오디오',           'Team Alpine'),
  ('soundjazz',         crypt('<CHANGE_ME>', gen_salt('bf')), 'team',   '사운드째즈',             'Team Alpine'),
  ('funnysound',        crypt('<CHANGE_ME>', gen_salt('bf')), 'team',   '퍼니사운드',             'Team Alpine'),
  ('retrocaraudio',     crypt('<CHANGE_ME>', gen_salt('bf')), 'team',   '레트로카오디오',         'Team Alpine'),
  ('soundraw',          crypt('<CHANGE_ME>', gen_salt('bf')), 'team',   '사운드로우',             'Team Alpine'),
  ('beisitauto01',      crypt('<CHANGE_ME>', gen_salt('bf')), 'style',  '바이지츠아우토',         'Alpine Style Distributor'),
  ('sounddoctor',       crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '사운드닥터',             'Alpine Dealer'),
  ('southtowncaraudio', crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '사우스타운카오디오',     'Alpine Dealer'),
  ('maxcaraudio',       crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '맥스카오디오',           'Alpine Dealer'),
  ('beautifulsound',    crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '뷰티풀사운드',           'Alpine Dealer'),
  ('illusionsound',     crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '일루션사운드',           'Alpine Dealer'),
  ('soundforum',        crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '사운드포럼',             'Alpine Dealer'),
  ('autosound21',       crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '오토사운드21',           'Alpine Dealer'),
  ('procarsound',       crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '프로카사운드',           'Alpine Dealer'),
  ('carsoundpark',      crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '카사운드파크',           'Alpine Dealer'),
  ('carsoundmaker',     crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '카사운드메이커',         'Alpine Dealer'),
  ('qualityhouse',      crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '퀄리티하우스',           'Alpine Dealer'),
  ('hyundaicaraudio',   crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '현대카오디오',           'Alpine Dealer'),
  ('jhsound',           crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '제이에이치사운드',       'Alpine Dealer'),
  ('hcodecaraudio',     crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '에이치코드카오디오',     'Alpine Dealer'),
  ('carsoundmaker01',   crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '카사운드메이커(서울)',   'Alpine Dealer'),
  ('powerbankhouse',    crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '파워뱅크하우스',         'Alpine Dealer'),
  ('acecarplaza',       crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '에이스카프라자',         'Alpine Dealer'),
  ('tropicalsound',     crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '트로피칼사운드',         'Alpine Dealer'),
  ('customsound',       crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '커스텀사운드',           'Alpine Dealer'),
  ('einsauto',          crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '아인스아우토',           'Alpine Dealer'),
  ('loudersound',       crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '라우러사운드',           'Alpine Dealer'),
  ('handscaraudio',     crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '핸즈카오디오',           'Alpine Dealer'),
  ('jazzcaraudio',      crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '째즈카오디오',           'Alpine Dealer'),
  ('soundpro',          crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '사운드프로',             'Alpine Dealer'),
  ('772caraudio',       crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '772카오디오',            'Alpine Dealer'),
  ('roadmine',          crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '로드마인',               'Alpine Dealer'),
  ('ohsungcaraudio',    crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '오성카오디오',           'Alpine Dealer'),
  ('phasecaraudio',     crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '페이즈카오디오',         'Alpine Dealer'),
  ('mistralcaraudio',   crypt('<CHANGE_ME>', gen_salt('bf')), 'dealer', '미스트랄카오디오',       'Alpine Dealer')
ON CONFLICT (username) DO NOTHING;

-- ------------------------------------------------------------
-- 10. 위험한 public 스키마 중복 테이블 권한 회수 (쓰기/삭제/truncate 차단)
--     읽기(SELECT)는 유지 (공개 데이터 성격이라 문제 없음)
-- ------------------------------------------------------------
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.dealers FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.price_list FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.service_management FROM anon, authenticated;
REVOKE SELECT ON public.service_management FROM anon, authenticated;

-- ------------------------------------------------------------
-- 11. alpine-home 쪽 원본 테이블도 anon 직접 쓰기 금지 재확인 (RPC 전용)
-- ------------------------------------------------------------
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON "alpine-home".dealers FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON "alpine-home".price_list FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON "alpine-home".service_management FROM anon, authenticated;
REVOKE SELECT ON "alpine-home".service_management FROM anon, authenticated;

-- ------------------------------------------------------------
-- 12. visitor_logs: 방문/로그인 기록 (anon INSERT만 허용, 나머지 차단)
--     public 쪽 위험한 권한 회수 + alpine-home 쪽 INSERT 복구
-- ------------------------------------------------------------
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.visitor_logs FROM anon, authenticated;
GRANT INSERT ON "alpine-home".visitor_logs TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE "alpine-home".visitor_logs_id_seq TO anon, authenticated;

-- ------------------------------------------------------------
-- 13. Storage: as-attachments 버킷 (서비스 관리 AS 사진 첨부)
--     실제 버킷명이 코드(js/service-management.js)와 달라(service-images)
--     한 번도 업로드가 성공한 적 없던 문제 수정. anon INSERT만 허용
--     (버킷 자체가 public=true라 읽기는 정책 불필요, 삭제는 허용 안 함)
-- ------------------------------------------------------------
CREATE POLICY "Anon upload for as-attachments" ON storage.objects
FOR INSERT TO anon
WITH CHECK (bucket_id = 'as-attachments');

-- 완료
SELECT 'alpine-home 인증 시스템 및 권한 조치 완료' AS result;
