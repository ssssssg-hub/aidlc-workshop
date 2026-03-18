# Application Design Plan

## Design Questions

아래 질문에 답변해 주세요. `[Answer]:` 태그 뒤에 선택지 알파벳을 입력해 주세요.

---

## Question 1
백엔드 프로젝트 구조를 어떻게 구성하시겠습니까?

A) Layered Architecture — Controller → Service → Repository 계층 구조
B) Hexagonal Architecture — Port & Adapter 패턴 (도메인 중심)
C) Other (please describe after [Answer]: tag below)

[Answer]: 요구사항에 맞는 구조를 추천해줘.

## Question 2
AI 메뉴 추천 기능에서 사용할 LLM Provider는 무엇입니까?

A) Amazon Bedrock (Claude)
B) OpenAI API (GPT)
C) 자체 구현 규칙 기반 (LLM 없이, 카테고리/가격 기반 로직)
D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 3
이미지 업로드 시 서버 내 저장 방식은 어떻게 하시겠습니까?

A) 서버 로컬 파일시스템 저장 (Docker volume 마운트)
B) DB에 Base64로 저장
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Design Execution Plan

### Phase 1: Component Identification
- [x] 백엔드 컴포넌트 식별 및 책임 정의
- [x] 고객용 프론트엔드 컴포넌트 식별
- [x] 관리자용 프론트엔드 컴포넌트 식별
- [x] components.md 생성

### Phase 2: Component Methods
- [x] 각 컴포넌트별 메서드 시그니처 정의
- [x] 입출력 타입 정의
- [x] component-methods.md 생성

### Phase 3: Service Layer Design
- [x] 서비스 정의 및 오케스트레이션 패턴
- [x] 서비스 간 상호작용 정의
- [x] services.md 생성

### Phase 4: Component Dependencies
- [x] 의존성 관계 매트릭스
- [x] 통신 패턴 정의
- [x] 데이터 흐름 다이어그램
- [x] component-dependency.md 생성

### Phase 5: Consolidation
- [x] application-design.md 통합 문서 생성
- [x] 설계 완전성 및 일관성 검증
