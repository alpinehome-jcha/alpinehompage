-- ============================================================
-- ALPINE Korea - GitHub 토큰 서버측 이전 (Contents API 프록시)
-- js/github-client.js가 브라우저에서 직접 GitHub API를 호출하며
-- 토큰을 localStorage에 평문 저장하던 구조를, 관리자 비밀번호로
-- 검증하는 RPC + 서버측 http 확장 호출로 전환한다.
-- ============================================================

SET search_path TO "alpine-home", extensions, public;

CREATE EXTENSION IF NOT EXISTS http SCHEMA extensions;

-- ------------------------------------------------------------
-- 1. 시크릿 저장 테이블 (anon/authenticated 직접 접근 완전 차단)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "alpine-home".app_secrets (
  key        text PRIMARY KEY,
  value      text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE "alpine-home".app_secrets ENABLE ROW LEVEL SECURITY;
-- 정책 없음 = RPC(security definer)로만 접근

-- ------------------------------------------------------------
-- 2. 내부 헬퍼: 시크릿 조회
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION "alpine-home"._get_secret(p_key text)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = "alpine-home", extensions, public
AS $$
  SELECT value FROM "alpine-home".app_secrets WHERE key = p_key;
$$;

-- ------------------------------------------------------------
-- 3. RPC: GitHub 설정 저장 (토큰/저장소/브랜치) - 관리자 전용
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION "alpine-home".admin_set_github_config(
  p_admin_username text,
  p_admin_password text,
  p_token           text,
  p_repo            text,
  p_branch          text DEFAULT 'main'
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

  INSERT INTO "alpine-home".app_secrets (key, value, updated_at) VALUES
    ('github_token',  p_token,  now()),
    ('github_repo',   p_repo,   now()),
    ('github_branch', p_branch, now())
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

  RETURN json_build_object('success', true);
END;
$$;
GRANT EXECUTE ON FUNCTION "alpine-home".admin_set_github_config(text,text,text,text,text) TO anon;

-- ------------------------------------------------------------
-- 4. RPC: 설정 여부 확인 (헬스체크용, 토큰 값 자체는 절대 반환 안 함)
--    페이지 로드 시 조용히 상태만 표시하는 용도라 관리자 인증 불필요
--    (토큰 존재 여부/저장소명만 노출되며 토큰 값 자체는 절대 반환하지 않음)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION "alpine-home".admin_github_status()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = "alpine-home", extensions, public
AS $$
BEGIN
  RETURN json_build_object(
    'success', true,
    'configured', ("alpine-home"._get_secret('github_token') IS NOT NULL),
    'repo', "alpine-home"._get_secret('github_repo'),
    'branch', "alpine-home"._get_secret('github_branch')
  );
END;
$$;
GRANT EXECUTE ON FUNCTION "alpine-home".admin_github_status() TO anon;

-- ------------------------------------------------------------
-- 5. RPC: 연결 테스트 (저장소/브랜치 존재 확인)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION "alpine-home".admin_github_test_connection(
  p_admin_username text,
  p_admin_password text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = "alpine-home", extensions, public
AS $$
DECLARE
  v_token text;
  v_repo  text;
  v_branch text;
  v_resp extensions.http_response;
BEGIN
  IF NOT "alpine-home"._is_admin(p_admin_username, p_admin_password) THEN
    RETURN json_build_object('error', 'unauthorized');
  END IF;

  v_token := "alpine-home"._get_secret('github_token');
  v_repo := "alpine-home"._get_secret('github_repo');
  v_branch := COALESCE("alpine-home"._get_secret('github_branch'), 'main');

  IF v_token IS NULL OR v_repo IS NULL THEN
    RETURN json_build_object('error', 'not_configured');
  END IF;

  SELECT * INTO v_resp FROM extensions.http(ROW(
    'GET',
    'https://api.github.com/repos/' || v_repo || '/branches/' || v_branch,
    ARRAY[
      ROW('Authorization', 'token ' || v_token)::extensions.http_header,
      ROW('User-Agent', 'alpine-korea-admin')::extensions.http_header,
      ROW('Accept', 'application/vnd.github.v3+json')::extensions.http_header
    ],
    NULL,
    NULL
  )::extensions.http_request);

  IF v_resp.status = 200 THEN
    RETURN json_build_object('success', true, 'message', v_repo || ' (' || v_branch || ') 연결 정상');
  ELSIF v_resp.status = 401 THEN
    RETURN json_build_object('error', 'invalid_token');
  ELSIF v_resp.status = 404 THEN
    RETURN json_build_object('error', 'repo_or_branch_not_found');
  ELSE
    RETURN json_build_object('error', 'github_api_error', 'status', v_resp.status);
  END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION "alpine-home".admin_github_test_connection(text,text) TO anon;

-- ------------------------------------------------------------
-- 6. RPC: 파일 SHA 조회 (내부용 + 외부 노출용 겸용)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION "alpine-home".admin_github_get_sha(
  p_admin_username text,
  p_admin_password text,
  p_path            text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = "alpine-home", extensions, public
AS $$
DECLARE
  v_token text;
  v_repo  text;
  v_branch text;
  v_resp extensions.http_response;
  v_sha text;
BEGIN
  IF NOT "alpine-home"._is_admin(p_admin_username, p_admin_password) THEN
    RETURN json_build_object('error', 'unauthorized');
  END IF;

  v_token := "alpine-home"._get_secret('github_token');
  v_repo := "alpine-home"._get_secret('github_repo');
  v_branch := COALESCE("alpine-home"._get_secret('github_branch'), 'main');

  IF v_token IS NULL OR v_repo IS NULL THEN
    RETURN json_build_object('error', 'not_configured');
  END IF;

  SELECT * INTO v_resp FROM extensions.http(ROW(
    'GET',
    'https://api.github.com/repos/' || v_repo || '/contents/' || p_path || '?ref=' || v_branch,
    ARRAY[
      ROW('Authorization', 'token ' || v_token)::extensions.http_header,
      ROW('User-Agent', 'alpine-korea-admin')::extensions.http_header,
      ROW('Accept', 'application/vnd.github.v3+json')::extensions.http_header
    ],
    NULL,
    NULL
  )::extensions.http_request);

  IF v_resp.status = 404 THEN
    RETURN json_build_object('success', true, 'sha', NULL);
  ELSIF v_resp.status <> 200 THEN
    RETURN json_build_object('error', 'github_api_error', 'status', v_resp.status, 'detail', v_resp.content);
  END IF;

  v_sha := (v_resp.content::jsonb ->> 'sha');
  RETURN json_build_object('success', true, 'sha', v_sha);
END;
$$;
GRANT EXECUTE ON FUNCTION "alpine-home".admin_github_get_sha(text,text,text) TO anon;

-- ------------------------------------------------------------
-- 7. RPC: 파일 생성/수정 (commitFile / uploadFile 공통 경로)
--    p_content_base64: 클라이언트에서 이미 base64 인코딩된 내용
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION "alpine-home".admin_github_put_file(
  p_admin_username text,
  p_admin_password text,
  p_path            text,
  p_content_base64  text,
  p_message         text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = "alpine-home", extensions, public
AS $$
DECLARE
  v_token text;
  v_repo  text;
  v_branch text;
  v_sha_result json;
  v_sha text;
  v_body jsonb;
  v_resp extensions.http_response;
BEGIN
  IF NOT "alpine-home"._is_admin(p_admin_username, p_admin_password) THEN
    RETURN json_build_object('error', 'unauthorized');
  END IF;

  v_token := "alpine-home"._get_secret('github_token');
  v_repo := "alpine-home"._get_secret('github_repo');
  v_branch := COALESCE("alpine-home"._get_secret('github_branch'), 'main');

  IF v_token IS NULL OR v_repo IS NULL THEN
    RETURN json_build_object('error', 'not_configured');
  END IF;

  v_sha_result := "alpine-home".admin_github_get_sha(p_admin_username, p_admin_password, p_path);
  IF (v_sha_result ->> 'error') IS NOT NULL THEN
    RETURN v_sha_result;
  END IF;
  v_sha := v_sha_result ->> 'sha';

  v_body := jsonb_build_object(
    'message', p_message,
    'content', p_content_base64,
    'branch', v_branch
  );
  IF v_sha IS NOT NULL THEN
    v_body := v_body || jsonb_build_object('sha', v_sha);
  END IF;

  SELECT * INTO v_resp FROM extensions.http(ROW(
    'PUT',
    'https://api.github.com/repos/' || v_repo || '/contents/' || p_path,
    ARRAY[
      ROW('Authorization', 'token ' || v_token)::extensions.http_header,
      ROW('User-Agent', 'alpine-korea-admin')::extensions.http_header,
      ROW('Accept', 'application/vnd.github.v3+json')::extensions.http_header
    ],
    'application/json',
    v_body::text
  )::extensions.http_request);

  IF v_resp.status NOT IN (200, 201) THEN
    RETURN json_build_object('error', 'github_commit_failed', 'status', v_resp.status, 'detail', v_resp.content);
  END IF;

  RETURN json_build_object('success', true, 'path', p_path);
END;
$$;
GRANT EXECUTE ON FUNCTION "alpine-home".admin_github_put_file(text,text,text,text,text) TO anon;

-- 완료
SELECT 'GitHub 서버측 프록시 RPC 구축 완료' AS result;
