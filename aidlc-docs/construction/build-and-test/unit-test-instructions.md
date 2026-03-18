# Unit Test Execution — Unit 1: Backend API

## 테스트 구성

| 테스트 클래스 | 대상 | 테스트 수 |
|---|---|---|
| AuthServiceTest | AuthService (로그인, 잠금, 세션) | 5 |
| MenuServiceTest | MenuService (CRUD, 조회) | 4 |
| OrderServiceTest | OrderService (생성, 상태변경, 삭제) | 5 |
| TableServiceTest | TableService (설정, 결제완료) | 3 |
| AuthControllerTest | AuthController (MockMvc) | 2 |

## 실행 방법

### 전체 단위 테스트 실행
```bash
cd backend
./gradlew test
```

### 특정 테스트 클래스 실행
```bash
./gradlew test --tests "com.tableorder.service.AuthServiceTest"
./gradlew test --tests "com.tableorder.service.OrderServiceTest"
```

### 테스트 결과 확인
- 콘솔 출력: 테스트 통과/실패 요약
- HTML 리포트: `backend/build/reports/tests/test/index.html`
- XML 리포트: `backend/build/test-results/test/`

## 예상 결과
- 총 테스트: 19개
- 통과: 19개
- 실패: 0개

## 테스트 커버리지 주요 영역
- 인증 로직 (성공/실패/잠금)
- 주문 생성 (활성 세션 검증, 금액 계산, SSE 이벤트)
- 주문 상태 변경 및 삭제
- 결제 완료 (이력 이동, 세션 종료)
- 메뉴 CRUD
- 입력 검증 (Controller 레벨)
