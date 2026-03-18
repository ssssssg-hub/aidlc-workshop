# Unit of Work

## 개발 전략
- **아키텍처**: 모놀리스 (Spring Boot 단일 애플리케이션)
- **개발 순서**: 순차적 (Unit 1 → Unit 2 → Unit 3)

---

## Unit 1: Backend API (Spring Boot)

**유형**: 모놀리스 백엔드 서비스
**기술**: Spring Boot, Java/Kotlin, PostgreSQL, SSE, OpenAI API
**책임**:
- 전체 REST API 제공
- 데이터베이스 스키마 및 데이터 관리
- JWT 인증/인가
- SSE 실시간 이벤트 스트리밍
- AI 메뉴 추천 (OpenAI 연동)
- 이미지 업로드/서빙

**코드 구조**:
```
backend/
  src/main/java/com/tableorder/
    config/          # Security, CORS, SSE 설정
    controller/      # REST Controllers
    service/         # Business Logic
    repository/      # Data Access
    entity/          # JPA Entities
    dto/             # Request/Response DTOs
    security/        # JWT Filter, Auth
    exception/       # Global Exception Handler
  src/main/resources/
    application.yml
    db/migration/    # Flyway migrations
  src/test/
```

---

## Unit 2: Customer App (React — 모바일 웹)

**유형**: 프론트엔드 SPA
**기술**: React, TypeScript
**책임**:
- 테이블 태블릿 자동 로그인/세션 관리
- 메뉴 조회 및 탐색
- 장바구니 관리 (localStorage)
- 주문 생성 및 추가 주문
- AI 메뉴 추천 UI
- 주문 내역 조회

**코드 구조**:
```
frontend-customer/
  src/
    components/      # 재사용 UI 컴포넌트
    pages/           # 페이지 컴포넌트
    hooks/           # Custom hooks
    services/        # API 호출
    store/           # 상태 관리
    types/           # TypeScript 타입
    utils/           # 유틸리티
```

---

## Unit 3: Admin App (React — 데스크톱 웹)

**유형**: 프론트엔드 SPA
**기술**: React, TypeScript
**책임**:
- 관리자 로그인/세션 관리
- 실시간 주문 모니터링 (SSE 수신)
- 테이블 관리 (설정, 주문 삭제, 결제 완료, 과거 내역)
- 메뉴 관리 (CRUD, 이미지 업로드, 순서 조정)

**코드 구조**:
```
frontend-admin/
  src/
    components/      # 재사용 UI 컴포넌트
    pages/           # 페이지 컴포넌트
    hooks/           # Custom hooks
    services/        # API 호출, SSE 연결
    store/           # 상태 관리
    types/           # TypeScript 타입
    utils/           # 유틸리티
```
