docker exec supabase-db psql -U postgres -c "
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema='alpine-home' AND table_name='dealers';
"
