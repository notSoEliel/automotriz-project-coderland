<div align="center">
  <h1>Coderland Auto - Sistema de Gestión de Inventario Automotriz</h1>

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](#)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](#)
  [![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](#)
  [![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](#)

  <p>Este repositorio contiene el código fuente para el reto técnico de Coderland Auto, proveyendo una solución robusta y escalable para la gestión de inventario de vehículos. El sistema abarca el ciclo completo de administración de agencias, versiones de vehículos e inventario físico, enfocado en el rendimiento y la experiencia de usuario.</p>
</div>

---

## Instrucciones de Ejecución (Setup)

Para desplegar el proyecto en un entorno local, asegúrese de tener Docker y Docker Compose instalados en su sistema.

1. Clone el repositorio e ingrese al directorio raíz del proyecto:

```bash
git clone https://github.com/notSoEliel/automotriz-project-coderland.git
cd automotriz-project-coderland
```

2. Construye y levante los contenedores en segundo plano:

```bash
docker-compose up --build -d
```

3. El sistema estará disponible una vez que los servicios hayan finalizado su inicialización.

### Credenciales de Acceso y Documentación API

Para ingresar al sistema cliente, utilice las siguientes credenciales establecidas por defecto en la base de datos inicial:

- **Usuario:** `admin`
- **Contraseña:** `coderland2026`

**Exploración de la API (OpenAPI / Scalar):**
Una vez levantado el entorno, la documentación interactiva del backend se encuentra accesible de forma directa en la ruta `/scalar` (ej. `http://localhost:8080/scalar`). Adicionalmente, la ruta raíz (`/`) incorpora redirección transparente hacia esta interfaz de documentación.

## Estructura de Directorios

El repositorio se divide claramente para separar responsabilidades entre el cliente, el servidor y la infraestructura:

```text
automotriz-project-coderland/
├── backend/                   # API REST en Spring Boot 4
│   ├── src/main/java/...      # Lógica de negocio (Controllers, Services, Repositories, Config)
│   ├── src/main/resources/    # Configuración de propiedades y base de datos
│   ├── uploads/               # Directorio persistente para gestión de imágenes
│   └── pom.xml                # Definición de dependencias Maven
├── frontend/                  # Aplicación SPA en React
│   ├── public/                # Assets estáticos y favicon
│   ├── src/                   # Componentes, Contextos, Servicios Axios y Vistas (Pages)
│   ├── package.json           # Dependencias NPM y scripts
│   └── vite.config.js         # Configuración del bundler y plugins
├── docker-compose.yml         # Orquestación (Servicios, Redes bridge, Volúmenes)
└── README.md                  # Documentación principal del sistema
```

## Arquitectura y Decisiones Técnicas

El proyecto está diseñado bajo un modelo cliente-servidor estrictamente separado, permitiendo la escalabilidad independiente de las capas.

### Arquitectura Frontend

La capa de presentación web ha sido desarrollada utilizando:

- **React**: Como biblioteca principal para la construcción de interfaces dinámicas.
- **Shadcn UI y Tailwind CSS**: Para la creación de componentes accesibles y estables, garantizando coherencia visual mediante clases de utilidad sin depender de estilos precompilados rígidos.
- **Context API**: Implementado para la gestión del estado global de la autenticación y el manejo global de errores.
- **Axios con Interceptors**: Configurado para la inyección automática de tokens de seguridad y la interceptación centralizada de respuestas de error de red o no autorizadas.

### Arquitectura Backend

La lógica de negocio y persistencia se gestiona a través de:

- **Spring Boot 4**: Framework base para la creación de la API REST.
- **Spring Data JPA e Hibernate**: Para la abstracción de acceso a datos y mapeo objeto-relacional (ORM).
- **PostgreSQL**: Motor de base de datos relacional primario.
- **Arquitectura por Capas**: Clara separación entre Controladores, Servicios y Repositorios, garantizando la mantenibilidad y aislamiento de la lógica de negocio.
- **Data Transfer Objects (DTOs)**: Implementados para asegurar que la exposición de datos hacia el frontend esté controlada y sea independiente de los modelos de persistencia.

### Decisiones Clave

- **Optimización Multimedia (WebP)**: Para el almacenamiento de imágenes, se optó por compresión y formato WebP, lo cual reduce significativamente el consumo de ancho de banda y los tiempos de carga en las galerías visuales.
- **Paginación Server-Side (Inventario)**: Con el objetivo de gestionar eficientemente volúmenes de datos a gran escala, el módulo de inventario procesa la paginación a nivel de base de datos. Esto previene la sobrecarga de memoria en la aplicación cliente enviando únicamente los bloques de datos necesarios.
- **Soft-fallbacks Visuales**: Se han implementado respaldos visuales automáticos para registros que carecen de imágenes específicas, manteniendo la integridad de la interfaz general sin generar fracturas de diseño.

## Resolución de Criterios Técnicos

A continuación se detalla técnicamente la resolución de las áreas solicitadas durante el proyecto:

- **Dockerización Avanzada**: La infraestructura orquestada por `docker-compose.yml` emplea redes en modo `bridge` para el aislamiento de los contenedores web y base de datos. Asimismo, define e implementa volúmenes persistentes explícitos para la base de datos (`postgres_data`) y los recursos multimedia cargados localmente (`/uploads`).
- **Documentación de API**: Se ha integrado OpenAPI para explorar de forma interactiva cada endpoint. La interfaz de documentación, generada a través de Scalar UI, se encuentra accesible de manera directa en la ruta `/scalar` sin requerir configuraciones adicionales tras levantar los contenedores.
- **Seguridad**: Implementación formal de Spring Security construyendo filtros personalizados que procesan tokens JWT (firmados digitalmente bajo el estándar HS256). Toda la comunicación está estructurada bajo el enfoque Stateless, omitiendo el control de sesiones en la memoria del servidor.
- **Validaciones**: Se implementó una gestión de errores transversal a través de `@ControllerAdvice`, centralizando la captura de excepciones (como la violación de constraints de base de datos). Estos errores se propagan como instrucciones estructuradas bajo los códigos HTTP 400 y 409, los cuales son posteriormente capturados por el Frontend y presentados informativamente en los inputs o modales correspondientes.
- **UX/UI en Frontend**: La plataforma opera como una Single Page Application (SPA) responsiva con un diseño basado en la paleta de colores Zinc y Emerald. Incorpora transiciones de estado en la navegación y prevé vistas exclusivas en el esquema de ruteo para aislar los errores críticos u omisiones de permisos (404, 403 y 500).

## Capturas de Interfaz

![Login](docs/login.png)

![Dashboard](docs/dashboard.png)

![Inventario](docs/inventario.png)

![Gestión de Errores](docs/error.png)

## Deuda Técnica y Próximos Pasos

Para garantizar la entrega puntual de los requerimientos funcionales y consolidar la estabilidad de la arquitectura subyacente propuesta dentro del límite de tiempo asignado para el reto, la implementación exhaustiva del marco de pruebas no formó parte de esta iteración.

Como próximo hito, la arquitectura se encuentra técnicamente preparada para la inyección progresiva de pruebas unitarias y de integración utilizando **JUnit** y **Mockito** en la capa del Backend. Este objetivo está planificado para abordarse extensivamente al inicio de la siguiente fase de desarrollo.
