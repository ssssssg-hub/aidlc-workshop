# Tech Stack Decisions — Unit 2: Customer App

## 확정 기술 스택

| 영역 | 기술 | 근거 |
|---|---|---|
| Framework | React 18 | 요구사항 확정, 컴포넌트 기반 SPA |
| Language | TypeScript (strict) | 타입 안전성, 유지보수성 |
| 빌드 도구 | Vite | 빠른 HMR, 가벼운 번들 (200KB 목표 달성에 유리) |
| 라우팅 | React Router v6 | SPA 클라이언트 라우팅, 하단 탭 네비게이션 |
| 상태 관리 | React Context + useReducer | 외부 의존성 없음, 번들 크기 최소화 |
| API 호출 | fetch API | 내장 API, 추가 라이브러리 불필요 |
| 스타일링 | CSS Modules | 스코프 CSS, 번들 크기 영향 최소 |
| 패키지 매니저 | npm | 기본 도구 |

## 번들 크기 전략

200KB (gzip) 목표 달성을 위한 전략:
- 외부 라이브러리 최소화 (Context/fetch/CSS Modules 모두 내장 또는 빌드 타임)
- Vite의 tree-shaking 및 코드 스플리팅 활용
- React Router만 외부 의존성으로 포함
- 이미지는 서버에서 서빙 (번들에 포함하지 않음)

## 개발 환경

| 항목 | 설정 |
|---|---|
| Node.js | 20 LTS |
| TypeScript | strict 모드 |
| ESLint | React + TypeScript 규칙 |
| Prettier | 코드 포맷팅 |
