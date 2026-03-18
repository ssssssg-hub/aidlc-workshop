# Business Rules — Unit 1: Backend API

## 1. 인증 규칙

| Rule ID | Rule | Detail |
|---|---|---|
| AUTH-01 | 비밀번호 해싱 | bcrypt (strength 10) |
| AUTH-02 | 로그인 시도 제한 | 5회 실패 시 15분 잠금 |
| AUTH-03 | JWT 만료 | 16시간 |
| AUTH-04 | JWT 필수 클레임 | storeId, userId/tableId, role(ADMIN/TABLE), sessionId(TABLE만) |
| AUTH-05 | 테이블 세션 생성 | 로그인 성공 시 자동 생성 (기존 활성 세션 있으면 유지) |

## 2. 주문 규칙

| Rule ID | Rule | Detail |
|---|---|---|
| ORD-01 | 주문 상태 | PENDING, PREPARING, COMPLETED |
| ORD-02 | 상태 변경 | 관리자 자유 변경 허용 (양방향) |
| ORD-03 | 주문 생성 조건 | 활성 세션 필수, 최소 1개 항목 |
| ORD-04 | 주문 번호 형식 | ORD-{yyyyMMdd}-{sequence} |
| ORD-05 | 총 금액 계산 | SUM(unitPrice × quantity) |
| ORD-06 | 주문 삭제 | 관리자만 가능, 확인 후 즉시 삭제 |
| ORD-07 | 추가 주문 | 동일 세션 내 별도 주문 번호로 생성 |

## 3. 메뉴 규칙

| Rule ID | Rule | Detail |
|---|---|---|
| MENU-01 | 필수 필드 | name, price, categoryId |
| MENU-02 | 가격 범위 | 100원 ~ 1,000,000원 |
| MENU-03 | 이미지 | 선택사항, jpg/jpeg/png/gif/webp, 최대 5MB |
| MENU-04 | 노출 순서 | displayOrder 필드, 오름차순 정렬 |
| MENU-05 | 메뉴 삭제 | 기존 주문의 OrderItem은 스냅샷으로 유지 |

## 4. 테이블 규칙

| Rule ID | Rule | Detail |
|---|---|---|
| TBL-01 | 세션 시작 | 테이블 로그인 시 자동 (UUID) |
| TBL-02 | 세션 종료 | 결제 완료 시 (active=false, endedAt 설정) |
| TBL-03 | 결제 완료 | 주문 → OrderHistory 이동, 테이블 리셋 |
| TBL-04 | 과거 내역 | 날짜 필터링, 시간 역순 |
| TBL-05 | 테이블 번호 | 매장 내 고유 |

## 5. SSE 규칙

| Rule ID | Rule | Detail |
|---|---|---|
| SSE-01 | 연결 타임아웃 | 30분 |
| SSE-02 | Heartbeat | 30초 간격 |
| SSE-03 | 전달 지연 | 2초 이내 |
| SSE-04 | 이벤트 타입 | NEW_ORDER, ORDER_STATUS_CHANGED, ORDER_DELETED, PAYMENT_COMPLETED |

## 6. AI 추천 규칙

| Rule ID | Rule | Detail |
|---|---|---|
| REC-01 | 추천 조합 수 | 2~3개 |
| REC-02 | 입력 | 인원수 (1~20), 식사 유형 (SHARE/INDIVIDUAL) |
| REC-03 | 응답 검증 | 추천된 메뉴가 실제 존재하는지 확인 |
| REC-04 | 실패 처리 | OpenAI API 실패 시 에러 메시지 반환 |
