# NFR Requirements — Unit 1: Backend API

## 1. Performance Requirements

### PERF-01: API 응답 시간
| 구분 | 목표 |
|---|---|
| 일반 API (CRUD, 상태 변경) | 200ms 이내 |
| 목록 조회 API (메뉴, 주문 내역) | 500ms 이내 |
| AI 추천 API (외부 OpenAI 호출) | 10초 이내 (외부 의존) |
| SSE 이벤트 전달 | 2초 이내 |

### PERF-02: 동시 접속
| 항목 | 값 |
|---|---|
| 최대 동시 접속자 | 50명 |
| 테이블 태블릿 | 최대 20대 |
| 관리자 | 최대 5명 |
| 여유분 | 25명 |

### PERF-03: 데이터베이스
| 항목 | 값 |
|---|---|
| 커넥션 풀 사이즈 | 20개 |
| 커넥션 타임아웃 | 30초 |
| 유휴 커넥션 최소 | 5개 |

---

## 2. Availability & Reliability Requirements

### AVAIL-01: 가용성 목표
- **SLA 목표**: 99.9% (연간 약 8.7시간 다운타임 허용)
- **복구 전략**: 수동 재시작 (MVP)
- **Health Check**: Spring Boot Actuator health endpoint 제공 (`/actuator/health`)

### AVAIL-02: 데이터 내구성
- PostgreSQL 데이터: Docker volume 영구 저장
- 이미지 파일: Docker volume 영구 저장
- 장애 시 데이터 유실 방지: PostgreSQL WAL 기본 설정 유지

### AVAIL-03: Graceful Shutdown
- Spring Boot graceful shutdown 활성화
- 진행 중인 요청 완료 대기 (timeout: 30초)
- SSE 연결 정리

---

## 3. Security Requirements

### SEC-01: 인증 및 자격 증명
| 항목 | 구현 |
|---|---|
| 비밀번호 해싱 | bcrypt (strength 10) |
| JWT Secret Key | 환경 변수 주입 (`JWT_SECRET`) |
| JWT 만료 | 16시간 |
| 로그인 시도 제한 | 5회 실패 시 15분 잠금 (AUTH-02) |
| 하드코딩 금지 | Secret, 비밀번호 등 소스코드에 포함 금지 |

### SEC-02: TLS/HTTPS
- Spring Boot 내장 TLS 설정 (application.yml)
- 자체 서명 인증서 (개발용) / 정식 인증서 (프로덕션)
- TLS 1.2+ 강제

### SEC-03: Rate Limiting
- MVP 범위: 로그인 시도 제한만 적용 (AUTH-02: 5회/15분)
- 공개 API에 대한 추가 Rate Limiting은 향후 확장 시 적용

### SEC-04: CORS
- 허용 Origin: 고객 앱, 관리자 앱 도메인만 명시적 허용
- 와일드카드(`*`) 사용 금지 (인증 엔드포인트)
- Credentials 허용

### SEC-05: HTTP Security Headers
| Header | Value |
|---|---|
| X-Content-Type-Options | nosniff |
| X-Frame-Options | DENY |
| Strict-Transport-Security | max-age=31536000; includeSubDomains |
| Referrer-Policy | strict-origin-when-cross-origin |
| Content-Security-Policy | default-src 'self' (API 서버이므로 최소 정책) |

### SEC-06: Input Validation
- 모든 API 엔드포인트에 Jakarta Validation 적용
- 문자열 최대 길이 제한
- 가격 범위 검증 (100 ~ 1,000,000)
- Parameterized Query (JPA/Hibernate 기본)
- Request Body 크기 제한 설정

### SEC-07: Access Control
- Deny by default: 모든 엔드포인트 인증 필수 (공개 API 명시적 허용)
- Object-level authorization: storeId 기반 데이터 격리
- Function-level authorization: ADMIN/TABLE 역할 기반 접근 제어
- JWT 토큰 서버사이드 검증 (매 요청)

### SEC-08: Exception Handling
- Global Exception Handler (`@RestControllerAdvice`)
- 프로덕션 에러 응답: 스택 트레이스, 내부 경로 노출 금지
- 일반적 에러 메시지만 반환
- Fail-closed: 에러 시 접근 거부

---

## 4. Data Management Requirements

### DATA-01: 데이터베이스 마이그레이션
- **도구**: Flyway
- **전략**: 버전 기반 마이그레이션 (`V1__`, `V2__` 등)
- **위치**: `src/main/resources/db/migration/`

### DATA-02: 데이터 보관
| 데이터 | 보관 기간 |
|---|---|
| 활성 주문 (Order) | 세션 종료(결제 완료)까지 |
| 주문 이력 (OrderHistory) | 무기한 |
| 이미지 파일 | 무기한 |
| 로그 파일 | 90일 (SECURITY-14 준수) |

### DATA-03: 데이터 무결성
- JPA 엔티티 제약 조건 (Not Null, Unique 등)
- 외래 키 제약 조건
- 트랜잭션 관리 (`@Transactional`)

---

## 5. Logging & Monitoring Requirements

### LOG-01: 로깅 프레임워크
- **프레임워크**: SLF4J + Logback
- **출력 형식**: JSON 구조화 로깅
- **필수 필드**: timestamp, level, logger, message, correlationId (MDC)
- **민감 데이터**: 비밀번호, 토큰, PII 로깅 금지

### LOG-02: 로그 저장
- **저장 방식**: 파일 기반 로깅 (Docker volume 마운트)
- **로그 파일 경로**: `/var/log/tableorder/`
- **로테이션**: 일별 로테이션, 최대 90일 보관
- **보관 기간**: 90일 (SECURITY-14 준수)

### LOG-03: 보안 이벤트 로깅
- 로그인 성공/실패
- 인증 실패 (JWT 만료, 유효하지 않은 토큰)
- 권한 거부 (접근 제어 위반)
- 주문 삭제 (관리자 직권)
- 결제 완료 처리

### LOG-04: Health Check
- Spring Boot Actuator `/actuator/health` 엔드포인트
- DB 연결 상태, 디스크 공간 확인

---

## 6. Maintainability Requirements

### MAINT-01: 코드 품질
- Layered Architecture 준수 (Controller → Service → Repository)
- 단일 책임 원칙
- DTO/Entity 분리

### MAINT-02: 테스트
- 단위 테스트: JUnit 5 + Mockito
- 통합 테스트: Spring Boot Test + Testcontainers (PostgreSQL)
- 테스트 커버리지 목표: 주요 비즈니스 로직 80% 이상

### MAINT-03: API 문서화
- Swagger/OpenAPI 3.0 자동 생성 (springdoc-openapi)
- API 엔드포인트 설명 및 예시 포함
