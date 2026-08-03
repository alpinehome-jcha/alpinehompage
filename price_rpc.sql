CREATE OR REPLACE FUNCTION admin_upsert_price_list(p_data jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = "alpine-home", public
AS $$
DECLARE
    v_role text;
BEGIN
    v_role := _is_admin();
    IF v_role NOT IN ('admin', 'master') THEN
        RAISE EXCEPTION 'Unauthorized: only admin or master can modify price list';
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
        NULLIF(rec->>'msrp', '')::integer,
        NULLIF(rec->>'dist_price', '')::integer,
        NULLIF(rec->>'dealer_price', '')::integer,
        NULLIF(rec->>'sort_order', '')::numeric
    FROM jsonb_array_elements(p_data) AS rec
    ON CONFLICT (id) DO UPDATE SET
        category = EXCLUDED.category,
        product_category = EXCLUDED.product_category,
        product = EXCLUDED.product,
        msrp = EXCLUDED.msrp,
        dist_price = EXCLUDED.dist_price,
        dealer_price = EXCLUDED.dealer_price,
        sort_order = EXCLUDED.sort_order;
END;
$$;

CREATE OR REPLACE FUNCTION admin_insert_price_list(p_data jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = "alpine-home", public
AS $$
DECLARE
    v_role text;
BEGIN
    v_role := _is_admin();
    IF v_role NOT IN ('admin', 'master') THEN
        RAISE EXCEPTION 'Unauthorized: only admin or master can modify price list';
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
        NULLIF(rec->>'msrp', '')::integer,
        NULLIF(rec->>'dist_price', '')::integer,
        NULLIF(rec->>'dealer_price', '')::integer,
        NULLIF(rec->>'sort_order', '')::numeric
    FROM jsonb_array_elements(p_data) AS rec;
END;
$$;

CREATE OR REPLACE FUNCTION admin_delete_price_list(p_id bigint)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = "alpine-home", public
AS $$
DECLARE
    v_role text;
BEGIN
    v_role := _is_admin();
    IF v_role NOT IN ('admin', 'master') THEN
        RAISE EXCEPTION 'Unauthorized: only admin or master can modify price list';
    END IF;

    DELETE FROM "alpine-home".price_list WHERE id = p_id;
END;
$$;
