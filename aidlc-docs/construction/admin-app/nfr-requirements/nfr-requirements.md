# NFR Requirements — Unit 3: Admin App

## 1. 성능 요구사항

| ID | 요구사항 | 기준 |
|---|---|---|
| NFR-PERF-01 | SSE 이벤트 수신 후 UI 반영 | 2초 이내 |
| NFR-PERF-02 | 페이지 초기 로드 | 3초 이내 (LCP) |
| NFR-PERF-03 | 사용자 인터랙션 응답 | 100ms 이내 (INP) |
| NFR-PERF-04 | 번들 사이즈 | 초기 로드 500KB 이하 (gzip) |
| NFR-PERF-05 | 코드 스플리팅 | 라우트 기반 lazy loading |

## 2. 보안 요구사항 (Security Extension)

| ID | SECURITY Rule | 적용 내용 |
|---|---|---|
| NFR-SEC-01 | SECURITY-04 | HTTP Security Headers: CSP(`default-src 'self'`), HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy |
| NFR-SEC-02 | SECURITY-05 | 모든 폼 입력에 클라이언트 측 검증 (타입, 길이, 형식) — 서버 검증의 보완 |
| NFR-SEC-03 | SECURITY-08 | JWT 토큰 검증 기반 라우트 보호 (AuthGuard), 401 응답 시 자동 로그아웃 |
| NFR-SEC-04 | SECURITY-09 | 프로덕션 에러 메시지에 내부 정보 노출 금지, 소스맵 프로덕션 비활성화 |
| NFR-SEC-05 | SECURITY-10 | 의존성 정확한 버전 고정 (lock file), 취약점 스캐닝 |
| NFR-SEC-06 | SECURITY-12 | JWT localStorage 저장, 만료 시 자동 로그아웃, 하드코딩된 자격 증명 금지 |
| NFR-SEC-07 | SECURITY-13 | 외부 CDN 리소스 사용 시 SRI 해시 적용 |
| NFR-SEC-08 | SECURITY-15 | 글로벌 에러 핸들러 (ErrorBoundary), 모든 API 호출에 try/catch |

### N/A Security Rules (프론트엔드 해당 없음)
| SECURITY Rule | 사유 |
|---|---|
| SECURITY-01 | 데이터 저장소 없음 (프론트엔드) |
| SECURITY-02 | 네트워크 중간자 없음 (프론트엔드) |
| SECURITY-03 | 서버 로깅 해당 없음 → 클라이언트 로깅은 loglevel 라이브러리로 대체 |
| SECURITY-06 | IAM 정책 해당 없음 (프론트엔드) |
| SECURITY-07 | 네트워크 설정 해당 없음 (프론트엔드) |
| SECURITY-11 | 백엔드 설계 원칙 (프론트엔드에서는 입력 검증 + 에러 처리로 대응) |
| SECURITY-14 | 서버 모니터링/알림 해당 없음 (프론트엔드) |

## 3. 사용성/접근성 요구사항

| ID | 요구사항 | 기준 |
|---|---|---|
| NFR-UX-01 | 브라우저 지원 | Chrome, Edge, Firefox, Safari 최신 버전 |
| NFR-UX-02 | 반응형 레이아웃 | 데스크톱 최적화 (최소 1280px), 태블릿 대응 |
| NFR-UX-03 | 키보드 접근성 | 모든 인터랙티브 요소 키보드 접근 가능 |
| NFR-UX-04 | 색상 대비 | WCAG 2.1 AA 기준 충족 |
| NFR-UX-05 | 로딩 피드백 | 모든 API 호출 시 로딩 인디케이터 표시 |
| NFR-UX-06 | 파괴적 작업 확인 | 삭제/결제 완료 전 확인 Dialog 필수 |

## 4. 안정성/에러 처리 요구사항

| ID | 요구사항 | 기준 |
|---|---|---|
| NFR-REL-01 | 글로벌 에러 핸들러 | React ErrorBoundary로 미처리 에러 캐치 |
| NFR-REL-02 | API 에러 처리 | 모든 API 호출에 에러 핸들링, 사용자 친화적 메시지 |
| NFR-REL-03 | SSE 재연결 | EventSource 기본 재연결 메커니즘 활용 |
| NFR-REL-04 | 낙관적 업데이트 롤백 | 서버 실패 시 이전 상태로 복원 |
| NFR-REL-05 | 클라이언트 로깅 | loglevel 라이브러리로 구조화된 로깅, 프로덕션에서 warn 이상만 출력 |
