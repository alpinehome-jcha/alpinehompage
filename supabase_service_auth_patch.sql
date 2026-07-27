-- AS 관리 (Service Management) 대리점 권한 부여 패치
-- 기존에는 admin, master만 가능했으나 dealer(대리점) 계정도 저장/삭제 가능하도록 수정

CREATE OR REPLACE FUNCTION "alpine-home".admin_upsert_service_record(p_admin_username text, p_admin_password text, p_id integer, p_record jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'alpine-home', 'extensions', 'public'
AS $function$
 DECLARE
   v_new_id integer;
 BEGIN
   IF NOT EXISTS (
     SELECT 1 FROM "alpine-home".users
     WHERE username = p_admin_username
       AND password_hash = crypt(p_admin_password, password_hash)
       AND role IN ('admin', 'master', 'dealer')
   ) THEN
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
 $function$;

CREATE OR REPLACE FUNCTION "alpine-home".admin_delete_service_record(p_admin_username text, p_admin_password text, p_id integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'alpine-home', 'extensions', 'public'
AS $function$
 BEGIN
   IF NOT EXISTS (
     SELECT 1 FROM "alpine-home".users
     WHERE username = p_admin_username
       AND password_hash = crypt(p_admin_password, password_hash)
       AND role IN ('admin', 'master', 'dealer')
   ) THEN
     RETURN json_build_object('error', 'unauthorized');
   END IF;

   DELETE FROM "alpine-home".service_management WHERE id = p_id;
   
   IF FOUND THEN
     RETURN json_build_object('success', true);
   ELSE
     RETURN json_build_object('error', 'Record not found');
   END IF;
 END;
 $function$;
