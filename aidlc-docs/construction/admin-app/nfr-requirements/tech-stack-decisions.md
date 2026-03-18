# Tech Stack Decisions — Unit 3: Admin App

| 영역 | 선택 | 근거 |
|---|---|---|
| Framework | React 18 (TypeScript) | 요구사항 정의, SPA 구조 |
| 상태 관리 | Redux Toolkit | 사용자 선택 (Q1:B), SSE 이벤트 기반 복잡한 상태 관리에 적합 |
| UI 라이브러리 | MUI (Material UI) v5 | 사용자 선택 (Q2:A), 데스크톱 대시보드에 풍부한 컴포넌트 |
| 라우팅 | React Router v6 | SPA 표준 라우팅 |
| HTTP Client | Axios | 인터셉터 지원 (JWT 자동 첨부, 401 처리) |
| SSE | EventSource API (네이티브) | 브라우저 기본 지원, 자동 재연결 |
| 폼 검증 | React Hook Form + Yup | 선언적 검증, MUI 통합 용이 |
| 로깅 | loglevel | 사용자 선택 (Q3:B), 경량 구조화 로깅 |
| 빌드 도구 | Vite | 빠른 HMR, TypeScript 네이티브 지원 |
| 테스트 | Vitest + React Testing Library | Vite 생태계 통합, 컴포넌트 테스트 |
| 날짜 처리 | dayjs | MUI DatePicker 호환, 경량 |
| 코드 품질 | ESLint + Prettier | 일관된 코드 스타일 |
| 패키지 관리 | npm (package-lock.json) | 의존성 정확한 버전 고정 (SECURITY-10) |
