# Infrastructure Design — Unit 3: Admin App

## 배포 아키텍처

```
Docker Compose
├── frontend-admin (nginx:alpine)
│   ├── Vite 빌드 결과물 서빙 (static files)
│   ├── nginx.conf (SPA 라우팅 + Security Headers + API 프록시)
│   └── Port: 3001
├── backend (Spring Boot) ← Unit 1 담당
│   └── Port: 8080
└── postgres ← Unit 1 담당
    └── Port: 5432
```

## Docker 구성

### Dockerfile (multi-stage build)

**Stage 1 — Build**:
- Base: `node:20-alpine` (정확한 버전 고정, SECURITY-10)
- `npm ci` (lock file 기반 설치)
- `npm run build` (Vite 프로덕션 빌드)

**Stage 2 — Serve**:
- Base: `nginx:1.25-alpine` (정확한 버전 고정)
- 빌드 결과물을 `/usr/share/nginx/html`에 복사
- 커스텀 `nginx.conf` 복사
- Port 80 노출

### nginx.conf 설정

| 설정 | 내용 |
|---|---|
| SPA 라우팅 | `try_files $uri $uri/ /index.html` |
| API 프록시 | `/api/` → `http://backend:8080/api/` |
| SSE 프록시 | `/api/admin/orders/stream` → 백엔드 (proxy_buffering off, chunked transfer) |
| Security Headers | CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy (SECURITY-04) |
| gzip 압축 | js, css, html, json 압축 |
| 캐싱 | 정적 자산 `Cache-Control: max-age=31536000` (해시 파일명), index.html `no-cache` |
| 디렉토리 리스팅 | `autoindex off` (SECURITY-09) |

### Docker Compose 서비스 정의

```yaml
frontend-admin:
  build:
    context: ./frontend-admin
    dockerfile: Dockerfile
  ports:
    - "3001:80"
  depends_on:
    - backend
  environment:
    - VITE_API_BASE_URL=/api
```

## 개발 환경

| 항목 | 설정 |
|---|---|
| 개발 서버 | `npm run dev` (Vite dev server, port 5174) |
| API 프록시 | Vite `server.proxy` 설정으로 `/api` → `http://localhost:8080` |
| HMR | Vite 기본 HMR 활용 |

## 환경 변수

| 변수 | 개발 | 프로덕션 |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080` | `/api` (nginx 프록시) |
