# Infrastructure Design — Unit 2: Customer App

## 개요
Customer App은 정적 SPA로, Docker 컨테이너에서 Nginx로 서빙.

## 컨테이너 구성

### frontend-customer 컨테이너
- **베이스 이미지**: node:20-alpine (빌드) → nginx:alpine (서빙)
- **멀티스테이지 빌드**: Stage 1에서 Vite 빌드, Stage 2에서 Nginx로 정적 파일 서빙
- **포트**: 80 (컨테이너 내부), 3001 (호스트 매핑)
- **Nginx 설정**:
  - SPA 라우팅: 모든 경로 → index.html (try_files)
  - API 프록시: `/api/*` → backend:8080 (리버스 프록시)
  - gzip 압축 활성화
  - 정적 파일 캐시 헤더 (js/css: 1년, html: no-cache)
  - Security 헤더: X-Content-Type-Options, X-Frame-Options, Referrer-Policy

## 환경 변수

| 변수 | 값 | 용도 |
|---|---|---|
| VITE_API_BASE_URL | /api | API 프록시 경로 (Nginx에서 백엔드로 전달) |

## Docker Compose 연동

```yaml
frontend-customer:
  build:
    context: ./frontend-customer
    dockerfile: Dockerfile
  ports:
    - "3001:80"
  depends_on:
    - backend
```

## Nginx 설정 요약

```
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # gzip
    gzip on;
    gzip_types text/css application/javascript application/json;

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header Referrer-Policy strict-origin-when-cross-origin;

    # API proxy
    location /api/ {
        proxy_pass http://backend:8080/api/;
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static file caching
    location ~* \.(js|css|png|jpg|jpeg|gif|webp|svg|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```
