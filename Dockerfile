# Etapa 1: Construcción (Build) usando la imagen oficial de Java 25
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

# Copiamos el Wrapper de Maven y el archivo de dependencias
COPY .mvn/ .mvn/
COPY mvnw .
COPY pom.xml .

# Le damos permisos de ejecución al script (vital en entornos Linux/Docker)
RUN chmod +x mvnw

# Copiamos nuestro código fuente
COPY src ./src

# Usamos el Wrapper para compilar el proyecto
RUN ./mvnw clean package -DskipTests

# Etapa 2: Ejecución (Runtime) con un Java más ligero (JRE)
FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
