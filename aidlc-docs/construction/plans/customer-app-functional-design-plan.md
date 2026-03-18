# Functional Design Plan — Unit 2: Customer App

## 대상 스토리
- Epic 1: US-C01-1 (테이블 초기 설정 UI), US-C01-2 (자동 로그인 UI)
- Epic 2: US-C02-1 (카테고리별 메뉴 목록 UI), US-C02-2 (메뉴 상세 UI)
- Epic 3: US-C03-1~6 (장바구니 관리 — 클라이언트 전용)
- Epic 4: US-C04-1~4 (주문 생성/추가 주문 UI)
- Epic 5: US-C05-1~2 (AI 메뉴 추천 UI)
- Epic 6: US-C06-1~2 (주문 내역 조회 UI)

## 실행 계획

- [x] Step 1: 사용자 질문 수집 및 답변 확인
- [x] Step 2: Frontend Component 구조 설계 (페이지/컴포넌트 계층, Props/State)
- [x] Step 3: 클라이언트 비즈니스 로직 모델 (장바구니, 인증 흐름, 상태 관리)
- [x] Step 4: 클라이언트 비즈니스 규칙 (유효성 검증, 에러 처리, 로컬 저장)
- [x] Step 5: 도메인 타입 정의 (TypeScript 인터페이스/타입)
- [ ] Step 6: 아티팩트 생성 및 승인 요청

## 질문

### Q1: 라우팅 및 네비게이션 구조
Customer App의 페이지 간 이동 방식을 어떻게 구성할까요?

A) 하단 탭 네비게이션 (메뉴 | 장바구니 | 주문내역) — 모바일 앱 스타일
B) 상단 헤더 네비게이션 (메뉴 | 장바구니 | 주문내역) — 웹 스타일
C) 메뉴 화면 중심 + 플로팅 장바구니 버튼 + 사이드 드로어 네비게이션

[Answer]: A

### Q2: 장바구니 UI 표시 방식
장바구니를 어떤 형태로 표시할까요?

A) 별도 페이지 (/cart) — 장바구니 전용 화면
B) 하단 슬라이드업 패널 — 메뉴 화면에서 올려서 확인
C) 사이드 드로어 — 오른쪽에서 슬라이드

[Answer]: A

### Q3: 상태 관리 라이브러리
클라이언트 상태 관리에 어떤 방식을 사용할까요?

A) React Context + useReducer — 외부 라이브러리 없이 가볍게
B) Zustand — 간결한 API, 보일러플레이트 최소
C) Redux Toolkit — 구조적이고 DevTools 지원

[Answer]: A

### Q4: API 호출 라이브러리
Backend API 호출에 어떤 방식을 사용할까요?

A) fetch API (내장) — 별도 라이브러리 없이
B) Axios — 인터셉터, 에러 핸들링 편의
C) TanStack Query (React Query) + fetch/axios — 캐싱, 로딩 상태 자동 관리

[Answer]: A

### Q5: AI 추천 로딩 UX
AI 메뉴 추천 요청 시 로딩 표시를 어떻게 할까요?

A) 모달 내 스피너 + "추천 메뉴를 찾고 있어요..." 텍스트
B) 스켈레톤 UI — 추천 결과 카드 형태의 플레이스홀더
C) 전체 화면 로딩 오버레이

[Answer]: A

### Q6: CSS/스타일링 방식
스타일링에 어떤 방식을 사용할까요?

A) CSS Modules — 컴포넌트별 스코프 CSS
B) Tailwind CSS — 유틸리티 퍼스트
C) styled-components — CSS-in-JS

[Answer]: A
