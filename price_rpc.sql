-- 구버전 함수(1파라미터) DROP
DROP FUNCTION IF EXISTS public.admin_upsert_price_list(jsonb);
DROP FUNCTION IF EXISTS public.admin_insert_price_list(jsonb);
DROP FUNCTION IF EXISTS public.admin_delete_price_list(bigint);

-- 신버전 함수도 DROP 후 postgres 슈퍼유저로 재생성
DROP FUNCTION IF EXISTS public.admin_upsert_price_list(text, text, jsonb);
DROP FUNCTION IF EXISTS public.admin_insert_price_list(text, text, jsonb);
DROP FUNCTION IF EXISTS public.admin_delete_price_list(text, text, bigint);

-- postgres 슈퍼유저가 소유하는 SECURITY DEFINER 함수 생성
-- (슈퍼유저 소유 = RLS, 권한 체크 모두 우회)

CREATE OR REPLACE FUNCTION public.admin_upsert_price_list(
    p_admin_username text,
    p_admin_password text,
    p_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NOT "alpine-home"._is_admin(p_admin_username, p_admin_password) THEN
        RETURN jsonb_build_object('error', 'unauthorized');
    END IF;

    IF jsonb_typeof(p_data) = 'object' THEN
        p_data := jsonb_build_array(p_data);
    END IF;

    INSERT INTO "alpine-home".price_list (
        id, category, product_category, product, msrp, dist_price, dealer_price, sort_order
    )
    SELECT
        NULLIF(rec->>'id', '')::bigint,
        rec->>'category',
        rec->>'product_category',
        rec->>'product',
        NULLIF(rec->>'msrp', '')::numeric,
        NULLIF(rec->>'dist_price', '')::numeric,
        NULLIF(rec->>'dealer_price', '')::numeric,
        NULLIF(rec->>'sort_order', '')::integer
    FROM jsonb_array_elements(p_data) AS rec
    ON CONFLICT (id) DO UPDATE SET
        category = EXCLUDED.category,
        product_category = EXCLUDED.product_category,
        product = EXCLUDED.product,
        msrp = EXCLUDED.msrp,
        dist_price = EXCLUDED.dist_price,
        dealer_price = EXCLUDED.dealer_price,
        sort_order = EXCLUDED.sort_order,
        updated_at = now();

    RETURN jsonb_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_insert_price_list(
    p_admin_username text,
    p_admin_password text,
    p_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NOT "alpine-home"._is_admin(p_admin_username, p_admin_password) THEN
        RETURN jsonb_build_object('error', 'unauthorized');
    END IF;

    IF jsonb_typeof(p_data) = 'object' THEN
        p_data := jsonb_build_array(p_data);
    END IF;

    INSERT INTO "alpine-home".price_list (
        category, product_category, product, msrp, dist_price, dealer_price, sort_order
    )
    SELECT
        rec->>'category',
        rec->>'product_category',
        rec->>'product',
        NULLIF(rec->>'msrp', '')::numeric,
        NULLIF(rec->>'dist_price', '')::numeric,
        NULLIF(rec->>'dealer_price', '')::numeric,
        NULLIF(rec->>'sort_order', '')::integer
    FROM jsonb_array_elements(p_data) AS rec;

    RETURN jsonb_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_price_list(
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

    DELETE FROM "alpine-home".price_list WHERE id = p_id;
    RETURN jsonb_build_object('success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_upsert_price_list(text, text, jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_insert_price_list(text, text, jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_price_list(text, text, bigint) TO anon, authenticated;
