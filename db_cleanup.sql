GRANT USAGE ON SCHEMA "alpine-home" TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA "alpine-home" TO postgres;

-- 1. 쓰레기 데이터 삭제
DELETE FROM "alpine-home".dealers
WHERE category NOT IN ('Team Alpine', 'Alpine Dealer', 'Alpine Style Distributor', 'Alpine Sound Master');

-- 2. 유실된 기존 데이터 복구
INSERT INTO "alpine-home".dealers
SELECT * FROM public.dealers
WHERE id NOT IN (SELECT id FROM "alpine-home".dealers);
