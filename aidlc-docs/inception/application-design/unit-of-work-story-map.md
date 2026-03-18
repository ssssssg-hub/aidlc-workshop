# Unit of Work — Story Map

## Unit 1: Backend API

| Story ID | Story Name | Epic |
|---|---|---|
| US-C01-1 | 테이블 초기 설정 입력 (API) | Epic 1 |
| US-C01-2 | 자동 로그인 (API) | Epic 1 |
| US-C02-1 | 카테고리별 메뉴 목록 조회 (API) | Epic 2 |
| US-C02-2 | 메뉴 상세 정보 확인 (API) | Epic 2 |
| US-C04-1 | 주문 내역 최종 확인 (API) | Epic 4 |
| US-C04-2 | 주문 확정 (API) | Epic 4 |
| US-C04-3 | 주문 실패 처리 (API) | Epic 4 |
| US-C04-4 | 추가 주문 (API) | Epic 4 |
| US-C05-1 | 메뉴 추천 요청 (API) | Epic 5 |
| US-C05-2 | AI 추천 결과 (API) | Epic 5 |
| US-C06-1 | 현재 세션 주문 내역 조회 (API) | Epic 6 |
| US-C06-2 | 주문 상태 확인 (API) | Epic 6 |
| US-A01-1 | 관리자 로그인 (API) | Epic 7 |
| US-A01-2 | 관리자 세션 유지 (API) | Epic 7 |
| US-A02-1 | 테이블별 주문 대시보드 조회 (API) | Epic 8 |
| US-A02-2 | 실시간 주문 수신 (SSE) | Epic 8 |
| US-A02-3 | 주문 상세 보기 (API) | Epic 8 |
| US-A02-4 | 주문 상태 변경 (API) | Epic 8 |
| US-A03-1 | 테이블 태블릿 초기 설정 (API) | Epic 9 |
| US-A03-2 | 주문 삭제 (API) | Epic 9 |
| US-A03-3 | 결제 완료 처리 (API) | Epic 9 |
| US-A03-4 | 과거 주문 내역 조회 (API) | Epic 9 |
| US-A04-1 | 메뉴 조회 (API) | Epic 10 |
| US-A04-2 | 메뉴 등록 (API) | Epic 10 |
| US-A04-3 | 메뉴 수정 (API) | Epic 10 |
| US-A04-4 | 메뉴 삭제 (API) | Epic 10 |
| US-A04-5 | 메뉴 노출 순서 조정 (API) | Epic 10 |

## Unit 2: Customer App

| Story ID | Story Name | Epic |
|---|---|---|
| US-C01-1 | 테이블 초기 설정 입력 (UI) | Epic 1 |
| US-C01-2 | 자동 로그인 (UI) | Epic 1 |
| US-C02-1 | 카테고리별 메뉴 목록 조회 (UI) | Epic 2 |
| US-C02-2 | 메뉴 상세 정보 확인 (UI) | Epic 2 |
| US-C03-1 | 메뉴를 장바구니에 추가 | Epic 3 |
| US-C03-2 | 장바구니 수량 조절 | Epic 3 |
| US-C03-3 | 장바구니 메뉴 삭제 | Epic 3 |
| US-C03-4 | 장바구니 총 금액 실시간 계산 | Epic 3 |
| US-C03-5 | 장바구니 비우기 | Epic 3 |
| US-C03-6 | 장바구니 로컬 저장 | Epic 3 |
| US-C04-1 | 주문 내역 최종 확인 (UI) | Epic 4 |
| US-C04-2 | 주문 확정 (UI) | Epic 4 |
| US-C04-3 | 주문 실패 처리 (UI) | Epic 4 |
| US-C04-4 | 추가 주문 (UI) | Epic 4 |
| US-C05-1 | 메뉴 추천 요청 (UI) | Epic 5 |
| US-C05-2 | AI 추천 결과 확인 및 선택 (UI) | Epic 5 |
| US-C06-1 | 현재 세션 주문 내역 조회 (UI) | Epic 6 |
| US-C06-2 | 주문 상태 확인 (UI) | Epic 6 |

## Unit 3: Admin App

| Story ID | Story Name | Epic |
|---|---|---|
| US-A01-1 | 관리자 로그인 (UI) | Epic 7 |
| US-A01-2 | 관리자 세션 유지 (UI) | Epic 7 |
| US-A02-1 | 테이블별 주문 대시보드 조회 (UI) | Epic 8 |
| US-A02-2 | 실시간 주문 수신 (UI/SSE) | Epic 8 |
| US-A02-3 | 주문 상세 보기 (UI) | Epic 8 |
| US-A02-4 | 주문 상태 변경 (UI) | Epic 8 |
| US-A03-1 | 테이블 태블릿 초기 설정 (UI) | Epic 9 |
| US-A03-2 | 주문 삭제 (UI) | Epic 9 |
| US-A03-3 | 결제 완료 처리 (UI) | Epic 9 |
| US-A03-4 | 과거 주문 내역 조회 (UI) | Epic 9 |
| US-A04-1 | 메뉴 조회 (UI) | Epic 10 |
| US-A04-2 | 메뉴 등록 (UI) | Epic 10 |
| US-A04-3 | 메뉴 수정 (UI) | Epic 10 |
| US-A04-4 | 메뉴 삭제 (UI) | Epic 10 |
| US-A04-5 | 메뉴 노출 순서 조정 (UI) | Epic 10 |

## 검증
- **전체 스토리 27개**: 모두 최소 1개 유닛에 할당됨
- **미할당 스토리**: 없음
- **장바구니 스토리 (Epic 3)**: Unit 2 전용 (클라이언트 로컬 로직)
- **API 관련 스토리**: Unit 1(백엔드) + Unit 2 또는 Unit 3(프론트엔드) 양쪽에 매핑
