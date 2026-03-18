# Performance Test Instructions — Unit 2: Customer App

## 성능 요구사항
- **초기 로딩**: 5초 이내 (MVP)
- **번들 크기**: 200KB 이하 (gzip)
- **장바구니 조작**: 즉각 반응 (클라이언트 로컬)
- **페이지 전환**: SPA 즉각 전환

## 번들 크기 검증

### 빌드 후 크기 확인
```bash
cd frontend-customer
npm run build

# gzip 크기 확인
find dist/assets -name "*.js" -exec gzip -k {} \;
ls -la dist/assets/*.gz

# 또는 Vite 빌드 출력에서 확인 (빌드 시 자동 표시)
```

### 기준
- `dist/assets/index-*.js` (gzip): 200KB 이하
- 초과 시: 불필요한 의존성 제거, 코드 스플리팅 확인

## 초기 로딩 시간 측정

### Chrome DevTools
1. Chrome에서 http://localhost:3001 접속
2. DevTools → Network 탭 → "Disable cache" 체크
3. Ctrl+Shift+R (하드 리로드)
4. **확인**: DOMContentLoaded, Load 이벤트 시간
5. **기준**: Load < 5초

### Lighthouse
```bash
# Chrome DevTools → Lighthouse 탭
# Mobile 프리셋으로 실행
# Performance 점수 및 FCP, LCP 확인
```

## 페이지 전환 성능
1. 메뉴 → 장바구니 → 주문내역 탭 전환
2. **확인**: React.lazy 로딩 후 즉각 전환 (네트워크 요청 없음)
3. **기준**: 체감 지연 없음

## 장바구니 조작 성능
1. 메뉴 20개를 장바구니에 추가
2. 수량 증가/감소 반복
3. **확인**: UI 반응 즉각적 (프레임 드롭 없음)
# Performance Test Instructions — Unit 1: Backend API

## 성능 요구사항

| 항목 | 목표 |
|---|---|
| 일반 API 응답 시간 | 200ms 이내 |
| 목록 조회 API 응답 시간 | 500ms 이내 |
| SSE 이벤트 전달 | 2초 이내 |
| 동시 접속자 | 50명 |

## 테스트 도구 (권장)
- Apache JMeter 또는 k6

## 테스트 시나리오

### Scenario 1: 메뉴 조회 부하 테스트
```
- 동시 사용자: 20명
- 요청: GET /api/menus
- 지속 시간: 1분
- 목표: 평균 응답 시간 200ms 이내
```

### Scenario 2: 주문 생성 부하 테스트
```
- 동시 사용자: 20명
- 요청: POST /api/orders
- 지속 시간: 1분
- 목표: 평균 응답 시간 200ms 이내
```

### Scenario 3: SSE 연결 유지 테스트
```
- 동시 SSE 연결: 5개
- 주문 생성 트리거: 10건
- 목표: 이벤트 전달 2초 이내
```

## 실행 방법 (k6 예시)

### 설치
```bash
# macOS
brew install k6
# Windows
choco install k6
```

### 기본 부하 테스트 스크립트
```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '60s',
};

export default function () {
  const res = http.get('http://localhost:8080/api/menus', {
    headers: { Authorization: 'Bearer <TOKEN>' },
  });
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

### 실행
```bash
k6 run load-test.js
```

## 참고
- MVP 단일 매장 환경이므로 성능 테스트는 선택사항입니다
- 기본 동작 확인 수준으로 충분합니다
