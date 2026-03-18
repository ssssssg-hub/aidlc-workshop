# NFR Design Patterns — Unit 1: Backend API

## 1. Security Patterns

### SEC-PATTERN-01: JWT Authentication Filter
- **패턴**: OncePerRequestFilter 기반 JWT 인증 필터
- **동작**:
  1. `Authorization: Bearer {token}` 헤더에서 토큰 추출
  2. 서명 검증 + 만료 확인
  3. 토큰에서 사용자 정보 추출 (storeId, userId/tableId, role, sessionId)
  4. `SecurityContextHolder`에 인증 정보 설정
  5. 검증 실패 시: HTTP 401 + JSON 에러 응답 (`errorCode`, `message`)
- **적용**: 모든 보호된 엔드포인트

### SEC-PATTERN-02: URL Pattern-Based Access Control
- **패턴**: Spring Security `SecurityFilterChain` URL 패턴 매칭
- **규칙**:

| URL Pattern | 접근 권한 | 설명 |
|---|---|---|
| `/api/admin/auth/login` | permitAll | 관리자 로그인 |
| `/api/table/auth/login` | permitAll | 테이블 로그인 |
| `/api/images/**` | permitAll | 이미지 서빙 (공개) |
| `/api/admin/**` | ROLE_ADMIN | 관리자 전용 API |
| `/api/orders/**` | ROLE_TABLE | 테이블 주문 API |
| `/api/menus/**` | ROLE_TABLE | 테이블 메뉴 조회 |
| `/api/recommendations/**` | ROLE_TABLE | AI 추천 |
| `/api/categories/**` | authenticated | 카테고리 조회 |
| `/actuator/health` | permitAll | Health Check |
| 그 외 | denyAll | 기본 거부 |

### SEC-PATTERN-03: Store-Level Data Isolation
- **패턴**: storeId 기반 데이터 격리 (Object-Level Authorization)
- **동작**: JWT 토큰의 storeId와 요청 데이터의 storeId 일치 여부 검증
- **적용**: 모든 데이터 조회/변경 API
- **구현**: Service 레이어에서 storeId 검증 로직 포함

### SEC-PATTERN-04: Password Security
- **패턴**: BCryptPasswordEncoder (strength 10)
- **적용**: Admin 비밀번호, Table 비밀번호
- **로그인 시도 제한**: 5회 실패 → 15분 잠금 (failedLoginAttempts + lockedUntil)

### SEC-PATTERN-05: Security Headers Filter
- **패턴**: Spring Security 기본 헤더 + 커스텀 헤더 설정
- **헤더**: X-Content-Type-Options, X-Frame-Options, HSTS, Referrer-Policy, CSP

---

## 2. Performance Patterns

### PERF-PATTERN-01: SSE Connection Management
- **패턴**: ConcurrentHashMap 기반 SseEmitter 관리
- **구성요소**:
  - `ConcurrentHashMap<String, SseEmitter>`: 관리자 연결 관리
  - Heartbeat: 30초 간격 ping 이벤트 전송
  - 타임아웃: 30분 (SseEmitter timeout)
  - 자동 정리: onCompletion, onTimeout, onError 콜백으로 emitter 제거
- **이벤트 브로드캐스트**: 등록된 모든 emitter에 이벤트 전송, 실패 시 해당 emitter 제거
- **재연결 지원**: `retry` 필드 설정 (3초), 클라이언트 자동 재연결 유도

### PERF-PATTERN-02: Database Connection Pool
- **패턴**: HikariCP (Spring Boot 기본)
- **설정**:
  - maximumPoolSize: 20
  - minimumIdle: 5
  - connectionTimeout: 30000ms
  - idleTimeout: 600000ms (10분)
  - maxLifetime: 1800000ms (30분)

### PERF-PATTERN-03: No Application-Level Caching
- **결정**: 메뉴 조회 캐싱 미적용
- **근거**: 단일 매장, 테이블 20개 소규모 환경에서 DB 직접 조회로 충분
- **향후**: 트래픽 증가 시 Spring Cache 도입 가능

---

## 3. Exception Handling Patterns

### EXC-PATTERN-01: Global Exception Handler
- **패턴**: `@RestControllerAdvice` + `@ExceptionHandler`
- **응답 형식**: Spring 기본 에러 형식 활용

```json
{
  "timestamp": "2026-03-18T15:00:00.000+09:00",
  "status": 400,
  "error": "Bad Request",
  "message": "메뉴명은 필수입니다.",
  "path": "/api/admin/menus"
}
```

- **처리 대상**:

| Exception | HTTP Status | 설명 |
|---|---|---|
| MethodArgumentNotValidException | 400 | 입력 검증 실패 |
| EntityNotFoundException | 404 | 리소스 미존재 |
| AccessDeniedException | 403 | 권한 부족 |
| AuthenticationException | 401 | 인증 실패 |
| AccountLockedException (커스텀) | 423 | 계정 잠금 |
| DataIntegrityViolationException | 409 | 데이터 무결성 위반 |
| MaxUploadSizeExceededException | 413 | 파일 크기 초과 |
| OpenAiApiException (커스텀) | 502 | 외부 API 실패 |
| Exception (fallback) | 500 | 예상치 못한 에러 |

- **프로덕션 규칙**: 스택 트레이스 미노출, 내부 경로 미노출

### EXC-PATTERN-02: Fail-Closed Pattern
- **원칙**: 에러 발생 시 접근 거부 (fail-closed)
- **적용**:
  - JWT 검증 실패 → 401 (접근 거부)
  - storeId 불일치 → 403 (접근 거부)
  - 트랜잭션 실패 → 롤백 (데이터 보호)

---

## 4. Data Access Patterns

### DATA-PATTERN-01: JPA Auditing
- **패턴**: Spring Data JPA Auditing (`@EnableJpaAuditing`)
- **Base Entity**:

```java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {
    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

- **적용**: 모든 엔티티가 BaseEntity 상속 (createdAt, updatedAt 자동 관리)

### DATA-PATTERN-02: Hard Delete + History Archival
- **전략**: Hard Delete (실제 삭제)
- **주문 삭제**: Order + OrderItem 물리적 삭제
- **결제 완료**: Order → OrderHistory 복사 후 원본 삭제
- **메뉴 삭제**: Menu 물리적 삭제 (OrderItem에 menuName/unitPrice 스냅샷 보관)
- **근거**: OrderHistory로 이력 보관하므로 Soft Delete 불필요

### DATA-PATTERN-03: Transaction Management
- **패턴**: `@Transactional` 선언적 트랜잭션
- **읽기 전용**: `@Transactional(readOnly = true)` — 조회 메서드
- **쓰기**: `@Transactional` — 생성/수정/삭제 메서드
- **결제 완료**: 단일 트랜잭션 내에서 복사 + 삭제 + 세션 종료 처리

### DATA-PATTERN-04: DTO-Entity Separation
- **패턴**: Request DTO → Entity → Response DTO 변환
- **목적**: API 계약과 내부 도메인 모델 분리
- **구현**: 각 Controller에서 DTO ↔ Entity 변환

---

## 5. Logging Patterns

### LOG-PATTERN-01: Structured JSON Logging
- **패턴**: Logstash Logback Encoder
- **필수 필드**: timestamp, level, logger, message, correlationId
- **MDC**: 요청별 correlationId (UUID) 설정 (Filter에서 주입)
- **민감 데이터**: 비밀번호, JWT 토큰, PII 로깅 금지

### LOG-PATTERN-02: Security Event Logging
- **이벤트**: 로그인 성공/실패, JWT 검증 실패, 권한 거부, 주문 삭제, 결제 완료
- **형식**: `[SECURITY_EVENT] type={eventType}, actor={userId}, target={resourceId}, result={SUCCESS/FAILURE}`
- **로그 레벨**: WARN (실패), INFO (성공)

### LOG-PATTERN-03: Request Correlation
- **패턴**: MDC Filter
- **동작**: 모든 요청에 UUID 기반 correlationId 부여
- **전파**: 로그 출력에 correlationId 포함 → 요청 추적 가능

---

## 6. Resilience Patterns

### RES-PATTERN-01: Graceful Shutdown
- **패턴**: Spring Boot Graceful Shutdown
- **설정**: `server.shutdown=graceful`, `spring.lifecycle.timeout-per-shutdown-phase=30s`
- **동작**: 진행 중인 요청 완료 대기, SSE 연결 정리

### RES-PATTERN-02: External API Timeout
- **패턴**: OpenAI API 호출 타임아웃 설정
- **설정**: 연결 타임아웃 5초, 읽기 타임아웃 30초
- **실패 처리**: 타임아웃/에러 시 사용자에게 에러 메시지 반환 (REC-04)

### RES-PATTERN-03: SSE Resilience
- **패턴**: SSE 연결 자동 복구
- **동작**: 연결 끊김 시 emitter 자동 제거, 클라이언트 retry 필드로 재연결 유도
- **Heartbeat**: 30초 간격으로 연결 유지 확인
