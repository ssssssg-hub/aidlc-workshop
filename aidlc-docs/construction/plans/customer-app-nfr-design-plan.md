# NFR Design Plan — Unit 2: Customer App

## 실행 계획

- [x] Step 1: NFR Requirements 분석 및 적용 패턴 식별
- [x] Step 2: 사용자 질문 수집 및 답변 확인
- [x] Step 3: NFR Design Patterns 문서 생성
- [x] Step 4: Logical Components 문서 생성
- [x] Step 5: 승인 요청

## 질문

### Q1: API 호출 에러 재시도 패턴
네트워크 에러 시 자동 재시도를 적용할까요?

A) 자동 재시도 없음 — 사용자가 직접 재시도 버튼 클릭
B) 자동 1회 재시도 후 실패 시 에러 표시
C) 지수 백오프 재시도 (최대 3회) 후 실패 시 에러 표시

[Answer]: B

### Q2: 코드 스플리팅 전략
200KB 번들 목표를 위한 코드 스플리팅 방식은?

A) 페이지 단위 lazy loading (React.lazy + Suspense)
B) 라우트 기반 스플리팅만 — 모달/컴포넌트는 포함
C) 스플리팅 없음 — 단일 번들

[Answer]: A

### Q3: 이미지 로딩 최적화
메뉴 이미지 로딩 전략은?

A) Lazy loading (뷰포트 진입 시 로드) + 플레이스홀더
B) 즉시 로드 — 별도 최적화 없음
C) Lazy loading + 저해상도 블러 프리뷰

[Answer]: A
