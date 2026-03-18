# Logical Components — Unit 1: Backend API

## Component Architecture Overview

```
+------------------------------------------------------------------+
|                    Spring Boot Application                        |
|                                                                  |
|  +------------------+  +------------------+  +----------------+  |
|  | Security Layer   |  | Web Layer        |  | SSE Layer      |  |
|  |                  |  |                  |  |                |  |
|  | JwtAuthFilter    |  | AuthController   |  | SseController  |  |
|  | SecurityConfig   |  | MenuController   |  | SseService     |  |
|  | CorsConfig       |  | OrderController  |  | (Emitter Mgmt) |  |
|  | SecurityHeaders  |  | TableController  |  +----------------+  |
|  | MdcFilter        |  | RecomController  |                      |
|  +------------------+  | ImageController  |                      |
|                        +------------------+                      |
|                               |                                  |
|  +------------------+  +------v-----------+  +----------------+  |
|  | Exception Layer  |  | Service Layer    |  | External Layer |  |
|  |                  |  |                  |  |                |  |
|  | GlobalException  |  | AuthService      |  | OpenAI Client  |  |
|  | Handler          |  | MenuService      |  | (RestClient)   |  |
|  +------------------+  | OrderService     |  +----------------+  |
|                        | TableService     |                      |
|                        | RecomService     |  +----------------+  |
|                        | ImageService     |  | File Storage   |  |
|                        +------------------+  | (Local FS)     |  |
|                               |              +----------------+  |
|                        +------v-----------+                      |
|                        | Repository Layer |                      |
|                        |                  |                      |
|                        | AdminRepo        |                      |
|                        | TableRepo        |                      |
|                        | SessionRepo      |                      |
|                        | MenuRepo         |                      |
|                        | CategoryRepo     |                      |
|                        | OrderRepo        |                      |
|                        | OrderItemRepo    |                      |
|                        | OrderHistoryRepo |                      |
|                        | OrderHistItem    |                      |
|                        +------------------+                      |
|                               |                                  |
+------------------------------------------------------------------+
                                |
                    +-----------v-----------+
                    |     PostgreSQL        |
                    |   (Docker Volume)     |
                    +-----------------------+
```

## Logical Component Inventory

### 1. Security Layer

| Component | Type | 책임 |
|---|---|---|
| JwtAuthenticationFilter | OncePerRequestFilter | JWT 토큰 추출, 검증, SecurityContext 설정 |
| SecurityConfig | @Configuration | SecurityFilterChain 정의, URL 패턴 접근 제어 |
| CorsConfig | @Configuration | CORS 정책 설정 (허용 Origin 명시) |
| JwtUtil | @Component | JWT 토큰 생성, 파싱, 검증 유틸리티 |
| MdcFilter | OncePerRequestFilter | 요청별 correlationId 생성 및 MDC 설정 |

### 2. Web Layer (Controllers)

| Component | Type | 책임 |
|---|---|---|
| AuthController | @RestController | 관리자/테이블 로그인 API |
| MenuController | @RestController | 메뉴 조회 API (고객용) |
| AdminMenuController | @RestController | 메뉴 CRUD API (관리자용) |
| OrderController | @RestController | 주문 생성/조회 API (고객용) |
| AdminOrderController | @RestController | 주문 관리 API (관리자용) |
| TableController | @RestController | 테이블 관리 API (관리자용) |
| RecommendationController | @RestController | AI 추천 API |
| ImageController | @RestController | 이미지 업로드/서빙 API |
| SseController | @RestController | SSE 구독 엔드포인트 |

### 3. Service Layer

| Component | Type | 책임 | 의존 |
|---|---|---|---|
| AuthService | @Service | 인증 로직, JWT 발급 | AdminRepo, TableRepo, SessionRepo, JwtUtil, PasswordEncoder |
| MenuService | @Service | 메뉴 CRUD, 카테고리 관리 | MenuRepo, CategoryRepo |
| OrderService | @Service | 주문 생성/조회/상태변경/삭제 | OrderRepo, OrderItemRepo, SseService |
| TableService | @Service | 테이블 설정, 결제 완료, 이력 조회 | TableRepo, SessionRepo, OrderRepo, OrderHistoryRepo, SseService |
| SseService | @Service | SSE emitter 관리, 이벤트 브로드캐스트 | ConcurrentHashMap (내부) |
| RecommendationService | @Service | AI 추천 로직 | MenuRepo, OpenAI Client |
| ImageService | @Service | 이미지 업로드/서빙 | 파일시스템 |

### 4. Repository Layer

| Component | Type | Entity |
|---|---|---|
| StoreRepository | JpaRepository | Store |
| AdminRepository | JpaRepository | Admin |
| TableRepository | JpaRepository | TableEntity |
| TableSessionRepository | JpaRepository | TableSession |
| CategoryRepository | JpaRepository | Category |
| MenuRepository | JpaRepository | Menu |
| OrderRepository | JpaRepository | Order |
| OrderItemRepository | JpaRepository | OrderItem |
| OrderHistoryRepository | JpaRepository | OrderHistory |
| OrderHistoryItemRepository | JpaRepository | OrderHistoryItem |

### 5. Exception Layer

| Component | Type | 책임 |
|---|---|---|
| GlobalExceptionHandler | @RestControllerAdvice | 글로벌 에러 핸들링, Spring 기본 에러 형식 |
| EntityNotFoundException | RuntimeException | 리소스 미존재 |
| AccountLockedException | RuntimeException | 계정 잠금 |
| InvalidSessionException | RuntimeException | 세션 비활성/만료 |
| OpenAiApiException | RuntimeException | OpenAI API 호출 실패 |

### 6. DTO Layer

| 구분 | DTOs |
|---|---|
| Auth | LoginRequest, TableLoginRequest, TokenResponse, TableTokenResponse |
| Menu | CreateMenuRequest, UpdateMenuRequest, MenuResponse, MenuDetailResponse, MenuOrderRequest, CategoryResponse |
| Order | CreateOrderRequest, OrderItemRequest, OrderResponse, UpdateStatusRequest |
| Table | SetupTableRequest, TableResponse, TableStatusResponse, OrderHistoryResponse |
| Recommendation | RecommendRequest, RecommendationResponse, RecommendedMenuItem |
| Image | ImageResponse |

### 7. Entity Layer

| Entity | Base | 주요 관계 |
|---|---|---|
| Store | BaseEntity | 1:N Admin, 1:N TableEntity, 1:N Category |
| Admin | BaseEntity | N:1 Store |
| TableEntity | BaseEntity | N:1 Store, 1:N TableSession |
| TableSession | BaseEntity | N:1 TableEntity, 1:N Order |
| Category | BaseEntity | N:1 Store, 1:N Menu |
| Menu | BaseEntity | N:1 Category, N:1 Store |
| Order | BaseEntity | N:1 TableSession, 1:N OrderItem |
| OrderItem | — | N:1 Order |
| OrderHistory | — | 1:N OrderHistoryItem |
| OrderHistoryItem | — | N:1 OrderHistory |

### 8. Configuration Components

| Component | 책임 |
|---|---|
| SecurityConfig | Spring Security 설정, FilterChain |
| CorsConfig | CORS 정책 |
| JpaAuditingConfig | `@EnableJpaAuditing` 활성화 |
| OpenAiConfig | OpenAI API 클라이언트 설정 (URL, API Key, 타임아웃) |
| ImageStorageConfig | 이미지 저장 경로 설정 |

### 9. External Integration

| Component | 대상 | 통신 방식 |
|---|---|---|
| OpenAI Client (RestClient) | OpenAI API | HTTPS REST (JSON) |
| PostgreSQL | 데이터베이스 | JDBC (HikariCP) |
| File System | 이미지 저장소 | 로컬 파일 I/O |
