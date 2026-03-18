# Business Logic Model — Unit 2: Customer App

## 1. 인증 흐름

### 초기 설정 (최초 1회)
1. SetupPage에서 매장 식별자, 테이블 번호, 비밀번호 입력
2. `POST /api/table/auth/login` 호출
3. 성공: token, sessionId를 localStorage에 저장 → /menu 이동
4. 실패: 에러 메시지 표시, 입력 유지

### 자동 로그인 (앱 시작 시)
1. localStorage에서 token 확인
2. 토큰 존재 + JWT 만료 시간 미경과 → 인증 상태 설정, /menu 이동
3. 토큰 없음 또는 만료 → localStorage 클리어, /setup 이동

### 토큰 관리
- 모든 API 요청에 `Authorization: Bearer {token}` 헤더 첨부
- API 응답 401 수신 시 → 자동 로그아웃 (localStorage 클리어, /setup 이동)

## 2. 장바구니 로직

### 상태 구조
```typescript
{ items: CartItem[], totalAmount: number }
```

### addItem(menu)
1. 기존 items에서 동일 menuId 검색
2. 존재: quantity + 1
3. 미존재: 새 CartItem 추가 (quantity: 1)
4. totalAmount 재계산
5. localStorage 동기화

### updateQuantity(menuId, quantity)
1. quantity ≤ 0 → 해당 항목 삭제
2. quantity > 0 → 수량 업데이트
3. totalAmount 재계산
4. localStorage 동기화

### removeItem(menuId)
1. items에서 해당 menuId 필터링 제거
2. totalAmount 재계산
3. localStorage 동기화

### clearCart()
1. items = [], totalAmount = 0
2. localStorage 동기화

### totalAmount 계산
- `items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)`

### localStorage 동기화
- key: `cart_items`
- 저장: `JSON.stringify(items)`
- 복원: 앱 시작 시 `JSON.parse(localStorage.getItem('cart_items'))` → 유효성 검증 후 상태 설정

## 3. 주문 생성 흐름

### 주문 확정
1. CartContext에서 items, totalAmount 조회
2. 요청 body 구성: `{ storeId, tableId, sessionId, items: [{menuId, menuName, quantity, unitPrice}], totalAmount }`
3. `POST /api/orders` 호출
4. 성공: 장바구니 클리어 → /order-success?orderNumber={orderNumber} 이동
5. 실패: 에러 메시지 표시, 장바구니 유지

### 주문 성공 후
1. 주문 번호 표시
2. 5초 카운트다운 (setInterval)
3. 카운트다운 완료 → /menu 자동 이동
4. 사용자가 먼저 이동해도 OK

### 추가 주문
- 주문 성공 후 /menu로 돌아가면 새로운 메뉴를 장바구니에 추가 가능
- 동일 sessionId로 새 주문 생성 → 별도 주문 번호 부여

## 4. 메뉴 조회 흐름

### 카테고리 로드
1. MenuPage 마운트 시 `GET /api/categories` 호출
2. 첫 번째 카테고리 자동 선택

### 메뉴 목록 로드
1. 카테고리 선택 시 `GET /api/menus?category={categoryId}` 호출
2. displayOrder 순으로 정렬된 결과 표시

### 메뉴 상세
1. MenuCard 클릭 → MenuDetailModal 열기
2. 메뉴명, 가격, 설명, 이미지 표시
3. "장바구니 추가" 버튼 → addItem 호출 → 모달 닫기

## 5. AI 추천 흐름

### 추천 요청
1. MenuPage에서 "메뉴 추천" 버튼 → RecommendationModal 열기
2. Step 1 (input): 인원수 입력 (1~20), 식사 유형 선택 (쉐어/단독)
3. "추천 받기" 버튼 → `POST /api/recommendations` 호출
4. 로딩: 모달 내 스피너 + "추천 메뉴를 찾고 있어요..." 텍스트
5. Step 2 (result): 2~3개 추천 조합 표시

### 추천 결과 선택
1. 각 조합: 메뉴명, 수량, 예상 총 금액 표시
2. 조합 선택 → 해당 메뉴들을 장바구니에 일괄 addItem
3. 모달 닫기

### 실패 처리
- API 에러 시 "추천을 불러올 수 없습니다. 다시 시도해주세요." 메시지 + 재시도 버튼

## 6. 주문 내역 조회 흐름

### 조회
1. OrderHistoryPage 마운트 시 `GET /api/orders?sessionId={sessionId}` 호출
2. 주문 시간 순 정렬
3. 각 주문: 주문 번호, 시각, 메뉴/수량, 금액, 상태 표시

### 상태 표시
- PENDING → "대기중" (주황색)
- PREPARING → "준비중" (파란색)
- COMPLETED → "완료" (초록색)
