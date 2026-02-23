-- ============================================================
-- ALPINE Korea - Supabase 초기 설정 SQL (아이디/비밀번호 방식)
-- Supabase 대시보드 → SQL Editor에서 실행하세요
-- ============================================================

-- 1. pgcrypto 확장 활성화 (비밀번호 해시 처리)
create extension if not exists pgcrypto;

-- ============================================================
-- 2. users 테이블 생성 (이메일 없이 username 기반)
-- ============================================================
create table if not exists public.users (
  id         serial primary key,
  username   text unique not null,
  password_hash text not null,
  role       text not null default 'dealer',
  dealer_name text,
  category   text,
  created_at timestamptz default now()
);

-- RLS 활성화 (직접 읽기 불가 - RPC 함수로만 접근)
alter table public.users enable row level security;
-- 직접 SELECT 정책 없음 → RPC(security definer)로만 접근

-- ============================================================
-- 3. RPC: 로그인 검증 함수 (서버측 비밀번호 해시 비교)
-- ============================================================
create or replace function public.verify_login(p_username text, p_password text)
returns json
language plpgsql
security definer
as $$
declare
  v_user public.users%rowtype;
begin
  select * into v_user
  from public.users
  where username = p_username
    and password_hash = crypt(p_password, password_hash);

  if not found then
    return null;
  end if;

  return json_build_object(
    'id',          v_user.id,
    'username',    v_user.username,
    'role',        v_user.role,
    'dealer_name', v_user.dealer_name,
    'category',    v_user.category
  );
end;
$$;

-- anon(비로그인) 사용자도 로그인 시도 가능하도록 실행 권한 부여
grant execute on function public.verify_login to anon;

-- ============================================================
-- 4. RPC: 비밀번호 변경 함수 (현재 비밀번호 검증 후 변경)
-- ============================================================
create or replace function public.update_password(
  p_username         text,
  p_current_password text,
  p_new_password     text
)
returns boolean
language plpgsql
security definer
as $$
declare
  v_found boolean;
begin
  -- 현재 비밀번호 검증
  select true into v_found
  from public.users
  where username = p_username
    and password_hash = crypt(p_current_password, password_hash);

  if not found then
    return false;
  end if;

  -- 새 비밀번호로 업데이트
  update public.users
  set password_hash = crypt(p_new_password, gen_salt('bf'))
  where username = p_username;

  return true;
end;
$$;

grant execute on function public.update_password to anon;

-- ============================================================
-- 5. 초기 계정 등록 (비밀번호는 bcrypt로 자동 해시 처리됨)
-- ============================================================
insert into public.users (username, password_hash, role, dealer_name) values
  ('alpineaudio', crypt('6198107276aa!!', gen_salt('bf')), 'admin',  '관리자'),
  ('master',      crypt('master123',      gen_salt('bf')), 'master', 'Sound Master'),
  ('team',        crypt('team123',        gen_salt('bf')), 'team',   'Team Alpine'),
  ('style',       crypt('style123',       gen_salt('bf')), 'style',  'Alpine Style'),
  ('region',      crypt('region123',      gen_salt('bf')), 'region', 'Regional Dist'),
  ('dealer',      crypt('dealer123',      gen_salt('bf')), 'dealer', 'Dealer')
on conflict (username) do nothing;

-- ============================================================
-- 딜러 추가 시 (admin.html에서 딜러 계정 생성할 때 사용)
-- ============================================================
-- insert into public.users (username, password_hash, role, dealer_name, category) values
--   ('dealer01', crypt('초기비밀번호', gen_salt('bf')), 'dealer', '대리점명', 'Alpine Dealer');
