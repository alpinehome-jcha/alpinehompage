# JCH Auto Local Server SSH Connection Info (Alpine & Toyota-PPO 담당: jchauto-gjhan) [v1.1]

본 문서는 알파인 코리아 홈페이지(`www.alpine-korea.co.kr`) 및 도요타 PPO 관리 시스템(`t-ppo.jchauto.co.kr`) 담당 개발자를 위한 전용 SSH 접속, 디렉토리 권한 및 Docker 컨테이너 관리 가이드입니다.

---

## 🖥️ Server Details

### 1. Server 1: Primary Production Web Server (1번 메인 서버)
- **허용 사용자**: `gjhan` (전용)
- **Host (내부망/VPN)**: `192.168.0.31` (권장)
- **Host (외부망/공용)**: `183.101.105.167` (사무실 IP 방화벽 적용)
- **Port**: `8282`
- **Username**: `jchauto-gjhan`
- **SSH Key**: `antigravity_gjhan_key` (개인키)
- **접속 명령어**:
  ```bash
  ssh -p 8282 -i "C:\Users\martin\.ssh\antigravity_gjhan_key" jchauto-gjhan@192.168.0.31
  ```

### 2. Server 2: Standby Clone / Server (2번 대기 서버)
- **Host (내부망/VPN)**: `192.168.0.30` (WireGuard VPN 접속 시 직접 연결)
- **Port**: `8282`
- **Username**: `jchauto-gjhan`
- **SSH Key**: `antigravity_gjhan_key`
- **접속 명령어**:
  ```bash
  ssh -p 8282 -i "C:\Users\martin\.ssh\antigravity_gjhan_key" jchauto-gjhan@192.168.0.30
  ```

---

## 📂 담당 프로젝트 및 허용 권한 범위

| 담당 프로젝트 | 디렉토리 경로 (Server 1) | 허용 Docker 컨테이너 | 세부 권한 |
| :--- | :--- | :--- | :---: |
| **알파인 홈페이지** | `/home/jchauto/alpine-korea-app` | `alpine-korea-blue`<br>`alpine-korea-green`<br>`alpine-korea-blue-clone` | **`rwx` 소스 편집 / 컨테이너 제어 / 배포** |
| **도요타 PPO 시스템** | `/home/jchauto/apps/toyota-ppo` | `toyota-ppo-blue`<br>`toyota-ppo-green`<br>`toyota-ppo`<br>`toyota-ppo-clone` | **`rwx` 소스 편집 / 컨테이너 제어 / 배포** |
| **Supabase DB** | `127.0.0.1:5432` / `6543` | - | **SSH 터널링 및 직접 쿼리 가능** |
| **Nginx 서비스 리로드** | `/etc/nginx/sites-available/*` | - | `sudo nginx -t`, `sudo systemctl reload nginx`, `sudo sed` |
| **타 프로젝트 (격리)** | 솔라가드, 스페라, 카오디오, n8n 등 | MariaDB, Supabase, n8n 등 | **수정/삭제/조작 완전 차단 (`Permission denied`)** |

---

## 🐳 Docker 컨테이너 및 배포 관리 명령어 안내

`jchauto-gjhan` 계정에는 타 서비스를 침범하지 않도록 안전하게 격리된 관리 도구가 기본 탑재되어 있습니다.

```bash
# 1. 담당 컨테이너 전체 상태 확인 (Alpine + Toyota-PPO)
docker ps
# 또는
toyota-docker ps

# 2. 실시간 로그 확인
docker logs -f toyota-ppo-blue
docker logs --tail 50 alpine-korea-blue

# 3. 컨테이너 재시작
docker restart toyota-ppo-blue
docker restart alpine-korea-blue

# 4. 무중단 배포 실행
deploy-toyota    # (도요타 PPO Blue-Green 배포)
deploy-alpine    # (알파인 코리아 배포)
```

---

## 🔐 SSH Key 정보 및 전달 안내
* **전달할 파일**: **`antigravity_gjhan_key`** (단 1개 파일)
* **로컬 저장 위치**: `C:\Users\martin\.ssh\antigravity_gjhan_key`
* **담당자 PC 전달 방법**:
  * 담당자 PC의 `~/.ssh/` 폴더에 `antigravity_gjhan_key` 파일을 복사한 후 위 접속 명령어로 접속하도록 전달하시면 됩니다.

---
**최종 업데이트**: 2026-09-09  
**버전**: v1.1  
**담당 계정**: jchauto-gjhan  
**관리자**: Antigravity