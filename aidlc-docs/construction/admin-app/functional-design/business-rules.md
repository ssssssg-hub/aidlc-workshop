# Business Rules — Unit 3: Admin App

## 1. 인증 규칙

| Rule ID | Rule | Detail |
|---|---|---|
| ADM-AUTH-01 | JWT 저장 | localStorage에 저장 |
| ADM-AUTH-02 | 토큰 만료 처리 | 만료 시 자동 로그아웃, `/login` 리다이렉트 |
| ADM-AUTH-03 | 요청 인증 | 모든 API 요청에 `Authorization: Bearer {token}` 헤더 포함 |
| ADM-AUTH-04 | 401 처리 | 401 응답 시 토큰 제거, 로그인 페이지로 이동 |
| ADM-AUTH-05 | 세션 유지 | 브라우저 새로고침 시 localStorage 토큰으로 세션 복원 |

## 2. 대시보드 규칙

| Rule ID | Rule | Detail |
|---|---|---|
| ADM-DASH-01 | SSE 연결 | 대시보드 진입 시 자동 연결, 이탈 시 해제 |
| ADM-DASH-02 | 주문 미리보기 | 테이블 카드당 최신 5개 주문 표시 |
| ADM-DASH-03 | 신규 주문 강조 | 배경색 변경 + 애니메이션, 2초 후 해제 |
| ADM-DASH-04 | 테이블 필터링 | 특정 테이블만 필터링 가능 |
| ADM-DASH-05 | 실시간 반영 | SSE 이벤트 수신 후 2초 이내 UI 반영 |

## 3. 주문 관리 규칙

| Rule ID | Rule | Detail |
|---|---|---|
| ADM-ORD-01 | 상태 변경 | PENDING ↔ PREPARING ↔ COMPLETED 자유 변경 |
| ADM-ORD-02 | 주문 삭제 | 확인 Dialog 필수, 삭제 후 총 주문액 재계산 |
| ADM-ORD-03 | 낙관적 업데이트 | 상태 변경 시 즉시 UI 반영, 실패 시 롤백 |

## 4. 결제 완료 규칙

| Rule ID | Rule | Detail |
|---|---|---|
| ADM-PAY-01 | 확인 팝업 | 총 주문 금액 표시 후 확정 |
| ADM-PAY-02 | 테이블 리셋 | 결제 완료 시 주문 목록 비우기, 총 주문액 0 |

## 5. 메뉴 관리 규칙

| Rule ID | Rule | Detail |
|---|---|---|
| ADM-MENU-01 | 필수 필드 | name, price, categoryId |
| ADM-MENU-02 | 가격 범위 | 100원 ~ 1,000,000원 |
| ADM-MENU-03 | 이미지 검증 | 클라이언트: 확장자(jpg/jpeg/png/gif/webp), 크기(최대 5MB) |
| ADM-MENU-04 | 순서 변경 | 위/아래 화살표 버튼, 첫 번째/마지막 항목 해당 방향 비활성화 |
| ADM-MENU-05 | 삭제 확인 | 확인 Dialog 필수 |

## 6. 테이블 설정 규칙

| Rule ID | Rule | Detail |
|---|---|---|
| ADM-TBL-01 | 필수 필드 | tableNumber (양의 정수), password |
| ADM-TBL-02 | 중복 검증 | 서버 측 검증 (동일 매장 내 테이블 번호 중복 불가) |

## 7. 공통 UI 규칙

| Rule ID | Rule | Detail |
|---|---|---|
| ADM-UI-01 | 에러 표시 | Snackbar로 에러 메시지 표시 (3초 자동 닫힘) |
| ADM-UI-02 | 성공 표시 | Snackbar로 성공 메시지 표시 (3초 자동 닫힘) |
| ADM-UI-03 | 로딩 상태 | API 호출 중 로딩 인디케이터 표시 |
| ADM-UI-04 | 확인 Dialog | 삭제/결제 완료 등 파괴적 작업 전 확인 필수 |
