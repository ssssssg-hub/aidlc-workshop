# ============================================
# Stage 1: Build (JDK 21 + Gradle)
# ============================================
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /build

# Gradle wrapper 생성 (wrapper jar 없이 직접 설치)
RUN apk add --no-cache bash && \
    wget -q https://services.gradle.org/distributions/gradle-8.12-bin.zip -O /tmp/gradle.zip && \
    unzip -q /tmp/gradle.zip -d /opt && \
    rm /tmp/gradle.zip

ENV PATH="/opt/gradle-8.12/bin:${PATH}"

# 빌드 설정 먼저 복사 (의존성 캐시 레이어)
COPY build.gradle.kts settings.gradle.kts ./

# 의존성 다운로드 (캐시 활용)
RUN gradle dependencies --no-daemon 2>/dev/null || true

# 소스 복사 후 빌드
COPY src/ src/
RUN gradle bootJar --no-daemon -x test

# ============================================
# Stage 2: Runtime (JRE 21만)
# ============================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

RUN mkdir -p /var/log/tableorder /app/uploads/images

COPY --from=builder /build/build/libs/tableorder-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
