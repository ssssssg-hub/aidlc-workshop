# Code Generation Plan — Unit 1: Backend API

## Unit Context
- **유형**: Spring Boot 모놀리스 백엔드
- **기술**: Java 21, Spring Boot 3.4.x, Gradle Kotlin DSL, PostgreSQL, Flyway
- **코드 위치**: `backend/` (workspace root)
- **스토리**: 27개 (US-C01~C06, US-A01~A04)

## Execution Steps

- [x] Step 1: 프로젝트 구조 및 빌드 설정 (build.gradle.kts, application.yml, Dockerfile, docker-compose.yml)
- [x] Step 2: Entity 레이어 (BaseEntity, Store, Admin, TableEntity, TableSession, Category, Menu, Order, OrderItem, OrderHistory, OrderHistoryItem)
- [x] Step 3: Repository 레이어 (모든 JpaRepository 인터페이스)
- [x] Step 4: DTO 레이어 (Request/Response DTOs)
- [x] Step 5: Security 레이어 (SecurityConfig, JwtUtil, JwtAuthFilter, MdcFilter, CorsConfig)
- [x] Step 6: Service 레이어 (AuthService, MenuService, OrderService, TableService, SseService, RecommendationService, ImageService)
- [x] Step 7: Controller 레이어 (Auth, Menu, Order, Table, SSE, Recommendation, Image Controllers)
- [x] Step 8: Exception 레이어 (GlobalExceptionHandler, 커스텀 예외)
- [x] Step 9: Flyway 마이그레이션 스크립트 (V1__init.sql)
- [x] Step 10: Logback 설정 (logback-spring.xml)
- [x] Step 11: Unit Tests — Service 레이어 (AuthServiceTest, MenuServiceTest, OrderServiceTest, TableServiceTest)
- [x] Step 12: Unit Tests — Controller 레이어 (MockMvc 테스트)
- [x] Step 13: Integration Tests (Testcontainers)
- [x] Step 14: 코드 생성 요약 문서

## Story Traceability
모든 27개 스토리가 Step 2~8에서 구현됨 (API 레이어)
