# Informe

## Lógica de Negocio
Con el objetivo de expandir las capacidades del esquema preexistente, se diseñó e implementó un nuevo módulo de lógica de negocio orientado al monitoreo y posicionamiento geográfico de embarcaciones en las costas de Argentina y Chile.

El propósito principal de esta extensión es optimizar la administración de la flota mediante las siguientes implementaciones:

### Mapa Interactivo

Representación gráfica e interactiva basada en un mapa para mejorar la geolocalización y el seguimiento en tiempo real de los barcos. El componente cuenta con interacción hover (al posicionar el cursor sobre un barco se despliega una ventana de información sintética) y eventos de click, los cuales renderizan un panel lateral detallado con los tripulantes, paquetes y notas asociadas a la embarcación seleccionada.

![Alt Text](/Informe/Images/mapa.png)

### Módulo de Tripulantes
Sección dedicada a la gestión del personal a bordo. Permite listar, registrar y administrar información crítica como el nombre, la nacionalidad y el rango jerárquico dentro de cada embarcación.

![Alt Text](/Informe/Images/tripulacion.png)

### Definición de Regiones

Herramienta para delimitar áreas geográficas de interés (zonas de pesca, rutas comerciales o sectores de control), facilitando su identificación visual sobre el mapa. Para optimizar la navegación, al seleccionar una fila específica dentro de la tabla de regiones, el mapa realizará un enfoque dinámico (pan & zoom) hacia el sector correspondiente.

![Alt Text](/Informe/Images/regiones.png)

### Bitácora de Notas: 
Sistema de anotaciones históricas por embarcación que funciona como un registro de eventos, novedades o incidencias, permitiendo mantener un seguimiento (trackeo) detallado de la actividad operativa y del historial del barco.

![Alt Text](/Informe/Images/notas.png)

### Barcos de Interés: 
Funcionalidad de marcadores personalizados que permite destacar embarcaciones específicas en el mapa mediante una diferenciación cromática (colores distintivos), agilizando su supervisión. Al interactuar con la fila correspondiente a un barco de interés, este se desplegará de forma focalizada en el mapa.

![Alt Text](/Informe/Images/barcos-interes.png)

- Módulo de Paquetes: Sección orientada a la administración y el control de la carga o encomiendas transportadas por cada embarcación. Permite asociar los manifiestos de carga a sus respectivos barcos, facilitando la trazabilidad de los bienes en tránsito junto con el resto de la información operativa del navío.

![Alt Text](/Informe/Images/paquetes.png)


## Cambios en el Sistema
Para cumplir con los requerimientos planteados, se realizaron modificaciones estructurales tanto en el núcleo de datos como en la interfaz de usuario:

### Modificaciones en el Modelo de Datos (structure.ts)

Se intervino el archivo de configuración estructural structure.ts para reflejar las nuevas entidades del dominio en el esquema de tablas del sistema:
#### Tabla vessels: 
Diseñada para identificar y almacenar los atributos de los barcos. Cabe destacar que esta entidad no posee una sección de visualización directa en el frontend, sino que actúa como un repositorio para los datos recopilados de forma automatizada por el scraper de embarcaciones.
#### Tabla posicion: 
misma nocion que para la tabla de embarcaciones, almacena el historial y las últimas coordenadas geográficas obtenidas de manera asincrónica a través del scraper.
#### Tablas de negocio complementarias: 
Se incorporaron las estructuras relacionales correspondientes a regiones, tripulantes, notas, paquetes y barcos_interes.

### Extensiones en la configuración de structure.ts:

#### Comportamiento dinámico de filas: 
Con el fin de añadir funciones interactivas para las filas de ciertas tablas (como barcos_interes o regiones), se agregó un atributo booleano a su configuración en structure.ts. Este campo determina si las filas poseen o no un comportamiento asociado. Posteriormente, en el archivo app.ts, se definen los handlers específicos para la lógica de aquellos componentes que activen esta opción, garantizando un acoplamiento transparente y desacoplado.

#### Atributo de visibilidad condicional: 
Se incorporó la propiedad visible dentro de la definición de los campos. Esto permite ocultar columnas específicas en la interfaz de usuario (frontend) sin restringir su disponibilidad en las capas internas del sistema. Esta propiedad impacta directamente en la definición de las peticiones HTTP POST, permitiendo omitir o filtrar dichos campos automáticamente al momento de generar nuevos elementos en el backend.

#### Impacto en el Kernel: 
Debido a la arquitectura dirigida por datos (data-driven architecture) del kernel de la aplicación, la actualización del archivo structure.ts automatizó por completo la generación de los endpoints de la API (operaciones CRUD), la renderización dinámica de las tablas en la interfaz y la creación de los filtros avanzados basados en las nuevas columnas. Esto optimizó los tiempos de desarrollo, concentrando el esfuerzo en la modelación estructural.

## Incorporación del Mapa y Navegación
Para integrar el mapa interactivo en la experiencia de usuario, se extendió el menú principal del sistema. Se reutilizó la lógica de los componentes de navegación existentes —los cuales gestionaban previamente el cambio de tema estético y la selección de idioma—, logrando una incorporación limpia, modular y coherente con el diseño general de la aplicación.

Bajo este enfoque, se agregó un nuevo handler en el ciclo de renderizado de la barra de navegación que inyecta el componente cartográfico, permitiendo su despliegue fluido y la comunicación con el resto de los módulos de la aplicación.

## Base de Datos y Migraciones
Para la incorporación de las nuevas tablas al motor de base de datos, se modificaron los archivos de migraciones, garantizando un control de versiones centralizado y un gestor capaz de construir de manera secuencial la totalidad del esquema.

A estas migraciones se les añadieron los esquemas de datos requeridos, así como también un conjunto de sentencias INSERT con datos semilla (seeders) que proveen información útil de prueba (barcos y notas ficticias) para facilitar las sesiones de testeo y validación visual de la interfaz.

Finalmente, cabe aclarar que el esquema de autenticación y seguridad no sufrió modificaciones, manteniéndose intacto según el diseño original de la arquitectura del sistema

##  Instrucciones de Arranque y Despliegue
Para la puesta en marcha del sistema y la verificación de las nuevas funcionalidades, se disponen de dos metodologías de despliegue:

- Despliegue Unificado mediante Docker Compose: el archivo de configuración de docker-compose fue extendido con el objetivo de automatizar el aprovisionamiento del scraper en conjunto con el resto de la aplicación. Para su correcto funcionamiento, se deben suministrar las siguientes variables de entorno en el archivo de configuración:
    - API Key: Credencial requerida para autenticar las peticiones del scraper ante el proveedor del servicio de posicionamiento marítimo.
    - Configuración de Base de Datos: Parámetros de conexión (HOST, PORT, USER, PASSWORD) para que el scraper pueda persistir los datos de manera directa.

- Despliegue Modular e Independiente: En caso de requerir la ejecución de los módulos de forma aislada, la sección del scraper cuenta con su propio directorio dedicado. Dentro de este, se incluye un conjunto de instrucciones específicas y scripts para inicializar el servicio de recolección de datos de manera independiente al contenedor principal.

- Modo de Prueba (Datos Semilla): Si no se desea configurar el scraper ni dependencias externas durante la evaluación, el sistema está preparado para funcionar de forma autónoma. Gracias a las migraciones mencionadas en la sección anterior, la base de datos incorpora datos semilla (seeders) con dos embarcaciones preconfiguradas. Esto permite validar de inmediato el comportamiento del mapa interactivo, así como la visualización y gestión de sus respectivas bitácoras de notas y listados de tripulación.

## Recolección de datos 
Para simular el flujo maritimo en nuestra logica de negocios decidimos utilizar una API gratuita llamada [aistream.io](https://aisstream.io/) la cual ofrece varios tipos de reportes a los que podiamos escuchar. Decidimos quedarnos con positionReport y staticReport (dos de los mensajes que se proveen) position report indica la velocidad y posicion actual del barco mientras que static report indica (en una ventana menos frecuente) las dimensiones del barco y su destino.

### ¿Que es AIS?
AIS (*Automatic Identification System*) es un sistema transmisión que informa la identificacion unica del barco,posición,curso y velocidad. Segun las reglas de la **Organizacion Internacional Maritima**, todo barco debe contar con un AIS a bordo.

### ¿Donde se transmite esta información?
El sistema AIS opera en freecuencias VHF, para poder accederlas se necesitan dispositivos satelitales o costeros que puedan escuchar esta frecuencia. AISStream escucha esta información y la hace publica a traves de su API  

### Llave de la API key 
para correr nuestro el codigo de recoleccion de datos se necesita una llave API provista por [aistream.io](https://aisstream.io/). Esta llave será provista como variable dentro de la parte de secrets/variables del respositorio.