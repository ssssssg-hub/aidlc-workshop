# Unit of Work Plan

## Unit Decomposition Questions

아래 질문에 답변해 주세요. `[Answer]:` 태그 뒤에 선택지 알파벳을 입력해 주세요.

---

## Question 1
백엔드를 하나의 모놀리스 유닛으로 구성할까요, 아니면 도메인별로 분리된 마이크로서비스로 구성할까요?

A) 모놀리스 — Spring Boot 단일 애플리케이션 (MVP에 적합, 단순한 배포)
B) 마이크로서비스 — 도메인별 독립 서비스 (Auth, Menu, Order, Table 등)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 2
프론트엔드 2개(고객용, 관리자용)와 백엔드의 개발 순서를 어떻게 하시겠습니까?

A) 백엔드 먼저 → 고객 앱 → 관리자 앱 (순차적)
B) 백엔드 + 고객 앱 동시 → 관리자 앱 (고객 기능 우선)
C) 백엔드 + 고객 앱 + 관리자 앱 동시 (병렬 개발)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Unit Generation Execution Plan

### Phase 1: Unit Definition
- [x] 유닛 식별 및 책임 범위 정의
- [x] 유닛별 포함 스토리 매핑
- [x] unit-of-work.md 생성

### Phase 2: Dependency Analysis
- [x] 유닛 간 의존성 매트릭스 작성
- [x] 개발 순서 및 통합 포인트 정의
- [x] unit-of-work-dependency.md 생성

### Phase 3: Story Mapping
- [x] 전체 스토리를 유닛에 할당
- [x] 미할당 스토리 없음 검증
- [x] unit-of-work-story-map.md 생성
