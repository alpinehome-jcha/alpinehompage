-- ============================================================
-- 제품 관리용 RPC 함수 (SECURITY DEFINER -- RLS 우회 허용)
-- dealer_admin_rpc.sql과 동일한 패턴으로 작성
-- ============================================================

-- 1. 제품 삭제
DROP FUNCTION IF EXISTS "alpine-home".admin_delete_product(text, text, bigint);
CREATE OR REPLACE FUNCTION "alpine-home".admin_delete_product(
    p_admin_username text,
    p_admin_password text,
    p_id             bigint
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = "alpine-home", extensions, public
AS $$
BEGIN
    IF NOT "alpine-home"._is_admin(p_admin_username, p_admin_password) THEN
        RETURN jsonb_build_object('error', 'unauthorized');
    END IF;
    DELETE FROM "alpine-home".products WHERE id = p_id;
    RETURN jsonb_build_object('success', true, 'deleted_id', p_id);
END;
$$;

-- 2. 제품 추가/수정 (upsert)
-- 주의: 프론트엔드가 타임스탬프 기반 ID를 직접 생성하므로
--       INSERT ... ON CONFLICT DO UPDATE 패턴 사용
DROP FUNCTION IF EXISTS "alpine-home".admin_upsert_product(text, text, jsonb);
CREATE OR REPLACE FUNCTION "alpine-home".admin_upsert_product(
    p_admin_username text,
    p_admin_password text,
    p_data           jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = "alpine-home", extensions, public
AS $$
DECLARE
    v_id bigint;
BEGIN
    IF NOT "alpine-home"._is_admin(p_admin_username, p_admin_password) THEN
        RETURN jsonb_build_object('error', 'unauthorized');
    END IF;
    v_id := NULLIF(p_data->>'id', '')::bigint;
    IF v_id IS NULL THEN
        v_id := (EXTRACT(EPOCH FROM now()) * 1000)::bigint;
    END IF;
    INSERT INTO "alpine-home".products (
        id, category, title, description, desc_bottom,
        price, sold_out, image, detail_blocks, attachments,
        manual_url, slug, is_active
    ) VALUES (
        v_id,
        COALESCE(p_data->>'category', ''),
        COALESCE(p_data->>'title', ''),
        COALESCE(p_data->>'description', ''),
        COALESCE(p_data->>'desc_bottom', ''),
        COALESCE(NULLIF(p_data->>'price', '')::integer, 0),
        COALESCE((p_data->>'sold_out')::boolean, false),
        COALESCE(p_data->>'image', ''),
        COALESCE(p_data->'detail_blocks', '[]'::jsonb),
        COALESCE(p_data->'attachments', '[]'::jsonb),
        COALESCE(p_data->>'manual_url', ''),
        COALESCE(p_data->>'slug', ''),
        true
    )
    ON CONFLICT (id) DO UPDATE SET
        category      = COALESCE(EXCLUDED.category,   "alpine-home".products.category),
        title         = COALESCE(EXCLUDED.title,       "alpine-home".products.title),
        description   = COALESCE(EXCLUDED.description, "alpine-home".products.description),
        desc_bottom   = COALESCE(EXCLUDED.desc_bottom, "alpine-home".products.desc_bottom),
        price         = COALESCE(EXCLUDED.price,       "alpine-home".products.price),
        sold_out      = COALESCE(EXCLUDED.sold_out,    "alpine-home".products.sold_out),
        image         = COALESCE(EXCLUDED.image,       "alpine-home".products.image),
        detail_blocks = EXCLUDED.detail_blocks,
        attachments   = EXCLUDED.attachments,
        manual_url    = COALESCE(EXCLUDED.manual_url,  "alpine-home".products.manual_url),
        slug          = COALESCE(EXCLUDED.slug,        "alpine-home".products.slug),
        is_active     = true;
    RETURN jsonb_build_object('success', true, 'id', v_id);
END;
$$;

-- GRANT: anon, authenticated 역할에서 REST API로 호출 가능하도록 권한 부여
GRANT EXECUTE ON FUNCTION "alpine-home".admin_delete_product(text, text, bigint) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION "alpine-home".admin_upsert_product(text, text, jsonb)  TO anon, authenticated;