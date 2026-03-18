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
