# Unit Test Execution — Unit 2: Customer App

## 테스트 환경
- **프레임워크**: Vitest 2.x
- **DOM 환경**: jsdom
- **테스트 유틸**: @testing-library/react, @testing-library/user-event

## 테스트 실행

### 전체 테스트 실행
```bash
cd frontend-customer
npm test
```

### Watch 모드 (개발 중)
```bash
npm run test:watch
```

### 특정 파일만 실행
```bash
npx vitest run src/__tests__/store/CartContext.test.tsx
```

## 테스트 목록 (13개)

### 유틸리티 (2)
| 파일 | 테스트 항목 |
|---|---|
| `jwt.test.ts` | 유효 토큰 판별, 만료 토큰 판별, 잘못된 토큰 처리 |
| `storage.test.ts` | set/get 라운드트립, 미존재 키 fallback, 잘못된 JSON fallback, remove |

### API Layer (1)
| 파일 | 테스트 항목 |
|---|---|
| `apiFetch.test.ts` | GET 요청 JSON 반환, Authorization 헤더 첨부, 4xx 에러 처리 |

### State Management (2)
| 파일 | 테스트 항목 |
|---|---|
| `AuthContext.test.tsx` | 초기 미인증 상태, LOGIN 동작, LOGOUT 동작 |
| `CartContext.test.tsx` | 빈 장바구니 초기화, ADD_ITEM, 중복 추가 수량 증가, UPDATE_QUANTITY 0 삭제, CLEAR |

### 컴포넌트 (3)
| 파일 | 테스트 항목 |
|---|---|
| `BottomNav.test.tsx` | 3개 탭 렌더링 |
| `MenuCard.test.tsx` | 메뉴명/가격 표시, + 버튼 클릭 시 onAddToCart 호출 |
| `CartItem.test.tsx` | 항목 정보 표시, +/- 버튼 동작, 삭제 버튼 동작 |

### 페이지 (5)
| 파일 | 테스트 항목 |
|---|---|
| `SetupPage.test.tsx` | 폼 필드 렌더링, 빈 필드 시 버튼 비활성화, 입력 시 버튼 활성화 |
| `MenuPage.test.tsx` | 추천 버튼 렌더링, 메뉴 카드 로딩 후 표시 |
| `CartPage.test.tsx` | 빈 장바구니 메시지 |
| `OrderConfirmPage.test.tsx` | 빈 장바구니 시 리다이렉트 |
| `OrderHistoryPage.test.tsx` | 빈 주문 내역 메시지 |

## 예상 결과
- **총 테스트**: 13개 파일, ~20개 테스트 케이스
- **통과**: 전체 통과
- **실패**: 0
- **커버리지**: 핵심 비즈니스 로직 (CartContext, AuthContext, apiFetch) 커버

## 실패 시 대응
1. 에러 메시지에서 실패한 테스트 파일/케이스 확인
2. `npx vitest run --reporter=verbose` 로 상세 출력
3. 코드 수정 후 재실행
