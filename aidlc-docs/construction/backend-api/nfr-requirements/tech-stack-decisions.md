# Tech Stack Decisions — Unit 1: Backend API

## Core Stack

| 영역 | 기술 | 버전 | 선택 근거 |
|---|---|---|---|
| Language | Java | 21 (LTS) | 최신 LTS, Virtual Threads 지원, Record 등 최신 기능 활용 |
| Framework | Spring Boot | 3.4.x | Java 21 완전 지원, 최신 안정 버전, Spring Security 6.x 포함 |
| Build Tool | Gradle | Kotlin DSL | 타입 안전 빌드 스크립트, IDE 자동완성 지원 |
| Database | PostgreSQL | 16.x | 요구사항 확정, Docker 이미지 사용 |
| ORM | Spring Data JPA + Hibernate | 6.x | Spring Boot 기본 통합, 생산성 |
| Migration | Flyway | 10.x | Spring Boot 기본 통합, 버전 기반 마이그레이션 |

## Security Stack

| 영역 | 기술 | 선택 근거 |
|---|---|---|
| Authentication | Spring Security 6.x | Spring Boot 기본 통합, JWT 필터 구현 |
| JWT | jjwt (io.jsonwebtoken) | 업계 표준, 간결한 API |
| Password Hashing | BCryptPasswordEncoder | Spring Security 기본 제공, bcrypt strength 10 |
| TLS | Spring Boot 내장 TLS | application.yml 설정, 자체 서명 인증서(개발) |
| Validation | Jakarta Validation (Hibernate Validator) | Spring Boot 기본 통합, 어노테이션 기반 |

## Communication Stack

| 영역 | 기술 | 선택 근거 |
|---|---|---|
| REST API | Spring Web MVC | Spring Boot 기본, 동기 처리 |
| SSE | SseEmitter (Spring Web) | Spring 기본 제공, 별도 의존성 불필요 |
| API Documentation | springdoc-openapi | OpenAPI 3.0 자동 생성, Swagger UI 포함 |
| JSON | Jackson | Spring Boot 기본 포함 |

## AI Integration

| 영역 | 기술 | 선택 근거 |
|---|---|---|
| LLM Provider | OpenAI API (GPT) | 사용자 선택 |
| HTTP Client | Spring RestClient / WebClient | OpenAI API 호출용 |

## Logging Stack

| 영역 | 기술 | 선택 근거 |
|---|---|---|
| Logging Framework | SLF4J + Logback | Spring Boot 기본 포함 |
| Log Format | JSON (Logstash Logback Encoder) | 구조화 로깅, 파싱 용이 |
| Log Storage | 파일 기반 (Docker volume) | 로컬 환경 적합 |
| Log Rotation | Logback RollingFileAppender | 일별 로테이션, 90일 보관 |

## Testing Stack

| 영역 | 기술 | 선택 근거 |
|---|---|---|
| Unit Test | JUnit 5 + Mockito | Spring Boot 기본 포함 |
| Integration Test | Spring Boot Test | 통합 테스트 지원 |
| DB Test | Testcontainers (PostgreSQL) | 실제 DB와 동일 환경 테스트 |
| API Test | MockMvc | Controller 레이어 테스트 |

## Infrastructure

| 영역 | 기술 | 선택 근거 |
|---|---|---|
| Containerization | Docker | 요구사항 확정 |
| Orchestration | Docker Compose | 로컬 개발 환경 |
| Image Storage | 로컬 파일시스템 (Docker volume) | MVP에 충분, 사용자 선택 |
| Health Check | Spring Boot Actuator | 기본 제공, /actuator/health |

## Dependency Summary (build.gradle.kts 주요 의존성)

```kotlin
dependencies {
    // Spring Boot Starters
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-actuator")

    // Database
    runtimeOnly("org.postgresql:postgresql")
    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-database-postgresql")

    // JWT
    implementation("io.jsonwebtoken:jjwt-api:0.12.6")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.6")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.6")

    // API Documentation
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.0")

    // Logging (JSON)
    implementation("net.logstash.logback:logstash-logback-encoder:8.0")

    // Test
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
    testImplementation("org.testcontainers:junit-jupiter")
    testImplementation("org.testcontainers:postgresql")
}
```
