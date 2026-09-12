-- ============================================================
-- 딜러 관리용 RPC 함수 (SECURITY DEFINER — RLS 우회 허용)
-- 이 함수들이 있으면 REST API 한 번으로 DB 딜러 데이터 조작 가능
-- ============================================================

-- 1. 딜러 삭제
DROP FUNCTION IF EXISTS "alpine-home".admin_delete_dealer(text, text, bigint);
CREATE OR REPLACE FUNCTION "alpine-home".admin_delete_dealer(
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

    DELETE FROM "alpine-home".dealers WHERE id = p_id;
    RETURN jsonb_build_object('success', true, 'deleted_id', p_id);
END;
$$;

-- 2. 딜러 추가/수정 (upsert)
DROP FUNCTION IF EXISTS "alpine-home".admin_upsert_dealer(text, text, jsonb);
CREATE OR REPLACE FUNCTION "alpine-home".admin_upsert_dealer(
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
        UPDATE "alpine-home".dealers SET
            name        = COALESCE(p_data->>'name', name),
            category    = COALESCE(p_data->>'category', category),
            badge       = COALESCE(p_data->>'badge', badge),
            address     = COALESCE(p_data->>'address', address),
            phone       = COALESCE(p_data->>'phone', phone),
            "desc"      = COALESCE(p_data->>'desc', "desc"),
            username    = COALESCE(p_data->>'username', username),
            lat         = NULLIF(p_data->>'lat', '')::float,
            lng         = NULLIF(p_data->>'lng', '')::float,
            region      = COALESCE(p_data->>'region', region),
            homepage    = COALESCE(p_data->>'homepage', homepage),
            blog_url    = COALESCE(p_data->>'blog_url', blog_url),
            youtube_url = COALESCE(p_data->>'youtube_url', youtube_url),
            instagram_url = COALESCE(p_data->>'instagram_url', instagram_url),
            facebook_url  = COALESCE(p_data->>'facebook_url', facebook_url),
            tistory_url   = COALESCE(p_data->>'tistory_url', tistory_url),
            updated_at  = now()
        WHERE id = v_id;
        RETURN jsonb_build_object('success', true, 'action', 'updated', 'id', v_id);
    ELSE
        -- 추가 (INSERT)
        INSERT INTO "alpine-home".dealers (
            name, category, badge, address, phone, "desc", username,
            lat, lng, region, homepage, blog_url, youtube_url,
            instagram_url, facebook_url, tistory_url
        ) VALUES (
            p_data->>'name',
            p_data->>'category',
            p_data->>'badge',
            p_data->>'address',
            p_data->>'phone',
            p_data->>'desc',
            p_data->>'username',
            NULLIF(p_data->>'lat', '')::float,
            NULLIF(p_data->>'lng', '')::float,
            p_data->>'region',
            p_data->>'homepage',
            p_data->>'blog_url',
            p_data->>'youtube_url',
            p_data->>'instagram_url',
            p_data->>'facebook_url',
            p_data->>'tistory_url'
        ) RETURNING id INTO v_id;
        RETURN jsonb_build_object('success', true, 'action', 'inserted', 'id', v_id);
    END IF;
END;
$$;

-- 3. 딜러 전체 조회 (관리자용 — RLS 우회, 모든 행 반환)
DROP FUNCTION IF EXISTS "alpine-home".admin_list_dealers(text, text);
CREATE OR REPLACE FUNCTION "alpine-home".admin_list_dealers(
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

    SELECT jsonb_agg(row_to_json(d))
    INTO v_result
    FROM "alpine-home".dealers d
    ORDER BY d.name;

    RETURN jsonb_build_object('success', true, 'data', COALESCE(v_result, '[]'::jsonb));
END;
$$;

-- GRANT: anon, authenticated 역할에서 REST API로 호출 가능하게 권한 부여
GRANT EXECUTE ON FUNCTION "alpine-home".admin_delete_dealer(text, text, bigint) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION "alpine-home".admin_upsert_dealer(text, text, jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION "alpine-home".admin_list_dealers(text, text) TO anon, authenticated;
