CREATE OR REPLACE FUNCTION admin_upsert_price_list(
    p_admin_username text,
    p_admin_password text,
    p_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = "alpine-home", public
AS $$
BEGIN
    IF NOT "alpine-home"._is_admin(p_admin_username, p_admin_password) THEN
        RETURN json_build_object('error', 'unauthorized');
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
        sort_order = EXCLUDED.sort_order;

    RETURN json_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION admin_insert_price_list(
    p_admin_username text,
    p_admin_password text,
    p_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = "alpine-home", public
AS $$
BEGIN
    IF NOT "alpine-home"._is_admin(p_admin_username, p_admin_password) THEN
        RETURN json_build_object('error', 'unauthorized');
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

    RETURN json_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION admin_delete_price_list(
    p_admin_username text,
    p_admin_password text,
    p_id bigint
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = "alpine-home", public
AS $$
BEGIN
    IF NOT "alpine-home"._is_admin(p_admin_username, p_admin_password) THEN
        RETURN json_build_object('error', 'unauthorized');
    END IF;

    DELETE FROM "alpine-home".price_list WHERE id = p_id;
    RETURN json_build_object('success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION admin_upsert_price_list(text, text, jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_insert_price_list(text, text, jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_delete_price_list(text, text, bigint) TO anon, authenticated;
