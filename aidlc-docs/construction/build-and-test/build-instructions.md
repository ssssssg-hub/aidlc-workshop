# Build Instructions — Unit 2: Customer App

## Prerequisites
- **Node.js**: 20 LTS
- **npm**: 10+
- **Docker**: 24+ (통합 빌드 시)

## Build Steps

### 1. 의존성 설치
```bash
cd frontend-customer
npm install
```

### 2. 환경 변수 설정
```bash
# 개발 환경 (Vite dev server가 프록시 처리)
# 별도 환경 변수 불필요 — vite.config.ts에서 /api → localhost:8080 프록시 설정됨
```

### 3. 개발 서버 실행
```bash
npm run dev
# → http://localhost:3001 에서 접근
# 주의: Backend API (Unit 1)가 localhost:8080에서 실행 중이어야 API 호출 가능
```

### 4. 프로덕션 빌드
```bash
npm run build
```
- **출력 디렉토리**: `frontend-customer/dist/`
- **예상 번들 크기**: 200KB 이하 (gzip)

### 5. 프로덕션 빌드 미리보기
```bash
npm run preview
```

### 6. Docker 빌드
```bash
docker build -t frontend-customer .
docker run -p 3001:80 frontend-customer
```

### 7. Docker Compose (전체 시스템 통합)
```bash
# 프로젝트 루트에서
docker-compose up --build
```
- frontend-customer: http://localhost:3001
- backend: http://localhost:8080
- PostgreSQL: localhost:5432

## 빌드 성공 확인
- `npm run build` 실행 시 에러 없이 `dist/` 디렉토리 생성
- TypeScript 컴파일 에러 없음
- `dist/assets/` 에 JS, CSS 파일 생성됨

## Troubleshooting

### TypeScript 컴파일 에러
- `npx tsc --noEmit` 으로 타입 에러 확인
- `tsconfig.json`의 `strict: true` 설정으로 인한 타입 에러 수정

### 의존성 설치 실패
- `rm -rf node_modules package-lock.json && npm install` 로 클린 설치
- Node.js 버전 확인: `node -v` (20.x 필요)
