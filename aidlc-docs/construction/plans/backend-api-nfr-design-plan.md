# NFR Design Plan — Unit 1: Backend API

## Plan Overview
NFR Requirements를 기반으로 설계 패턴과 논리적 컴포넌트를 정의합니다.

## Execution Steps

- [x] Step 1: NFR Requirements 분석 (nfr-requirements.md, tech-stack-decisions.md)
- [x] Step 2: NFR Design 질문 수집 및 사용자 답변 확인
- [x] Step 3: NFR Design Patterns 문서 생성 (nfr-design-patterns.md)
- [x] Step 4: Logical Components 문서 생성 (logical-components.md)
- [x] Step 5: Security Extension 준수 검증
- [x] Step 6: 사용자 승인

---

## NFR Design Questions

아래 질문에 답변해주세요. 각 질문의 [Answer]: 태그 뒤에 선택지 알파벳을 입력해주세요.

### Security Patterns

## Question 1
JWT 토큰 검증 실패 시 응답 형식은 어떻게 할까요?

A) 표준 HTTP 401 + JSON 에러 응답 (errorCode, message)
B) 표준 HTTP 401 + 최소 메시지만 (Unauthorized)
C) AI가 적절히 판단해줘
D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 2
API 엔드포인트 접근 제어 구조는 어떻게 할까요?

A) URL 패턴 기반 (`/api/admin/**` → ADMIN 역할, `/api/table/**` → TABLE 역할, `/api/**` → 인증된 사용자)
B) 메서드 레벨 어노테이션 (`@PreAuthorize`) 기반
C) A + B 조합 (URL 패턴 + 메서드 레벨 보강)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Performance Patterns

## Question 3
메뉴 조회 API에 캐싱을 적용할까요? (메뉴는 자주 변경되지 않는 데이터)

A) Spring Cache (인메모리 ConcurrentHashMap) — 메뉴 변경 시 캐시 무효화
B) 캐싱 없음 — DB 직접 조회 (소규모이므로 충분)
C) HTTP Cache-Control 헤더만 적용 (클라이언트 캐싱)
D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 4
SSE 연결 관리 패턴은 어떻게 할까요?

A) ConcurrentHashMap 기반 emitter 관리 + 주기적 heartbeat + 자동 재연결 지원
B) Spring의 SseEmitter 기본 동작만 사용
C) AI가 적절히 판단해줘
D) Other (please describe after [Answer]: tag below)

[Answer]: C

### Exception Handling Patterns

## Question 5
글로벌 에러 응답 형식은 어떻게 통일할까요?

A) `{ "errorCode": "ERR_XXX", "message": "...", "timestamp": "..." }` 형식
B) `{ "status": 400, "error": "Bad Request", "message": "..." }` Spring 기본 형식 활용
C) AI가 적절히 판단해줘
D) Other (please describe after [Answer]: tag below)

[Answer]: B

### Data Access Patterns

## Question 6
JPA 엔티티의 감사(Audit) 필드 관리는 어떻게 할까요?

A) Spring Data JPA Auditing (`@CreatedDate`, `@LastModifiedDate`) 자동 관리
B) `@PrePersist`, `@PreUpdate` JPA 콜백으로 수동 관리
C) AI가 적절히 판단해줘
D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 7
Soft Delete vs Hard Delete 전략은 어떻게 할까요?

A) Hard Delete (실제 삭제) — 주문 이력은 OrderHistory로 별도 보관하므로 충분
B) Soft Delete (deleted 플래그) — 모든 엔티티에 적용
C) 혼합 — 주문은 Hard Delete + OrderHistory 보관, 메뉴는 Soft Delete
D) Other (please describe after [Answer]: tag below)

[Answer]: A

