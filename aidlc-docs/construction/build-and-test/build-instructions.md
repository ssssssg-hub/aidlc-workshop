# Build Instructions — Unit 1: Backend API

## Prerequisites
- Java 21 (JDK)
- Docker & Docker Compose
- Gradle 8.x (또는 Gradle Wrapper 사용)

## Environment Variables

| 변수 | 설명 | 기본값 |
|---|---|---|
| DB_USERNAME | PostgreSQL 사용자명 | tableorder |
| DB_PASSWORD | PostgreSQL 비밀번호 | tableorder |
| JWT_SECRET | JWT 서명 키 (최소 256bit) | 개발용 기본값 포함 |
| OPENAI_API_KEY | OpenAI API 키 | (선택) |
| IMAGE_UPLOAD_DIR | 이미지 업로드 경로 | ./uploads/images |

## Build Steps

### 1. PostgreSQL 시작 (Docker)
```bash
docker compose up -d postgres
```

### 2. 프로젝트 빌드
```bash
cd backend
./gradlew clean build
```

### 3. 애플리케이션 실행 (로컬)
```bash
./gradlew bootRun
```

### 4. Docker 이미지 빌드 및 전체 실행
```bash
# 프로젝트 루트에서
cd backend && ./gradlew clean build -x test
docker compose up --build
```

## 빌드 검증
- 빌드 성공: `BUILD SUCCESSFUL` 메시지 확인
- 빌드 아티팩트: `backend/build/libs/tableorder-backend-0.0.1-SNAPSHOT.jar`
- Health Check: `GET http://localhost:8080/actuator/health` → `{"status":"UP"}`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`

## Troubleshooting

### PostgreSQL 연결 실패
- Docker 컨테이너 실행 확인: `docker compose ps`
- 포트 충돌 확인: `lsof -i :5432`

### Flyway 마이그레이션 실패
- DB 초기화: `docker compose down -v && docker compose up -d postgres`
