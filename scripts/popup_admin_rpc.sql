-- ============================================================
-- 팝업 관리용 RPC 함수 (SECURITY DEFINER → RLS 우회 활용)
-- 이 함수들이 있으면 REST API 한 번으로 DB 팝업 데이터 조작 가능
-- dealer_admin_rpc.sql 패턴과 동일하게 작성
-- ============================================================

-- 1. 팝업 삭제
DROP FUNCTION IF EXISTS "alpine-home".admin_delete_popup(text, text, bigint);
CREATE OR REPLACE FUNCTION "alpine-home".admin_delete_popup(
    p_admin_username text,
    p_admin_password text,
    p_id bigint
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NOT "alpine-home"._is_admin(p_admin_username, p_admin_password) THEN
        RETURN jsonb_build_object('error', 'unauthorized');
    END IF;

    DELETE FROM "alpine-home".popups WHERE id = p_id;
    RETURN jsonb_build_object('success', true, 'deleted_id', p_id);
END;
$$;

-- 2. 팝업 추가/수정 (upsert)
DROP FUNCTION IF EXISTS "alpine-home".admin_upsert_popup(text, text, jsonb);
CREATE OR REPLACE FUNCTION "alpine-home".admin_upsert_popup(
    p_admin_username text,
    p_admin_password text,
    p_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_id bigint;
BEGIN
    IF NOT "alpine-home"._is_admin(p_admin_username, p_admin_password) THEN
        RETURN jsonb_build_object('error', 'unauthorized');
    END IF;

    -- 프론트엔드가 보낸 ID 추출 (새로 생성된 ID 포함)
    v_id := NULLIF(p_data->>'id', '')::bigint;
    IF v_id IS NULL THEN
        v_id := (EXTRACT(EPOCH FROM now()) * 1000)::bigint;
    END IF;

    -- 무조건 INSERT 시도, 이미 해당 ID가 있으면 UPDATE 처리 (Upsert 패턴)
    INSERT INTO "alpine-home".popups (
        id, title, is_active, dealer_only, image_path, hide_days, link_url
    ) VALUES (
        v_id,
        p_data->>'title',
        COALESCE((p_data->>'isActive')::boolean, false),
        COALESCE((p_data->>'dealerOnly')::boolean, false),
        p_data->>'imagePath',
        COALESCE(NULLIF(p_data->>'hideDays', '')::int, 1),
        p_data->>'linkUrl'
    )
    ON CONFLICT (id) DO UPDATE SET
        title       = COALESCE(EXCLUDED.title, "alpine-home".popups.title),
        is_active   = COALESCE(EXCLUDED.is_active, "alpine-home".popups.is_active),
        dealer_only = COALESCE(EXCLUDED.dealer_only, "alpine-home".popups.dealer_only),
        image_path  = COALESCE(EXCLUDED.image_path, "alpine-home".popups.image_path),
        hide_days   = COALESCE(EXCLUDED.hide_days, "alpine-home".popups.hide_days),
        link_url    = COALESCE(EXCLUDED.link_url, "alpine-home".popups.link_url);

    RETURN jsonb_build_object('success', true, 'action', 'upserted', 'id', v_id);
END;
$$;

-- 3. 팝업 전체 조회 (관리자용 — RLS 우회, 모든 행 반환)
DROP FUNCTION IF EXISTS "alpine-home".admin_list_popups(text, text);
CREATE OR REPLACE FUNCTION "alpine-home".admin_list_popups(
    p_admin_username text,
    p_admin_password text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result jsonb;
BEGIN
    IF NOT "alpine-home"._is_admin(p_admin_username, p_admin_password) THEN
        RETURN jsonb_build_object('error', 'unauthorized');
    END IF;

    SELECT jsonb_agg(row_to_json(t))
    INTO v_result
    FROM (
        SELECT * FROM "alpine-home".popups ORDER BY id ASC
    ) t;

    RETURN jsonb_build_object('success', true, 'data', COALESCE(v_result, '[]'::jsonb));
END;
$$;

-- GRANT: anon, authenticated 역할에서 REST API로 호출 가능하도록 권한 부여
GRANT EXECUTE ON FUNCTION "alpine-home".admin_delete_popup(text, text, bigint) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION "alpine-home".admin_upsert_popup(text, text, jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION "alpine-home".admin_list_popups(text, text) TO anon, authenticated;
NOTIFY pgrst, 'reload schema';
