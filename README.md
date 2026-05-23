# BanaEye

## ¿En qué consiste la aplicación?

La aplicación consiste en una plataforma móvil desarrollada para apoyar a los agricultores de banano en la gestión y monitoreo de sus cultivos a lo largo de todas las etapas del ciclo de vida de la plantación. Para ello, el sistema permite registrar información de los lotes de banano, almacenar datos relevantes de cada etapa del cultivo y generar alertas o recomendaciones automáticas que ayuden al agricultor a tomar decisiones oportunas para mejorar el estado y productividad de la plantación. Esta aplicación está enfocada principalmente en el monitoreo agrícola y la gestión de información, permitiendo que los agricultores lleven un control organizado de sus cultivos y puedan intervenir rápidamente ante posibles problemas relacionados con la fertilización, riego, temperatura, enfermedades, productividad o condiciones inadecuadas para el desarrollo del banano.


## Planteamiento del problema

En muchos cultivos agrícolas, especialmente en pequeñas y medianas plantaciones de banano, el seguimiento de las actividades y condiciones del cultivo suele realizarse de forma manual, desorganizada y basada únicamente en la observación y en la experiencia de los agricultores. Lo que genera problemas como:

- Falta de control sobre las etapas del cultivo.
- Dificultad para identificar oportunamente enfermedades o riesgos en la plantación.
- Pérdida de información importante relacionada con riego, fertilización o producción y otras variables de los cultvos.
- Retrasos en la toma de decisiones agrícolas para solucionar problemáticas.

La aplicación busca solucionar estas problemáticas mediante una herramienta móvil que centraliza la información de los cultivos, automatiza alertas, y facilita el monitoreo constante de los lotes de banano.


## Funcionalidades principales

La aplicación cuenta con diferentes módulos orientados a la gestión y monitoreo agrícola como lo son:

### 1. Autenticación de usuarios

Permite a los agricultores registrarse e iniciar sesión de forma segura para acceder a la información de sus cultivos.

### 2. Gestión de lotes

Los usuarios pueden registrar y administrar múltiples lotes agrícolas ingresando información como:

- Nombre del lote
- Cantidad de hectáreas
- Temperatura mínima y máxima del lugar
- Número de plantas
- Etapa actual del cultivo
- Fecha de inicio de la etapa actual

### 3. Registro de información agrícola

La aplicación permite registrar información correspondiente a las diferentes etapas del cultivo:

1. Preparación del suelo
2. Siembra
3. Desarrollo vegetativo
4. Floración
5. Fructificación
6. Cosecha

En cada etapa se almacenan datos específicos relacionados con las actividades agrícolas realizadas como puede ser la cantidad de fertilizante aplicado, frecuencia de riego, número de plantas enfermas o producción obtenida.

### 4. Módulo de reglas agrícolas

La aplicación incorpora un módulo que contiene todas las reglas agrícolas para cada variable de los cultivos y se encarga de ejecutar dichas reglas para evaluar automáticamente el estado de los cultivos.

Dentro de las variables analizadas del cultivo se encuentran:

- Temperatura del lote.
- Número de plantas por hectárea.
- Frecuencia de riego.
- Cantidad de plantas enfermas.
- Tiempo transcurrido en cada etapa del cultivo.
- Producción obtenida durante la cosecha.

### 5. Sistema de alertas

La aplicación genera alertas automáticas basadas en reglas agrícolas previamente definidas. Algunas de las alertas incluyen:

- Recomendaciones de riego periódico.
- Advertencias por temperaturas no adecuadas para el cultivo.
- Alertas por exceso de plantas enfermas.
- Avisos sobre cambios próximos de etapa del cultivo.
- Alertas relacionadas con baja productividad.

Estas alertas permiten al agricultor actuar rápidamente para evitar afectaciones en la plantación.

### 6. Bitácora

El sistema permite a los usuarios almacenar comentarios, notas y fotografías asociadas a cada lote para mantener un historial visual del desarrollo del cultivo o simplemente guardar notas que este considere importantes.

### 7. Dashboard agrícola

La aplicación presenta métricas y graficas generales de los cultivos para que el usuario pueda ver de forma visual un resumen de los datos y el estado de sus cultivos, tales como:

- Cantidad total de lotes.
- Número total de alertas.
- Distribución de los lotes por etapa.
- Estado general de las plantaciones.
- Estimaciones de producción.
- Indicadores de rendimiento agrícola.

<br>
<br>

# Implementación de Clean Architecture

Para implementar una arquitectura limpia en el proyecto se aplicaron los conceptos vistos en clase tomando como referencia la arquitectura propuesta por Robert C. Martin (Clean Architecture). Esta arquitectura organiza el software en capas concéntricas donde la regla fundamental establece que las dependencias solo pueden apuntar hacia adentro: las capas externas pueden conocer a las internas, pero las capas internas nunca deben depender de las externas.

Este principio fue aplicado tanto en el frontend desarrollado con React Native + Expo como en el backend construido con NestJS, organizando cada uno de los módulos de la aplicación en capas bien definidas.


# Implementación en el Backend (NestJS)

El backend sigue la estructura de capas de la siguiente manera:

### Domain

Corresponde a la capa de **Enterprise Business Rules** y es donde residen las entidades del negocio (`entities`), que representan objetos puros del dominio como usuarios, lotes, alertas y bitácoras. También contiene los repositorios que son definidos como clases abstractas o interfaces, encargados de declarar las operaciones que puede realizar cada módulo sin definir su logica de implementación.

### Application

Corresponde a la capa de **Application Business Rules** y contiene los casos de uso (`use cases`), que representan las acciones que puede realizar la aplicación. Cada caso de uso orquesta las reglas del negocio interactuando únicamente con las interfaces definidas en la capa de dominio, sin conocer detalles sobre bases de datos o peticiones HTTP.

### Infrastructure

Corresponde a las capas de **Frameworks & Drivers** e **Interface Adapters**.

Aquí se encuentran:

- Los `controllers`, encargados de recibir las peticiones HTTP y delegar las acciones a los casos de uso.
- Los `DTOs` (Data Transfer Objects), utilizados para validar y adaptar los datos recibidos desde el cliente.
- La capa de `persistence`, encargada de implementar los repositorios definidos en el dominio utilizando Prisma ORM para comunicarse con la base de datos.

Esta capa contiene toda la lógica dependiente de tecnologías externas a la aplicación como es el caso de la comunicación con la base de datos.

### Flujo de datos en el Backend

El flujo de datos del backend sigue la siguiente dirección:

```text
Controller → Use Case → Repository (Domain) → Repository Implementation (Persistence)
```

La respuesta retorna posteriormente por el mismo flujo hasta llegar al cliente.

# Implementación en el Frontend (React Native + Expo)

El frontend replica la misma separación de responsabilidades adaptada al contexto móvil.

### Domain

Esta capa cotiene los modelos del negocio y las interfaces que definen los contratos de los repositorios de datos.

### Application

Contiene los casos de uso del lado del cliente, encargados de orquestar las operaciones que la aplicación puede realizar. Estos interactúan con los repositorios únicamente a través de interfaces definidas en la capa de dominio.

### Infrastructure

Contiene las implementaciones concretas de los repositorios y los servicios externos de la aplicación. Dentro de esta capa se encuentran las llamadas HTTP al backend y la persistencia local de datos, cumpliendo los contratos definidos en el dominio.

### UI

Es la capa más externa y contiene: Las `pages` o pantallas de React Native y los `viewmodels` que son los encargados de actuar como intermediarios entre la lógica de aplicación y las vistas, gestionando el estado de la interfaz y delegando las acciones correspondientes a los casos de uso.

### Flujo de datos en el Frontend

El flujo de datos del frontend sigue la siguiente dirección:

```text
Page (UI) → ViewModel → Use Case → Repository Interface → Repository Implementation (HTTP / Local Storage)
```

La respuesta retorna posteriormente hasta el `ViewModel`, que actualiza el estado observado por la interfaz gráfica.


# Flujo de datos completo (End-to-End)

El flujo completo entre frontend y backend es el siguiente:

1. El usuario interactúa con una pantalla (`Page`) y ejecuta una acción sobre el `ViewModel`.
2. El `ViewModel` invoca un caso de uso del frontend.
3. El caso de uso llama al repositorio a través de su interfaz definida en el dominio.
4. La implementación concreta del repositorio realiza una petición HTTP al backend de NestJS o accede al almacenamiento local.
5. En el backend, el `Controller` recibe la solicitud, valida los datos mediante DTOs y delega la acción al caso de uso correspondiente.
6. El caso de uso del backend aplica las reglas del negocio e invoca el repositorio de persistencia.
7. El repositorio se comunica con la base de datos utilizando Prisma ORM.
8. La respuesta retorna por las capas del backend hasta llegar al cliente.
9. El repositorio del frontend recibe la respuesta y la retorna al caso de uso.
10. El caso de uso retorna el resultado al `ViewModel`.
11. El `ViewModel` actualiza el estado de la interfaz y la pantalla (`Page`) se renderiza nuevamente mostrando los cambios.