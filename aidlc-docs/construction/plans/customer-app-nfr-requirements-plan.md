# NFR Requirements Plan — Unit 2: Customer App

## 실행 계획

- [x] Step 1: Functional Design 분석 및 NFR 영역 식별
- [x] Step 2: 사용자 질문 수집 및 답변 확인
- [x] Step 3: NFR 요구사항 문서 생성
- [x] Step 4: Tech Stack 결정 문서 생성
- [ ] Step 5: 승인 요청

## 질문

### Q1: 성능 — 초기 로딩 시간
Customer App의 초기 로딩 시간 목표는?

A) 3초 이내 — 일반적인 모바일 웹 기준
B) 2초 이내 — 빠른 사용자 경험 우선
C) 5초 이내 — MVP 수준, 최적화는 추후

[Answer]: C

### Q2: 성능 — API 응답 대기 UX
API 호출 시 사용자가 체감하는 응답 시간 목표는?

A) 1초 이내 — 즉각적인 느낌
B) 2초 이내 — 적절한 수준
C) 로딩 인디케이터만 표시하면 시간 제한 없음

[Answer]: C

### Q3: 오프라인/네트워크 장애 대응
네트워크 연결이 불안정할 때 어떻게 대응할까요?

A) 에러 메시지 표시 + 재시도 버튼 — 기본 대응
B) 장바구니는 오프라인 유지, API 호출만 에러 처리 — 부분 오프라인
C) Service Worker 기반 오프라인 캐싱 — 풀 PWA

[Answer]: A

### Q4: 접근성 (Accessibility)
접근성 수준은?

A) 기본 — 시맨틱 HTML, alt 텍스트, 키보드 네비게이션
B) WCAG 2.1 AA 준수 — 스크린 리더, 색상 대비, ARIA 레이블
C) MVP에서는 최소한만 — 추후 개선

[Answer]: A

### Q5: 브라우저 호환성
지원 브라우저 범위는?

A) 모던 브라우저만 (Chrome, Safari, Edge 최신 2버전)
B) 모던 + 삼성 인터넷 브라우저 포함
C) IE11 포함 레거시 지원

[Answer]: A

### Q6: 번들 크기 목표
JavaScript 번들 크기 목표는?

A) 200KB 이하 (gzip) — 가벼운 앱
B) 500KB 이하 (gzip) — 일반적 수준
C) 제한 없음 — MVP 우선

[Answer]: A
