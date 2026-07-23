-- Fix partner_board files column in alpine-home schema
UPDATE "alpine-home".partner_board 
SET files = '[{"name":"20260311 현대기아 RANC MIC.pdf","path":"assets/files/20260311 현대기아 RANC MIC.pdf","url":"https://raw.githubusercontent.com/alpinehome-jcha/alpinehompage/main/assets/files/20260311 %ED%98%84%EB%8C%80%EA%B8%B0%EC%95%84 RANC MIC.pdf"}]'::jsonb
WHERE id = 4;

-- Ensure public schema also updated if synced
UPDATE public.partner_board 
SET files = '[{"name":"20260311 현대기아 RANC MIC.pdf","path":"assets/files/20260311 현대기아 RANC MIC.pdf","url":"https://raw.githubusercontent.com/alpinehome-jcha/alpinehompage/main/assets/files/20260311 %ED%98%84%EB%8C%80%EA%B8%B0%EC%95%84 RANC MIC.pdf"}]'::jsonb
WHERE id = 4;
