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

    v_id := NULLIF(p_data->>'id', '')::bigint;

    IF v_id IS NOT NULL THEN
        -- 수정 (UPDATE)
        UPDATE "alpine-home".popups SET
            title        = COALESCE(p_data->>'title', title),
            is_active    = COALESCE((p_data->>'isActive')::boolean, is_active),
            dealer_only  = COALESCE((p_data->>'dealerOnly')::boolean, dealer_only),
            image_path   = COALESCE(p_data->>'imagePath', image_path),
            hide_days    = COALESCE(NULLIF(p_data->>'hideDays', '')::int, hide_days),
            link_url     = COALESCE(p_data->>'linkUrl', link_url)
        WHERE id = v_id;
        RETURN jsonb_build_object('success', true, 'action', 'updated', 'id', v_id);
    ELSE
        -- 추가 (INSERT) — id는 bigint 기본키이므로 직접 지정
        v_id := (p_data->>'id')::bigint;
        IF v_id IS NULL THEN
            v_id := (EXTRACT(EPOCH FROM now()) * 1000)::bigint;
        END IF;

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
            title       = EXCLUDED.title,
            is_active   = EXCLUDED.is_active,
            dealer_only = EXCLUDED.dealer_only,
            image_path  = EXCLUDED.image_path,
            hide_days   = EXCLUDED.hide_days,
            link_url    = EXCLUDED.link_url;

        RETURN jsonb_build_object('success', true, 'action', 'inserted', 'id', v_id);
    END IF;
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
