# --- 1단계: Frontend 빌드 ---
FROM node:24 AS frontend-builder
WORKDIR /build-fe
COPY frontend/ganeungil/package*.json ./
RUN npm install
COPY frontend/ganeungil ./
RUN npm run build

# --- 2단계: Backend 빌드 (FE 결과물 포함) ---
FROM gradle:7.6-jdk17 AS backend-builder
WORKDIR /build-be
# 1. 설정 파일만 먼저 복사
COPY ./backend/gradlew .
COPY ./backend/gradle/ gradle/
COPY ./backend/build.gradle ./backend/settings.gradle ./

# 2. 의존성 미리 다운로드 (이 단계가 캐싱되어 다음엔 1초만에 넘어감)
RUN ./gradlew dependencies --no-daemon

# 3. 그 다음 소스 복사 및 빌드
COPY . .
# 위에서 빌드한 FE 정적 파일들을 BE의 static 폴더로 복사
COPY --from=frontend-builder /build-fe/dist ./backend/src/main/resources/static
COPY backend/src ./src

RUN ./gradlew -p ./backend bootJar --no-daemon

# --- 3단계: 최종 실행 이미지 ---
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
RUN ls -R /app
# 빌드된 jar 파일만 가져오기
COPY --from=backend-builder /build-be/backend/build/libs/*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
