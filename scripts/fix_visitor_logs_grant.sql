GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "alpine-home".visitor_logs TO anon, authenticated, service_role;
SELECT setval(pg_get_serial_sequence('"alpine-home".visitor_logs', 'id'), coalesce(max(id),0) + 1, false) FROM "alpine-home".visitor_logs;
