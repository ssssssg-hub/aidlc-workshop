# NFR Requirements — Unit 2: Customer App

## 1. 성능 요구사항

| NFR ID | 항목 | 요구사항 |
|---|---|---|
| PERF-01 | 초기 로딩 | 5초 이내 (MVP 수준) |
| PERF-02 | API 응답 UX | 로딩 인디케이터 표시, 시간 제한 없음 |
| PERF-03 | 장바구니 조작 | 즉각 반응 (클라이언트 로컬 연산) |
| PERF-04 | 페이지 전환 | SPA 클라이언트 라우팅, 즉각 전환 |
| PERF-05 | 번들 크기 | 200KB 이하 (gzip) |

## 2. 가용성/안정성 요구사항

| NFR ID | 항목 | 요구사항 |
|---|---|---|
| AVAIL-01 | 네트워크 장애 | 에러 메시지 표시 + 재시도 버튼 |
| AVAIL-02 | 장바구니 데이터 보존 | localStorage 기반, 네트워크 무관 유지 |
| AVAIL-03 | API 타임아웃 | fetch에 AbortController 적용, 30초 타임아웃 |
| AVAIL-04 | 에러 복구 | React Error Boundary로 앱 크래시 방지 |

## 3. 보안 요구사항

| NFR ID | 항목 | 요구사항 |
|---|---|---|
| SEC-01 | 토큰 저장 | localStorage (MVP), HttpOnly cookie 미적용 |
| SEC-02 | API 인증 | 모든 요청에 Bearer 토큰 첨부 |
| SEC-03 | 401 처리 | 자동 로그아웃 + /setup 리다이렉트 |
| SEC-04 | 입력 검증 | 클라이언트 측 유효성 검증 (서버 측 검증은 Unit 1) |
| SEC-05 | XSS 방지 | React 기본 이스케이핑 활용, dangerouslySetInnerHTML 사용 금지 |
| SEC-06 | 민감 정보 | 콘솔 로그에 토큰/비밀번호 출력 금지 |

## 4. 사용성/접근성 요구사항

| NFR ID | 항목 | 요구사항 |
|---|---|---|
| UX-01 | 터치 타겟 | 최소 44x44px |
| UX-02 | 접근성 | 시맨틱 HTML, alt 텍스트, 키보드 네비게이션 |
| UX-03 | 로딩 피드백 | 모든 API 호출 시 로딩 인디케이터 |
| UX-04 | 에러 피드백 | 사용자 친화적 메시지, 내부 상세 노출 금지 |
| UX-05 | 모바일 최적화 | 모바일 뷰포트 기준 레이아웃 |

## 5. 호환성 요구사항

| NFR ID | 항목 | 요구사항 |
|---|---|---|
| COMPAT-01 | 브라우저 | Chrome, Safari, Edge 최신 2버전 |
| COMPAT-02 | ES 타겟 | ES2020+ (모던 브라우저 전용) |
| COMPAT-03 | 반응형 | 모바일 웹 최적화 (태블릿 기기 기준) |

## 6. 유지보수성 요구사항

| NFR ID | 항목 | 요구사항 |
|---|---|---|
| MAINT-01 | 코드 구조 | 컴포넌트별 디렉토리, 관심사 분리 |
| MAINT-02 | 타입 안전성 | TypeScript strict 모드 |
| MAINT-03 | 스타일 스코핑 | CSS Modules로 스타일 충돌 방지 |
