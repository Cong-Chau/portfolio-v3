# ==========================================
# 1. Build Stage
# ==========================================
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copy Maven wrapper & pom.xml first to leverage Docker layer cache
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Fix line endings (in case copied from Windows CRLF) and grant execution permission
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code and build package
COPY src ./src
RUN ./mvnw clean package -DskipTests -B

# ==========================================
# 2. Runtime Stage (Lightweight JRE)
# ==========================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create a non-root user for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy generated jar from builder stage
COPY --from=builder --chown=appuser:appgroup /app/target/*.jar app.jar

# Spring Boot default port (Render/Koyeb will inject PORT env variable)
ENV PORT=8080
EXPOSE 8080

# Configure JVM memory limits for container environments (e.g., 512MB RAM free tier)
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
