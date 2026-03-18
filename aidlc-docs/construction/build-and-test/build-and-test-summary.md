# Build and Test Summary — Unit 2: Customer App

## Build Status
- **빌드 도구**: Vite 6.x + TypeScript 5.6
- **빌드 명령**: `npm run build`
- **빌드 아티팩트**: `frontend-customer/dist/`
- **Docker 이미지**: `frontend-customer` (nginx:alpine 기반)

## Test Execution Summary

### Unit Tests
- **프레임워크**: Vitest 2.x + @testing-library/react
- **테스트 파일**: 13개
- **테스트 케이스**: ~20개
- **커버리지 영역**: utils, services, store, components, pages
- **실행 명령**: `npm test`

### Integration Tests
- **방식**: 수동 + Docker Compose 환경
- **시나리오**: 7개 (로그인, 메뉴 조회, 주문, 추가 주문, 주문 내역, AI 추천, Nginx 프록시)
- **사전 조건**: Unit 1 (Backend API) 실행 필요

### Performance Tests
- **번들 크기**: 200KB 이하 (gzip) 목표
- **초기 로딩**: 5초 이내 목표
- **측정 도구**: Chrome DevTools, Lighthouse

### Additional Tests
- **Contract Tests**: N/A (REST API 계약은 component-methods.md에 정의, 통합 테스트에서 검증)
- **Security Tests**: N/A (프론트엔드 — 보안 헤더는 nginx.conf에서 설정, XSS는 React 기본 방어)
- **E2E Tests**: 통합 테스트 시나리오에 포함

## 생성된 파일
1. ✅ `build-instructions.md` — 빌드 절차
2. ✅ `unit-test-instructions.md` — 단위 테스트 실행 방법
3. ✅ `integration-test-instructions.md` — 통합 테스트 시나리오
4. ✅ `performance-test-instructions.md` — 성능 테스트 방법
5. ✅ `build-and-test-summary.md` — 본 문서

## Next Steps
- Unit 1 (Backend API), Unit 3 (Admin App) 완료 후 Docker Compose로 전체 통합 테스트 실행
- 통합 테스트 시나리오 수동 검증
- 번들 크기 및 초기 로딩 시간 측정
