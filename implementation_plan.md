# Implementation Plan — local-supabase 브랜치 생성 및 Vercel 배포 (2026-04-25)

## 사전 조건 확인
- `.gitignore` 없음 → 새로 생성 필요
- `.env.local` git 추적 중 → 즉시 인덱스에서 제거 필요 (VERCEL_TOKEN, GITHUB_PAT, DB_PASSWORD 노출 위험)

---

## 실행 순서

### STEP 1 — 보안 처리 (필수 선행)
1. `.gitignore` 생성: `.env.local`, `.env*`, `node_modules/` 등 제외
2. `git rm --cached .env.local` — 인덱스에서 제거 (파일 자체는 유지)

### STEP 2 — 브랜치 생성
```bash
git checkout -b local-supabase
```

### STEP 3 — 코드 상태 확인
- `js/config.js`: `DB_MODE: 'local'`, URL `http://183.101.105.167:8000` 이미 적용됨 ✅
- 오늘 수정된 버그 픽스(140개 HTML, auth.js, support 페이지 등) 전체 포함하여 커밋

### STEP 4 — 커밋 및 GitHub 푸시
```bash
git add -A
git commit -m "local-supabase 브랜치: 로컬 인프라 연동 및 버그 수정"
git push -u origin local-supabase
```

### STEP 5 — Vercel 환경변수 설정 (CLI)
VERCEL_TOKEN을 사용하여 Preview/local-supabase 브랜치 전용으로 설정:
- `NEXT_PUBLIC_SUPABASE_URL` = `http://183.101.105.167:8000`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `.env.local`의 `NEXT_PUBLIC_LOCAL_SUPABASE_ANON_KEY` 값

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL preview --token $VERCEL_TOKEN
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview --token $VERCEL_TOKEN
```
> ⚠️ 정적 HTML 사이트 특성상 Vercel env var는 빌드 타임에만 주입됨.
> 실제 브라우저 동작은 `config.js` 하드코딩값으로 제어됨.

### STEP 6 — 리디플로이 및 URL 보고
```bash
vercel redeploy --token $VERCEL_TOKEN
```

---

## 주의사항
- main 브랜치에는 영향 없음 (Preview 환경 전용)
- `.env.local`은 절대 커밋하지 않음
- `183.101.105.167`은 공인 IP이므로 Vercel 서버에서 접근 가능
