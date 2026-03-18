# Functional Design Plan — Unit 3: Admin App

## Unit Context

- **유형**: 프론트엔드 SPA (React, TypeScript, 데스크톱 웹)
- **책임**: 관리자 로그인/세션 관리, 실시간 주문 모니터링(SSE), 테이블 관리, 메뉴 관리
- **의존**: Unit 1 Backend API (REST API + SSE)
- **할당 스토리**: 15개 (Epic 7~10)

## Plan Steps

- [ ] Step 1: 컴포넌트 계층 구조 및 라우팅 설계
- [ ] Step 2: 각 페이지/컴포넌트의 Props, State 정의
- [ ] Step 3: 사용자 인터랙션 흐름 설계 (로그인 → 대시보드 → 상세 기능)
- [ ] Step 4: API 연동 포인트 매핑 (Backend API endpoint별 프론트엔드 호출 위치)
- [ ] Step 5: SSE 실시간 이벤트 처리 설계
- [ ] Step 6: 폼 검증 규칙 정의 (로그인, 메뉴 CRUD, 테이블 설정)
- [ ] Step 7: 상태 관리 전략 설계 (전역 상태 vs 로컬 상태)
- [ ] Step 8: Functional Design 아티팩트 생성

## Clarification Questions

아래 질문에 답변해 주세요. 각 질문의 [Answer]: 태그 뒤에 선택지 문자를 입력해 주세요.

## Question 1

Admin App의 상태 관리 라이브러리로 무엇을 사용할까요?

A) Zustand (경량, 간단한 API)
B) Redux Toolkit (표준적, 미들웨어 풍부)
C) React Context + useReducer (외부 라이브러리 없이)
D) Jotai (atomic 상태 관리)
E) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 2

UI 컴포넌트 라이브러리를 사용할까요?

A) MUI (Material UI) — 풍부한 컴포넌트, 데스크톱 대시보드에 적합
B) Ant Design — 관리자 대시보드에 특화된 컴포넌트
C) Chakra UI — 접근성 우수, 커스터마이징 용이
D) Tailwind CSS + Headless UI — 유틸리티 기반, 자유로운 디자인
E) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 3

메뉴 노출 순서 조정 UI 방식은 어떤 것을 선호하시나요?

A) 드래그 앤 드롭 (직관적이지만 구현 복잡도 높음)
B) 위/아래 화살표 버튼 (간단하고 명확)
C) 숫자 직접 입력 (가장 단순)
D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 4

관리자 대시보드의 테이블 그리드 레이아웃에서 테이블 카드에 표시할 최신 주문 미리보기 개수는?

A) 최신 2개
B) 최신 3개
C) 최신 5개
D) Other (please describe after [Answer]: tag below)

[Answer]: C

y
