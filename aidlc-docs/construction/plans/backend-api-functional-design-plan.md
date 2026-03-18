# Backend API Functional Design Plan

## Functional Design Questions

아래 질문에 답변해 주세요. `[Answer]:` 태그 뒤에 선택지 알파벳을 입력해 주세요.

---

## Question 1
주문 상태 변경 흐름에서 상태 역전(예: 완료→준비중)을 허용합니까?

A) 허용하지 않음 — 대기중→준비중→완료 단방향만 가능
B) 허용 — 관리자가 자유롭게 상태 변경 가능
C) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 2
테이블 세션 ID 생성 방식은 어떻게 하시겠습니까?

A) 첫 주문 시 자동 생성 (UUID)
B) 테이블 태블릿 로그인 시 자동 생성
C) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 3
관리자 로그인 시도 제한은 어떻게 설정하시겠습니까?

A) 5회 실패 시 15분 잠금
B) 10회 실패 시 30분 잠금
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 4
메뉴 가격 범위 검증의 기준은 무엇입니까?

A) 최소 100원 ~ 최대 1,000,000원
B) 최소 0원(무료 가능) ~ 최대 제한 없음
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Functional Design Execution Plan

### Phase 1: Domain Entities
- [x] 핵심 엔티티 정의 (Store, Admin, Table, TableSession, Menu, Category, Order, OrderItem, OrderHistory)
- [x] 엔티티 관계 다이어그램
- [x] domain-entities.md 생성

### Phase 2: Business Logic Model
- [x] 인증 로직 (관리자 로그인, 테이블 로그인, JWT 발급/검증)
- [x] 주문 처리 로직 (생성, 상태 변경, 삭제, SSE 이벤트)
- [x] 테이블 세션 관리 로직 (세션 생성, 결제 완료, 이력 이동)
- [x] AI 추천 로직 (OpenAI 호출, 응답 파싱)
- [x] 이미지 업로드 로직
- [x] business-logic-model.md 생성

### Phase 3: Business Rules
- [x] 인증 규칙 (비밀번호 해싱, 로그인 시도 제한, JWT 만료)
- [x] 주문 규칙 (상태 전이, 삭제 조건, 세션 검증)
- [x] 메뉴 규칙 (필수 필드, 가격 범위, 노출 순서)
- [x] 테이블 규칙 (세션 라이프사이클, 결제 완료 조건)
- [x] business-rules.md 생성
