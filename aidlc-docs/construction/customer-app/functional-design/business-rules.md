# Business Rules — Unit 2: Customer App

## 1. 인증 규칙

| Rule ID | Rule | Detail |
|---|---|---|
| CAUTH-01 | 토큰 저장 | localStorage key: `auth_token`, `session_id`, `store_id`, `table_id` |
| CAUTH-02 | 자동 로그인 | 앱 시작 시 토큰 존재 + 미만료 → 자동 인증 |
| CAUTH-03 | 토큰 만료 처리 | JWT exp 클레임 확인, 만료 시 localStorage 클리어 → /setup |
| CAUTH-04 | 401 처리 | API 응답 401 → 자동 로그아웃 |
| CAUTH-05 | 인증 헤더 | 모든 API 요청에 `Authorization: Bearer {token}` 첨부 |

## 2. 장바구니 규칙

| Rule ID | Rule | Detail |
|---|---|---|
| CART-01 | 로컬 저장 | localStorage key: `cart_items`, JSON 직렬화 |
| CART-02 | 수량 최소값 | quantity ≤ 0 시 항목 자동 삭제 |
| CART-03 | 중복 추가 | 동일 menuId 추가 시 quantity 증가 |
| CART-04 | 총 금액 | SUM(unitPrice × quantity), 실시간 계산 |
| CART-05 | 주문 확정 시 클리어 | 주문 성공 후 장바구니 자동 비우기 |
| CART-06 | 새로고침 유지 | localStorage에서 복원 |

## 3. 주문 규칙

| Rule ID | Rule | Detail |
|---|---|---|
| CORD-01 | 빈 장바구니 주문 불가 | items.length === 0 시 주문 확정 버튼 비활성화 |
| CORD-02 | 주문 성공 리다이렉트 | 5초 후 /menu 자동 이동 |
| CORD-03 | 주문 실패 시 장바구니 유지 | 에러 표시, 재시도 가능 |
| CORD-04 | 추가 주문 | 동일 세션 내 새 주문 생성 가능 |

## 4. 메뉴 조회 규칙

| Rule ID | Rule | Detail |
|---|---|---|
| CMENU-01 | 기본 화면 | 메뉴 화면이 인증 후 기본 랜딩 |
| CMENU-02 | 카테고리 기본 선택 | 첫 번째 카테고리 자동 선택 |
| CMENU-03 | 이미지 fallback | 이미지 로드 실패 시 기본 플레이스홀더 표시 |

## 5. AI 추천 규칙

| Rule ID | Rule | Detail |
|---|---|---|
| CREC-01 | 인원수 범위 | 1~20명 |
| CREC-02 | 식사 유형 | SHARE 또는 INDIVIDUAL |
| CREC-03 | 로딩 UX | 모달 내 스피너 + "추천 메뉴를 찾고 있어요..." |
| CREC-04 | 실패 처리 | 에러 메시지 + 재시도 버튼 |
| CREC-05 | 장바구니 일괄 추가 | 선택한 조합의 모든 메뉴를 한번에 addItem |

## 6. UI/UX 규칙

| Rule ID | Rule | Detail |
|---|---|---|
| CUX-01 | 터치 타겟 | 최소 44x44px |
| CUX-02 | 로딩 표시 | API 호출 중 로딩 인디케이터 표시 |
| CUX-03 | 에러 표시 | 사용자 친화적 에러 메시지 (내부 상세 노출 금지) |
| CUX-04 | 하단 탭 | 메뉴, 장바구니(뱃지), 주문내역 3개 탭 |

## 7. 입력 유효성 검증 규칙

| Rule ID | Rule | Detail |
|---|---|---|
| CVAL-01 | 초기 설정 필수 필드 | 매장 식별자, 테이블 번호, 비밀번호 모두 필수 |
| CVAL-02 | 테이블 번호 | 양의 정수 |
| CVAL-03 | 비밀번호 | 빈 문자열 불가 |
| CVAL-04 | 추천 인원수 | 1~20 정수 |
