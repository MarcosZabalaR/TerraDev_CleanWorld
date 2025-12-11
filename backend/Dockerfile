# --------- BUILD STAGE ---------
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copiamos el pom.xml y descargamos dependencias para cachear
COPY pom.xml .

RUN mvn dependency:go-offline -B

# Copiamos el código fuente
COPY src ./src

# Construimos el JAR
RUN mvn clean package -DskipTests

# --------- RUNTIME STAGE ---------
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copiamos el jar generado desde el stage anterior
COPY --from=build /app/target/*.jar app.jar

# Puerto que usará Spring Boot
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
