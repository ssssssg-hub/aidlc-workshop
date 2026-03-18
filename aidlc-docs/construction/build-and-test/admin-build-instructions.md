# Build Instructions — Unit 3: Admin App

## Prerequisites
- **Node.js**: v20.x (LTS)
- **npm**: v10.x
- **Docker**: v24+ (배포 빌드 시)
- **OS**: macOS / Linux / Windows

## Build Steps

### 1. Install Dependencies
```bash
cd frontend-admin
npm install
```

### 2. Configure Environment
```bash
# 개발 환경 (Backend API가 localhost:8080에서 실행 중이어야 함)
# vite.config.ts의 proxy 설정이 자동으로 /api → localhost:8080 프록시

# 프로덕션 환경 변수 (Docker 빌드 시 자동 적용)
# VITE_API_BASE_URL=/api
```

### 3. Development Build
```bash
npm run dev
# → http://localhost:5174 에서 실행
# → Backend API는 http://localhost:8080 에서 실행 중이어야 함
```

### 4. Production Build
```bash
npm run build
# → dist/ 디렉토리에 빌드 결과물 생성
```

### 5. Docker Build
```bash
docker build -t tableorder-admin .
docker run -p 3001:80 tableorder-admin
# → http://localhost:3001 에서 실행
```

### 6. Docker Compose (전체 시스템)
```bash
# 프로젝트 루트에서
docker-compose -f frontend-admin/docker-compose.admin.yml up --build
```

## Verify Build Success
- **개발 빌드**: 브라우저에서 `http://localhost:5174` 접속 → 로그인 페이지 표시
- **프로덕션 빌드**: `dist/` 디렉토리에 `index.html`, `assets/` 폴더 생성 확인
- **번들 사이즈**: gzip 기준 500KB 이하 확인 (`npm run build` 출력에서 확인)

## Troubleshooting

### npm install 실패
- **원인**: Node.js 버전 불일치
- **해결**: `node -v`로 v20.x 확인, nvm 사용 시 `nvm use 20`

### TypeScript 컴파일 에러
- **원인**: 타입 불일치
- **해결**: `npx tsc --noEmit`으로 에러 위치 확인 후 수정

### Vite dev server 프록시 에러
- **원인**: Backend API 미실행
- **해결**: Unit 1 Backend API가 `localhost:8080`에서 실행 중인지 확인
