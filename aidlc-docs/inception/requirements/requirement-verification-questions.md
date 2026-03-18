# Requirements Verification Questions

테이블오더 서비스 요구사항을 분석했습니다. 아래 질문에 답변해 주세요.
각 질문의 `[Answer]:` 태그 뒤에 선택지 알파벳을 입력해 주세요.
선택지가 맞지 않으면 마지막 옵션(Other)을 선택하고 설명을 추가해 주세요.

---

## Question 1
백엔드 기술 스택으로 어떤 것을 사용하시겠습니까?

A) Node.js + Express (JavaScript/TypeScript)
B) Spring Boot (Java/Kotlin)
C) Django/FastAPI (Python)
D) Go (Gin/Echo)
E) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 2
프론트엔드 기술 스택으로 어떤 것을 사용하시겠습니까?

A) React (JavaScript/TypeScript)
B) Vue.js
C) Next.js (React 기반 풀스택)
D) Angular
E) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 3
데이터베이스로 어떤 것을 사용하시겠습니까?

A) PostgreSQL
B) MySQL
C) MongoDB
D) DynamoDB
E) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 4
배포 환경은 어떻게 계획하고 계십니까?

A) AWS 클라우드 (EC2, ECS, Lambda 등)
B) 로컬/온프레미스 서버
C) Docker Compose 기반 로컬 개발 환경만 (배포는 추후 결정)
D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 5
고객용 인터페이스와 관리자용 인터페이스를 어떻게 구성하시겠습니까?

A) 하나의 프론트엔드 앱에서 라우팅으로 분리
B) 별도의 프론트엔드 앱 2개 (고객용, 관리자용)
C) 고객용은 모바일 웹 최적화, 관리자용은 데스크톱 웹 (별도 앱)
D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 6
매장(Store) 데이터는 어떻게 관리됩니까? 멀티 매장을 지원해야 합니까?

A) 단일 매장만 지원 (MVP)
B) 멀티 매장 지원 (하나의 시스템에서 여러 매장 관리)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 7
메뉴 이미지는 어떻게 관리하시겠습니까?

A) 외부 이미지 URL 직접 입력 (이미지 업로드 기능 없음)
B) 서버에 이미지 업로드 기능 포함
C) 클라우드 스토리지(S3 등)에 업로드
D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 8
동시 접속 사용자 규모는 어느 정도를 예상하십니까?

A) 소규모 (1개 매장, 테이블 20개 이하)
B) 중규모 (1~5개 매장, 테이블 100개 이하)
C) 대규모 (5개 이상 매장, 테이블 100개 이상)
D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 9
관리자 계정 관리는 어떻게 하시겠습니까?

A) 시스템에 사전 등록된 관리자 계정 사용 (DB seed 또는 초기 설정)
B) 관리자 회원가입 기능 포함
C) 슈퍼 관리자가 매장 관리자 계정을 생성하는 방식
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 10
API 통신 방식은 어떤 것을 선호하십니까?

A) REST API
B) GraphQL
C) REST API + SSE (실시간 주문 모니터링용)
D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 11: Security Extensions
이 프로젝트에 보안 확장 규칙(Security Extension Rules)을 적용하시겠습니까?

A) Yes — 모든 SECURITY 규칙을 blocking constraint로 적용 (프로덕션 수준 애플리케이션에 권장)
B) No — 모든 SECURITY 규칙 건너뛰기 (PoC, 프로토타입, 실험적 프로젝트에 적합)
C) Other (please describe after [Answer]: tag below)

[Answer]: A
