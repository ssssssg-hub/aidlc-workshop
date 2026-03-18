# Unit of Work Dependencies

## Dependency Matrix

| Unit | Depends On | Dependency Type |
|---|---|---|
| Unit 1: Backend API | PostgreSQL (외부) | 런타임 |
| Unit 1: Backend API | OpenAI API (외부) | 런타임 (추천 기능) |
| Unit 2: Customer App | Unit 1: Backend API | REST API 호출 |
| Unit 3: Admin App | Unit 1: Backend API | REST API 호출 + SSE 수신 |

## 개발 순서

```
Unit 1: Backend API
    |
    | API 완성 후
    v
Unit 2: Customer App
    |
    | 고객 기능 완성 후
    v
Unit 3: Admin App
```

## 순서 근거
1. **Unit 1 (Backend)** 먼저: 프론트엔드가 호출할 API가 존재해야 함
2. **Unit 2 (Customer App)** 다음: 핵심 비즈니스 플로우(주문)가 고객에서 시작
3. **Unit 3 (Admin App)** 마지막: 주문 데이터가 있어야 모니터링/관리 기능 테스트 가능

## 통합 포인트

| 통합 포인트 | Unit 1 ↔ Unit 2 | Unit 1 ↔ Unit 3 |
|---|---|---|
| 인증 | 테이블 로그인 API | 관리자 로그인 API |
| 메뉴 | 메뉴 조회 API | 메뉴 CRUD API |
| 주문 | 주문 생성/조회 API | 주문 모니터링 SSE + 상태 변경 API |
| 테이블 | — | 테이블 설정/결제 완료 API |
| 추천 | 추천 요청 API | — |
| 이미지 | 이미지 조회 API | 이미지 업로드 API |
