<div align="center">
  <h1>Coderland Auto - Sistema de Gestión de Inventario Automotriz</h1>

  [![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![Spring Boot](https://img.shields.io/badge/Spring_Boot_4.0.3-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](#)
  [![Java](https://img.shields.io/badge/Java_25-007396?style=for-the-badge&logo=java&logoColor=white)](#)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](#)
  [![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](#)
  [![JWT](https://img.shields.io/badge/JWT_Stateless-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](#)

  <p>Repositorio entregable que contiene la solución íntegra al reto técnico de Coderland. Un análisis exhaustivo sobre la arquitectura, calidad y resiliencia de la ingeniería aplicada.</p>
</div>

---

> **Nota:** Las instrucciones fundamentales para ejecutar, visualizar y evaluar el proyecto se encuentran al principio de este documento. Más abajo (en la sección **Documentación Técnica Arquitectónica**) encontrará los detalles extensos sobre la toma de decisiones, dependencias, criterios técnicos corporativos y estructura de componentes.

## Cómo Iniciar el Proyecto

La infraestructura local (Persistencia de PostgreSQL, Servomotor de API y renderizado del cliente) ha sido íntegramente contenedorizada en Docker. Se aprovisionaron redes internas para gobernar el enrutamiento restringido y volúmenes permanentes (`postgres_data` y `/uploads`) para proteger los datos y la subida de imágenes multimedia.

El ecosistema entero se levanta de manera ágil invocando su ejecución. A continuación, los pasos de ejecución según su sistema operativo:

### Mac y Windows

1. Asegúrese de tener **Docker Desktop** abierto y ejecutándose de fondo.
2. Abra su terminal (Terminal principal en Mac; PowerShell/Git Bash en Windows) y ejecute los siguientes comandos:

```bash
git clone https://github.com/notSoEliel/automotriz-project-coderland.git
cd automotriz-project-coderland
docker-compose up -d
```

### Linux

1. Asegúrese de que el servicio de Docker esté activo ejecutando `sudo systemctl start docker`.
2. Dependiendo de los permisos definidos en su entorno particular, quizá necesite usar cuenta administrativa (sudo):

```bash
git clone https://github.com/notSoEliel/automotriz-project-coderland.git
cd automotriz-project-coderland
sudo docker-compose up -d
```

## Flujo de Inicio (Servicios Disponibles)

Una vez completada la inicialización de contenedores mediante Docker Compose, puede dirigirse instantáneamente a las interacciones generadas a continuación:

### Frontend (Interfaz de Evaluación y Uso Directo)
- **URL**: [http://localhost:5173](http://localhost:5173)
- **Credenciales asignadas (Administrador)**:
  - **Usuario**: `admin`
  - **Contraseña**: `coderland2026`

### Backend (Despliegue y Pruebas a la API OpenAPI)
La capa lógica levanta en tiempo local un endpoint con descripciones de cada servicio en Scalar UI (Swagger avanzado), para revisar sus modelos relacionales interactivos.
- **Panel de exploración y peticiones:** [http://localhost:8080/scalar](http://localhost:8080/scalar)

## Flujo de Trabajo (Gestión del Sistema)

Para asegurar la coherencia arquitectónica y la integridad de bases de datos relacionales subyacentes, la inserción total y correcta de un **Vehículo Físico** en inventario debe seguir el presente camino progresivo:

1. **Constituir una Marca**: Diríjase a la barra de Catálogos y emita un alta para su marca base automotriz deseada.
2. **Constituir el Modelo**: Ingrese en el listado sobre esa marca para asignar a esta dependencia su respectivo Modelo contenedor.
3. **Construir una Versión**: Formule el acabado fotográfico referencial, estableciendo un precio y estipulando en su ficha los desplazamientos de especificación técnica correspondientes asimiladas al modelo en cuestión.
4. **Acoplar el Vehículo (Matriculación Fija)**: Finalice el camino acercándose a la solapa **Inventario**, inyectando localmente una unidad donde converjan placa base, la versión diseñada previa y asigne alguna de las distintas ubicaciones de agencias correspondientes.

## Ejecución de Pruebas Automatizadas (QA)

El marco operativo cuenta con procesos asilados conformados gracias a Mockito y JUnit 5, no expuestos de manera explícita contra persistencia nativa externa para proveer un pipeline libre y certero.

### Cómo Correr las Pruebas Localmente

> **Advertencia:** Si la ejecución mediante Docker falla por temas de incompatibilidad de su sistema, las pruebas pueden efectuarse de manera directa a través de IntelliJ IDEA (ver la guía debajo).

#### Opción 1: Mediante Docker (Recomendado)

Puede recurrir a su contenedor host subiendo tests en paralelo, evitando exigencias temporales o instalaciones Java originarias en su OS local. Invoque desde la raíz:
```bash
docker run --rm -v "$PWD/backend":/app -w /app maven:3-eclipse-temurin-25 mvn clean test
```

#### Opción 2: Mediante IntelliJ IDEA (En caso de incompatibilidad)

Si tiene inconvenientes con el contenedor, puede validar las pruebas rápidamente desde el IDE:

1. Asegúrese de tener configurado localmente **Java 25** (o la versión correspondiente definida en el `pom.xml` compatible con **Spring Boot 4**) dentro de su entorno para evitar errores de compilación o arranque y garantizar plena compatibilidad en el Contexto de Spring.
2. Abra únicamente el directorio `backend` en **IntelliJ IDEA**.
3. Espere a que **Maven** termine de indexar y descargar las dependencias correspondientes.
4. En el árbol del proyecto, navegue hacia la carpeta `src/test/java`.
5. Haga clic derecho sobre el paquete de pruebas y seleccione **Run 'All Tests'** (o presione el botón de "Play" ▶️ verde junto al nombre de la clase).

### Muestra General de Cobertura Aplicada
La ingeniería de QA previó las siguientes rutas algorítmicas de validación directa integradas:
- **Calidad de Entrada en DTOs**: Blindaje nativo detectando variables irracionales e improcedentes sobre transacciones finales de costo, garantizando un filtrado pasivo anti-negatividad o fallas nulas en registros monetarios.
- **Veracidad Server-Side Pagination**: Evaluó respuestas conteniendo desbordamientos algorítmicos al apuntar páginas excesivas contra inventarios nulos o minoristas, garantizando devoluciones asiladas íntegras contra Out Of Bounds Limits.
- **Gestión Multimedia Segura**: Evitar mediante un bloqueo heurístico programado y explícito cualquier elevación/carga simulada conteniendo scripts ejecutables bajo el empaquetado fotográfico.
- **Relaciones Cíclicas (Eliminaciones en Cascada)**: Interceptación pasiva asegurando las imposibilidades físicas y lógicas contra dependencias en eliminaciones sobre marcas repletas por inventario.

## Solucionando Problemas del Proyecto

### Reinicio Absoluto de Contenedores y Datos Retenidos
Tanto archivos estáticos introducidos como operaciones de DB ancladas permanecerán bajo control en volúmenes lógicos locales (Docker Volumes). Ya sea por una migración de conflictos pre-evaluada local originando ruido en su máquina sobre ciertos puertos, fallas colaterales y la simple solicitud a vaciar el panorama retornando datos en 0 e inyectando iniciales nativas, opere una parada y demolición controladas en todo:

```bash
docker-compose down -v
```
Al finalizar y correr nuevamente un normalizador (`docker-compose up -d`), se inyectan todas sus asignaciones vacías en contenedores y ejecuta el proceso *SeedDataRunner*, poblando un panorama limpio para realizar cualquier prueba en un nuevo ciclo.

---

## Documentación Técnica Arquitectónica

### Prerrequisitos de Entorno

Si requiere evaluar las lógicas transaccionales visualmente bajo editores o interactuar activamente con él:
- **Docker** y **Docker Compose**: Entorno mandatorio de despliegue sobre su SO.
- **Git**: Proveedor elemental utilizado durante repositorios concurrentes y clonación nativa.

### Propósito de la Prueba Técnica

Este proyecto conforma la resolución metodológica para la prueba técnica avanzada solicitada por **Coderland**. El sistema, titulado `Coderland Auto`, modela un caso de uso ficticio enfocado en satisfacer rigurosos estándares dentro de empresas con manejo automotriz extensivo. 

Bajo la figura fundamental evaluativa general de esta ingeniería, denota resiliencia, separaciones explícitas de SPA y Backend, escalados concurrentes, contención por Docker para garantizar replicabilidad y aserciones de código establecidas rigurosamente como los manuales y arquitectos evalúan dentro de mantenibilidades a largo plazo.

### Arquitectura y Decisiones Técnicas

El enfoque asiste separaciones atadas al modelo Cliente-Servidor independientes del esquema de hardware:

#### Arquitectura Frontend
Orquestada por:
- **React 19**: Sistema organizador en componentes lógicos base aislados.
- **Shadcn UI y Tailwind CSS**: Librerías funcionales que resguardan y exponen lineamientos gráficos atómicos para evitar redundancia crítica general entre diseños.
- **Context API y Axios**: Encapsulación del control Token a variables globales, inyectándolo sin comprometer estados.

#### Arquitectura Backend
Asentado en:
- **Spring Boot 4 / Java 25**: API transaccional multihilos.
- **Spring Data JPA y DB PostgreSql**: Operaciones y abstracción O.R.M. general contra conexiones relacionales ACID.
- **Patrón DTO Transversal**: Aislantes formales protegiendo tablas críticas impidiendo mapeos externos irrestrictos antes de filtrado validado.

#### Tomas de Decisión Critica 
- **Regeneración Auto-regulada (Seeding Integrado)**: Un *SeedDataRunner* comprueba iniciales de bases permitiendo al evaluador su validación completa desde el minuto cero con elementos listos y preformulados para iniciar operaciones base.
- **Paginado Server-Side Backend**: Desligando cargas innecesarias para interfaces y procesadas directamente al motor primario nativo previniendo sobrecarga en la Memoria RAM.
- **Regulación Formato WebP Integral**: Toda la captura interactiva fotográfica nativa se comprime en background originando descargas reduciendo ancho de banda sin fracturar las representaciones visuales.

### Resolución a los Criterios Técnicos (Checklist)
- **Aislamiento por Contenedores**: Volúmenes separados, redes en modo bridge conectadas protegiendo tráfico con base externa de Postgres.
- **RESTful documentada automatizada**: Implementación pasiva SpringDoc proveyendo de manera local y en código sus propias librerías consultivas (OpenAPI via Scalar).
- **Entorno Control Autorizado (Seguridad)**: Verificación interna contra firmas HS256 y vencimientos sobre cadenas Web-Tokens sin acudir a las memorias volátiles globales de sesión en capas Backend (*Enfoque Absolutamente Stateless*).
- **UX Formateado Global de Errores (@ControllerAdvice)**: Capturador superior nativo para anomalías directas relacionales, formateos incorrectos emitiendo cabeceras estándares transformadas hacia interceptores en React para un mapeo de visualización amable sin rompimientos en pantalla ni quiebres repentinos de DOM.

### Base de Datos y Dependencias (Visualización Estructurada)

La cohesión y directivas se sostienen de restricciones lógicas formales, a conocer:

#### Cadena Referencial del Negocio Evaluativo
1. **Entidades Corporativas (Raíces Supremas)**: Estructuras orgánicas referenciales hacia la Agencias sedes organizadas y las Marcas originarias.
2. **Entidades Inherentes Constructivas**: Modelos nacidos bajo sus asignaciones restrictivas contra sus Marcas únicas.
3. **Puntualidad en Variación**: Versiones técnicas que representan capacidades físicas contra el Modelo de raíz inherente principal.
4. **Acople Transaccional Mapeado**: Automotor originario mapeando la Versión general base e induciendo el stock local y real contra Agencia correspondiente bajo su matrícula en regla.

#### Inspección por Entornos Externos 
Para conectarse de manera administrativa en SQL nativa por *DBeaver* ó *DataGrip* y analizar campos en bruto (Puerto nativo apuntado desde host hacia 5432):
- **Host**: `localhost` (Port: `5432`)
- **Usuario**: `user_admin`
- **Contraseña**: `secret_password`
- **Catalog/Database**: `automotriz_db`

### Tabla de Endpoints Comunes Abiertos

Los accesos y orquestación general proceden sobre las transacciones base más prominentes de lectura y exposición general:

| Patrón Endpoint | Método HTTP Transaccional | Objetivo Base y Exposición al Agente de Consumo |
| :--- | :---: | :--- |
| `/api/auth/login` | `POST` | Interfaz inyectora credenciales consumiendo devoluciones Stateless JWT validado. |
| `/api/vehiculos` | `GET` | Absorción externa contra listas relativas originando paginación paramétrica para resultados base Inventariables. |
| `/api/vehiculos/{id}` | `GET` | Interconexión directa buscando asimilar datos complejos contra idúnico asignado en plataforma nativa matriculada. |
| `/api/marcas` | `GET` | Recuperación total integradas base del sistema transaccional origen genérico para el Catalogo. |

### Diagrama Funcional SPA

| Designación del Routing | Tarea Visual Encargada por Vista |
| :--- | :--- |
| **Login Auth** | Evaluadora general previniendo ingreso y reteniendo credenciales. |
| **Home (Dashboard)** | Visor global de parámetros y KPI superficiales del total alojado interactivo. |
| **Red Agencias Locales** | Base interactiva sobre representaciones, locaciones e intermediarios físicos base de las unidades. |
| **Pilar de Inventario** | Entorno visual intensivo. Gestiona operaciones externas uniendo interacciones de galerías visuales cruzadas por filtrado de variables dinámicas sobre tabla relacional expuesta global. |
| **Views Catch Error** | Vistas controladas pasivas resolviendo las respuestas nulas originando un fallo natural (`404, 403 o 500 Global Server`). |

### Directorios Generales en Repositorio

```text
automotriz-project-coderland/
├── backend/                   # API REST sobre entornos asíncronos y Java Multihilo
│   ├── src/test/java/...      # Estructura profunda para Unit Tests base asilados y funcionales Mockito
│   ├── src/main/java/...      # Representación arquitectural multicapas (Servicios, Repositorios e Inyecciones JWT Auth Transversal)
│   └── src/main/resources/    # Conexiones configuracionales sobre la base PostgreSQL persistente
├── frontend/                  # Renderizado de Árbol Virtual React19 implementado sobre interfaces Tailwind integradas unificadas
│   ├── src/                   # Direccionador nativo por Routers e indexadores HTTP configuracionales Axios.
├── docker-compose.yml         # Reglas directivas de orquestaciones base integrando todo ecosistema, redes controladas y puertos físicos
└── README.md                  # Especificación Documental presente de exposición analítica formativa técnica
```

## Capturas de Entorno del Proyecto Final En Producción Local

![Vista Login Visualización](docs/login.png)

![Interfaz Gráfica Inicio (Home/Dashboard)](docs/dashboard.png)

![Interactiva Visual sobre Registros Tabulados (Inventario)](docs/inventario.png)

![Fallo Interactivo Captado Global (404/500/403)](docs/error.png)

---
*Diseño y desarrollo estructurado como demostración resolutiva arquitectónica técnica ante desafío de Fullstack Developer emitido en 2026 para Coderland.*
