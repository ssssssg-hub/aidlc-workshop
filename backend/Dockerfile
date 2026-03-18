FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY build/libs/tableorder-backend-0.0.1-SNAPSHOT.jar app.jar

RUN mkdir -p /var/log/tableorder /app/uploads/images

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
