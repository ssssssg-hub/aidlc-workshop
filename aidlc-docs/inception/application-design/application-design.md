# Application Design — 통합 문서

## 1. 아키텍처 개요

- **Backend**: Spring Boot, Layered Architecture (Controller → Service → Repository)
- **Frontend**: React (TypeScript) x 2 (고객용 모바일 웹 + 관리자용 데스크톱 웹)
- **Database**: PostgreSQL
- **통신**: REST API + SSE (실시간 주문)
- **외부 연동**: OpenAI API (메뉴 추천)
- **이미지 저장**: 서버 로컬 파일시스템 (Docker volume)
- **배포**: Docker Compose

## 2. 시스템 구성도

```
+-------------------+     +--------------------+
|  Customer App     |     |  Admin App         |
|  (React, Mobile)  |     |  (React, Desktop)  |
+-------------------+     +--------------------+
         |                         |       ^
         | REST API                | REST  | SSE
         v                         v       |
+----------------------------------------------+
|          Spring Boot Backend                 |
|  +--------+  +-------+  +--------+          |
|  |  Auth  |  | Menu  |  | Order  |          |
|  +--------+  +-------+  +--------+          |
|  +--------+  +-------+  +--------+          |
|  | Table  |  |  SSE  |  | Recom. |          |
|  +--------+  +-------+  +--------+          |
|  +--------+                                  |
|  | Image  |                                  |
|  +--------+                                  |
+----------------------------------------------+
         |                         |
         v                         v
+----------------+         +----------------+
|  PostgreSQL    |         |  OpenAI API    |
+----------------+         +----------------+
```

## 3. 기술 결정사항 요약

| 결정 | 선택 | 근거 |
|---|---|---|
| 백엔드 구조 | Layered Architecture | MVP에 적합, Spring Boot와 자연스러운 조합, 빠른 개발 |
| LLM Provider | OpenAI API (GPT) | 사용자 선택 |
| 이미지 저장 | 로컬 파일시스템 | Docker volume 마운트, MVP에 충분 |

## 4. 상세 설계 문서 참조

- [components.md](components.md) — 컴포넌트 식별 및 책임
- [component-methods.md](component-methods.md) — 메서드 시그니처
- [services.md](services.md) — 서비스 레이어 설계
- [component-dependency.md](component-dependency.md) — 의존성 및 데이터 흐름
