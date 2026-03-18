# Build and Test Summary — Unit 2: Customer App

## Build Status
- **빌드 도구**: Vite 6.x + TypeScript 5.6
- **빌드 명령**: `npm run build`
- **빌드 아티팩트**: `frontend-customer/dist/`
- **Docker 이미지**: `frontend-customer` (nginx:alpine 기반)
# Build and Test Summary — Unit 1: Backend API

## Build Status
- Build Tool: Gradle 8.x (Kotlin DSL)
- Java: 21 (LTS)
- Spring Boot: 3.4.1
- Build Artifact: `backend/build/libs/tableorder-backend-0.0.1-SNAPSHOT.jar`

## Test Execution Summary

### Unit Tests
- **프레임워크**: Vitest 2.x + @testing-library/react
- **테스트 파일**: 13개
- **테스트 케이스**: ~20개
- **커버리지 영역**: utils, services, store, components, pages
- **실행 명령**: `npm test`

### Integration Tests
- **방식**: 수동 + Docker Compose 환경
- **시나리오**: 7개 (로그인, 메뉴 조회, 주문, 추가 주문, 주문 내역, AI 추천, Nginx 프록시)
- **사전 조건**: Unit 1 (Backend API) 실행 필요

### Performance Tests
- **번들 크기**: 200KB 이하 (gzip) 목표
- **초기 로딩**: 5초 이내 목표
- **측정 도구**: Chrome DevTools, Lighthouse

### Additional Tests
- **Contract Tests**: N/A (REST API 계약은 component-methods.md에 정의, 통합 테스트에서 검증)
- **Security Tests**: N/A (프론트엔드 — 보안 헤더는 nginx.conf에서 설정, XSS는 React 기본 방어)
- **E2E Tests**: 통합 테스트 시나리오에 포함

## 생성된 파일
1. ✅ `build-instructions.md` — 빌드 절차
2. ✅ `unit-test-instructions.md` — 단위 테스트 실행 방법
3. ✅ `integration-test-instructions.md` — 통합 테스트 시나리오
4. ✅ `performance-test-instructions.md` — 성능 테스트 방법
5. ✅ `build-and-test-summary.md` — 본 문서

## Next Steps
- Unit 1 (Backend API), Unit 3 (Admin App) 완료 후 Docker Compose로 전체 통합 테스트 실행
- 통합 테스트 시나리오 수동 검증
- 번들 크기 및 초기 로딩 시간 측정
| 테스트 클래스 | 테스트 수 | 대상 |
|---|---|---|
| AuthServiceTest | 5 | 인증 로직 |
| MenuServiceTest | 4 | 메뉴 CRUD |
| OrderServiceTest | 5 | 주문 처리 |
| TableServiceTest | 3 | 테이블 관리 |
| AuthControllerTest | 2 | API 엔드포인트 |
| **합계** | **19** | |

### Integration Tests
| 테스트 클래스 | 테스트 수 | 대상 |
|---|---|---|
| TableOrderApplicationTests | 1 | Context 로딩 + Testcontainers |

### Performance Tests
- 상태: 선택사항 (MVP 단일 매장)
- 도구: k6 권장
- 스크립트: performance-test-instructions.md 참조

## 생성된 파일 목록

### Application Code (`backend/`)
- Entity: 11개 (BaseEntity, Store, Admin, TableEntity, TableSession, Category, Menu, Order, OrderItem, OrderHistory, OrderHistoryItem)
- Repository: 10개
- DTO: 17개 (record 기반)
- Service: 7개 (Auth, Menu, Order, Table, SSE, Recommendation, Image)
- Controller: 8개
- Security: 3개 (JwtUtil, JwtAuthFilter, AuthDetails)
- Config: 3개 (SecurityConfig, CorsConfig, MdcFilter)
- Exception: 3개 (GlobalExceptionHandler, AccountLockedException, OpenAiApiException)
- Migration: 2개 (V1__init.sql, V2__seed_data.sql)
- Config Files: application.yml, logback-spring.xml

### Infrastructure
- docker-compose.yml (PostgreSQL + Backend)
- Dockerfile
- build.gradle.kts, settings.gradle.kts

### Tests
- Service Tests: 4개 클래스 (19 테스트)
- Controller Tests: 1개 클래스 (2 테스트)
- Integration Tests: 1개 클래스 (1 테스트)

## API Endpoints Summary

| Method | Path | Auth | 설명 |
|---|---|---|---|
| POST | /api/admin/auth/login | Public | 관리자 로그인 |
| POST | /api/table/auth/login | Public | 테이블 로그인 |
| GET | /api/menus | TABLE | 메뉴 조회 |
| GET | /api/menus/{id} | TABLE | 메뉴 상세 |
| GET | /api/categories | Auth | 카테고리 조회 |
| POST | /api/orders | TABLE | 주문 생성 |
| GET | /api/orders | TABLE | 세션별 주문 조회 |
| POST | /api/recommendations | TABLE | AI 추천 |
| GET | /api/admin/menus | ADMIN | 메뉴 조회 (관리자) |
| POST | /api/admin/menus | ADMIN | 메뉴 등록 |
| PUT | /api/admin/menus/{id} | ADMIN | 메뉴 수정 |
| DELETE | /api/admin/menus/{id} | ADMIN | 메뉴 삭제 |
| PUT | /api/admin/menus/order | ADMIN | 메뉴 순서 변경 |
| GET | /api/admin/orders | ADMIN | 테이블별 주문 조회 |
| PUT | /api/admin/orders/{id}/status | ADMIN | 주문 상태 변경 |
| DELETE | /api/admin/orders/{id} | ADMIN | 주문 삭제 |
| GET | /api/admin/orders/stream | ADMIN | SSE 구독 |
| POST | /api/admin/tables | ADMIN | 테이블 설정 |
| POST | /api/admin/tables/{id}/payment-complete | ADMIN | 결제 완료 |
| GET | /api/admin/tables | ADMIN | 테이블 현황 |
| GET | /api/admin/tables/{id}/history | ADMIN | 과거 내역 |
| POST | /api/admin/images | ADMIN | 이미지 업로드 |
| GET | /api/images/{filename} | Public | 이미지 서빙 |

## Next Steps
- 프론트엔드 팀과 API 연동 시작 (Unit 2: Customer App, Unit 3: Admin App)
- Swagger UI에서 API 문서 확인: `http://localhost:8080/swagger-ui/index.html`
