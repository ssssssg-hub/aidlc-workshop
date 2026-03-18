# NFR Requirements Plan — Unit 1: Backend API

## Plan Overview
Functional Design 아티팩트를 기반으로 비기능 요구사항을 평가하고 기술 스택을 확정합니다.

## Execution Steps

- [x] Step 1: Functional Design 분석 (domain-entities, business-logic-model, business-rules)
- [x] Step 2: NFR 질문 수집 및 사용자 답변 확인
- [x] Step 3: NFR Requirements 문서 생성 (nfr-requirements.md)
- [x] Step 4: Tech Stack Decisions 문서 생성 (tech-stack-decisions.md)
- [x] Step 5: Security Extension 준수 검증
- [x] Step 6: 사용자 승인

---

## NFR Assessment Questions

아래 질문에 답변해주세요. 각 질문의 [Answer]: 태그 뒤에 선택지 알파벳을 입력해주세요.

### Performance & Scalability

## Question 1
API 응답 시간 목표는 어느 수준인가요?

A) 일반 API 200ms 이내, 목록 조회 500ms 이내
B) 일반 API 500ms 이내, 목록 조회 1초 이내
C) 특별한 제한 없음 (합리적 수준이면 OK)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 2
동시 접속자 수 기대치는 어느 정도인가요? (단일 매장, 테이블 20개 기준)

A) 최대 20명 동시 접속 (테이블 1:1)
B) 최대 50명 동시 접속 (테이블 + 관리자 + 여유분)
C) 특별히 고려하지 않음 (소규모이므로)
D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 3
데이터베이스 커넥션 풀 사이즈는 어떻게 설정할까요?

A) 소규모 기본값 (10개)
B) 중규모 (20개)
C) AI가 적절히 판단해줘
D) Other (please describe after [Answer]: tag below)

[Answer]: B

### Availability & Reliability

## Question 4
서비스 가용성 목표는 어느 수준인가요?

A) 99.9% (연간 약 8.7시간 다운타임 허용)
B) 99% (연간 약 3.6일 다운타임 허용)
C) 특별한 SLA 없음 (MVP이므로 합리적 수준)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 5
서버 장애 시 복구 전략은 어떻게 할까요?

A) Docker Compose restart policy로 자동 재시작
B) 수동 재시작 (MVP이므로)
C) Health check + 자동 재시작 조합
D) Other (please describe after [Answer]: tag below)

[Answer]: B

### Security

## Question 6
JWT Secret Key 관리 방식은 어떻게 할까요?

A) 환경 변수로 주입 (application.yml에서 참조)
B) Docker Compose .env 파일에서 관리
C) A + B 조합 (환경 변수 주입 + .env 파일)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 7
API Rate Limiting을 어떻게 적용할까요?

A) Spring Boot 필터 기반 IP별 제한 (예: 분당 60회)
B) 로그인 API에만 제한 적용 (이미 AUTH-02로 5회 제한 있음)
C) MVP에서는 로그인 시도 제한만으로 충분
D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 8
HTTPS(TLS) 적용 범위는 어떻게 할까요?

A) Docker Compose 환경에서 Nginx reverse proxy로 TLS 종료
B) 개발 환경은 HTTP, 프로덕션 배포 시 TLS 적용 가이드 제공
C) Spring Boot 내장 TLS 설정
D) Other (please describe after [Answer]: tag below)

[Answer]: C

### Data Management

## Question 9
데이터베이스 마이그레이션 도구는 무엇을 사용할까요?

A) Flyway (Spring Boot 기본 통합)
B) Liquibase
C) JPA auto-ddl (개발용) + 수동 SQL 스크립트 (프로덕션)
D) Other (please describe after [Answer]: tag below)

[Answer] : A

## Question 10
주문 이력(OrderHistory) 데이터 보관 기간은 어떻게 할까요?

A) 무기한 보관 (삭제 정책 없음)
B) 90일 보관 후 자동 삭제
C) 1년 보관 후 자동 삭제
D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Logging & Monitoring

## Question 11
로깅 프레임워크와 출력 형식은 어떻게 할까요?

A) SLF4J + Logback, JSON 구조화 로깅 (운영 환경 대비)
B) SLF4J + Logback, 텍스트 형식 (개발 편의)
C) SLF4J + Logback, 개발은 텍스트 / 프로덕션은 JSON (프로파일 분리)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 12
로그 저장 및 모니터링은 어떻게 할까요?

A) Docker 컨테이너 stdout/stderr + Docker logs 명령어
B) 파일 기반 로깅 (Docker volume 마운트)
C) A + B 조합 (stdout + 파일 백업)
D) Other (please describe after [Answer]: tag below)

[Answer]: B

### Tech Stack Details

## Question 13
Spring Boot 버전은 어떤 것을 사용할까요?

A) Spring Boot 3.4.x (최신 안정 버전)
B) Spring Boot 3.3.x (LTS 안정 버전)
C) AI가 적절히 판단해줘
D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 14
Java 버전은 어떤 것을 사용할까요?

A) Java 21 (LTS, 최신)
B) Java 17 (LTS, 안정)
C) AI가 적절히 판단해줘
D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 15
빌드 도구는 무엇을 사용할까요?

A) Gradle (Kotlin DSL)
B) Gradle (Groovy DSL)
C) Maven
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 16
테스트 프레임워크 구성은 어떻게 할까요?

A) JUnit 5 + Mockito + Spring Boot Test + Testcontainers (PostgreSQL)
B) JUnit 5 + Mockito + Spring Boot Test + H2 (인메모리 DB)
C) JUnit 5 + Mockito + Spring Boot Test (DB 테스트는 별도 구성)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

