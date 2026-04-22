const fs = require('fs');

// Read the JS file
const fileContent = fs.readFileSync('js/dealer-data.js', 'utf-8');

// Extract the initialDealerData array
const match = fileContent.match(/const initialDealerData = (\[[\s\S]*?\]);\r?\nconst DEALER_DATA_VERSION/);
if (!match) {
    console.error("Could not find initialDealerData in js/dealer-data.js");
    // Show first 100 and last 100 chars to debug
    console.log("File content start:", fileContent.substring(0, 50));
    console.log("File content sample near end:", fileContent.substring(fileContent.length - 200));
    process.exit(1);
}

const dealerData = JSON.parse(match[1]);

let sql = `-- ============================================================
-- ALPINE Korea - Supabase dealers 테이블 생성 및 데이터 입력
-- Supabase 대시보드 → SQL Editor에서 실행하세요
-- ============================================================

-- 1. dealers 테이블 생성
CREATE TABLE IF NOT EXISTS public.dealers (
    id BIGINT PRIMARY KEY,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    badge TEXT,
    address TEXT,
    phone TEXT,
    "desc" TEXT,
    username TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    region TEXT,
    homepage TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS 활성화 (누구나 읽을 수 있게 허용, 쓰기는 관리자/인증자만)
ALTER TABLE public.dealers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to dealers"
ON public.dealers
FOR SELECT
USING (true);

-- Insert 데이터 관리용으로 anon 역할(익명 접근)에게 변경 권한을 임시 부여하거나
-- 관리자 전용으로 남길 수 있습니다. (여기서는 admin.html 에서 anon api키로 
-- 수정할 수 있어야 하는 구조이므로 접근 허용 정책을 엽니다.)
CREATE POLICY "Allow anon insert/update/delete for dealers"
ON public.dealers
FOR ALL
USING (true)
WITH CHECK (true);

-- 3. 데이터 삽입
INSERT INTO public.dealers (id, category, name, badge, address, phone, "desc", username, lat, lng, region, homepage) VALUES
`;

const values = dealerData.map(d => {
    const lat = d.lat !== undefined ? d.lat : 'NULL';
    const lng = d.lng !== undefined ? d.lng : 'NULL';
    const region = d.region ? `'${d.region.replace(/'/g, "''")}'` : 'NULL';
    const badge = d.badge ? `'${d.badge.replace(/'/g, "''")}'` : 'NULL';
    const desc = d.desc ? `'${d.desc.replace(/'/g, "''")}'` : 'NULL';
    const username = d.username ? `'${d.username.replace(/'/g, "''")}'` : 'NULL';
    const phone = d.phone ? `'${d.phone.replace(/'/g, "''")}'` : 'NULL';
    const addr = d.address ? `'${d.address.replace(/'/g, "''")}'` : 'NULL';
    const name = d.name ? `'${d.name.replace(/'/g, "''")}'` : 'NULL';
    const homepage = d.homepage ? `'${d.homepage.replace(/'/g, "''")}'` : 'NULL';

    return `(${d.id}, '${d.category}', ${name}, ${badge}, ${addr}, ${phone}, ${desc}, ${username}, ${lat}, ${lng}, ${region}, ${homepage})`;
});

sql += values.join(',\n') + '\nON CONFLICT (id) DO UPDATE SET\n' +
    'category = EXCLUDED.category,\n' +
    'name = EXCLUDED.name,\n' +
    'badge = EXCLUDED.badge,\n' +
    'address = EXCLUDED.address,\n' +
    'phone = EXCLUDED.phone,\n' +
    '"desc" = EXCLUDED."desc",\n' +
    'username = EXCLUDED.username,\n' +
    'lat = EXCLUDED.lat,\n' +
    'lng = EXCLUDED.lng,\n' +
    'region = EXCLUDED.region,\n' +
    'homepage = EXCLUDED.homepage,\n' +
    'updated_at = NOW();\n';

fs.writeFileSync('dealers_migration.sql', sql, 'utf-8');
console.log("dealers_migration.sql successfully generated.");
