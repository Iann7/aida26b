# Sistema de Gestión de Barcos y Monitoreo AIS

Este proyecto implementa un sistema de gestión y monitoreo de embarcaciones orientado al seguimiento geográfico, la administración operativa y la trazabilidad de paquetes AIS. El sistema permite gestionar barcos de interés por MMSI, administrar tripulación embarcada, controlar paquetes AIS, definir regiones de operación y registrar notas operativas asociadas a cada embarcación.

## Características

- **Monitoreo de Barcos de Interés**: CRUD para `interesting_vessels` con seguimiento por `vessel_mmsi`, prioridad, color y notas.
- **Gestión de Tripulación**: CRUD para `crew_members`, con nombre, apellido, cargo, nacionalidad, estado de embarque y fechas de embarque/desembarque.
- **Control de Paquetes AIS**: CRUD para `packets`, asociando paquetes a embarcaciones y registrando tipo, peso, origen y fecha de recepción.
- **Definición de Regiones**: CRUD para `regions` con delimitaciones geográficas y zoom dinámico en el mapa.
- **Bitácora de Notas**: CRUD para `notes` por embarcación, para eventos, incidencias y seguimiento operativo.
- **Mapa Interactivo**: visualización geográfica con hover y clic para desplegar detalles de embarcaciones, tripulación y notas.
- **API REST genérica**: Endpoints CRUD dinámicos generados a partir del modelo en `shared/src/ssot/structure.ts`.
- **Backend y frontend desacoplados**: Node.js/TypeScript en backend y frontend en Vanilla TypeScript + HTML/CSS.
- **Base de datos SQL**: PostgreSQL con migraciones versionadas y datos seed para prueba.

## Tecnologías Utilizadas

- **Backend**: Node.js, TypeScript, Express.js
- **Frontend**: Vanilla TypeScript, HTML5, CSS3
- **Base de Datos**: PostgreSQL
- **ORM**: SQL directo con pg library

## Estructura del Proyecto

```
/
├── backend/           # API REST
│   ├── src/
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/          # Interfaz web
│   ├── src/
│   │   └── app.ts
│   ├── index.html
│   ├── package.json
│   └── tsconfig.json
├── database/
│   ├── bootstrap.sql       # Crea roles y base de datos (corre una vez)
│   └── migrations/         # Migraciones SQL versionadas
└── README.md
```

## Instalación y Configuración

### Prerrequisitos

- Node.js (versión 16 o superior)
- PostgreSQL (versión 12 o superior)
- npm o yarn

### Base de Datos

1. Setup inicial (una vez por entorno, como superusuario de Postgres):

   ```
   psql -U postgres -f database/bootstrap.sql
   ```

   Esto crea los roles `aida26_owner` / `aida26_user` y la base `faculty_management`.
2. Aplicar migraciones (desde `backend/`):

   ```
   npm run migrate
   ```

   Esto crea/actualiza las tablas según los archivos en `database/migrations/`.

   Las migraciones son **forward-only** y nombradas con timestamp
   (ej. `20260520_120000_initial_schema.sql`). Para cambiar el schema,
   se agrega una migración nueva — nunca se editan las ya aplicadas.

   **Para deshacer un cambio:** no se edita la migración original — se escribe
   una migración nueva que aplique el revert. Ej: si
   `20260601_120000_add_column.sql` hizo `ALTER TABLE interesting_vessels ADD COLUMN phone`,
   para sacarla escribimos `20260602_090000_remove_column.sql` con
   `ALTER TABLE interesting_vessels DROP COLUMN phone`. Las migraciones aplicadas son
   inmutables — modificarlas rompe la verificación de checksum.

### Backend

1. Navegar al directorio `backend`
2. Instalar dependencias: `npm install`
3. Configurar variables de entorno en `.env`:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=faculty_management
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   PORT=3000
   ```
4. Compilar solo backend: `npm run build`
5. Ejecutar: `npm start` (servirá en http://localhost:3000 y también servirá `frontend/dist`)

### Frontend

1. Navegar al directorio `frontend`
2. Instalar dependencias: `npm install`
3. Compilar assets de producción: `npm run build`
4. Ejecutar el servidor de desarrollo con proxy API: `npm run dev` (servirá en http://localhost:8080)

### Comandos desde la raíz

1. Instalar frontend y backend: `npm run install:all`
2. Compilar frontend y backend: `npm run build`
3. Ejecutar backend compilado: `npm start`
4. Ejecutar backend en desarrollo: `npm run dev:backend`
5. Ejecutar frontend en desarrollo: `npm run dev:frontend`
6. Ejecutar tests unitarios frontend+backend: `npm test`
7. Ejecutar tests de integración con base de datos: `npm run test:db`
8. Ejecutar tests E2E Playwright: `npm run test:e2e`

## Uso

1. Ejecutar el backend: `npm start` en la raíz o en el directorio backend (servirá en http://localhost:3000)
2. Abrir el navegador en http://localhost:3000
3. Navegar entre las secciones de Barcos de Interés, Tripulación, Paquetes, Regiones y Notas
4. Usar los botones "Agregar" para crear nuevos registros
5. Usar los botones "Editar" y "Eliminar" en cada fila de las grillas
6. Acceder al mapa interactivo para ubicar embarcaciones y regiones en tiempo real

## API Endpoints

### Endpoints CRUD genéricos por tabla

La API expone operaciones CRUD dinámicas sobre las tablas definidas en `shared/src/ssot/structure.ts` y en el esquema de datos.

- `GET /api/:tableName` - Listar registros de una tabla
- `POST /api/:tableName` - Crear un nuevo registro en una tabla
- `PUT /api/:tableName` - Actualizar un registro existente en una tabla
- `DELETE /api/:tableName` - Eliminar un registro de una tabla

Tablas principales del modelo actual:

- `interesting_vessels` - Barcos de interés con MMSI, color, prioridad, notas y fecha de alta.
- `crew_members` - Tripulación asignada a embarcaciones.
- `packets` - Paquetes AIS asociados a barcos.
- `regions` - Regiones geográficas delimitadas.
- `notes` - Notas operativas por embarcación.
- `vessels` - Datos de embarcaciones recolectados desde el scraper AIS.
- `positions` - Historial de posiciones y coordenadas de embarcaciones.

### Endpoints especializados

- `GET /api/positions/latest` - Obtener la última posición reportada de cada barco con datos de la embarcación.
- `GET /api/vessels/:id/details` - Obtener detalles de una embarcación específica junto con su tripulación, paquetes y notas.

### Autenticación y seguridad

El backend también incluye endpoints de autenticación para login y gestión de sesión:

- `POST /api/auth/login` - Iniciar sesión.
- `POST /api/auth/logout` - Cerrar sesión.
- `GET /api/auth/me` - Obtener usuario autenticado.
- `POST /api/auth/change-password` - Cambiar contraseña del usuario autenticado.

## Testing de Paginación (Frontend + TypeScript)

La paginación del frontend usa el parámetro `page` y el backend pagina con un `limit` fijo de **20** registros por página.
El UI muestra el estado como: `Página X de Y (Total: N)` y ofrece botones `Anterior` / `Siguiente`.

### Prerrequisitos

- Backend y base de datos corriendo (la suite crea y borra registros de las tablas del modelo vía API)
- Frontend servido en el mismo host/puerto que el backend (por defecto `http://localhost:3000`)
- Node.js 18+

### Ejecutar los tests

1. Instalar dependencias del frontend:
   - `cd frontend`
   - `npm install`
   - `npx playwright install`
2. (Opcional) Configurar URL base (por defecto `http://localhost:3000`):
   - `set E2E_BASE_URL=http://localhost:3000`
3. Ejecutar (desde `frontend/`):
   - `npm run test:e2e`

Por defecto corre en modo headless. Para ver el navegador:

- `set E2E_HEADLESS=0`

### Casos cubiertos

- Contenido menor a una página (ej: 5 items → 1/1)
- Contenido exactamente una página (20 items → 1/1)
- Contenido mayor a una página (21 items → 1/2, navegación prev/next)
- Muchas páginas (85 items → 1/5 ... 5/5)

## Contribución

Este proyecto es parte del sistema académico de la Facultad de Ciencias Exactas. Para contribuciones, por favor contactar al equipo de desarrollo.

## Licencia

Este proyecto es propiedad de la Universidad de Buenos Aires - Facultad de Ciencias Exactas.

## Mas informacion

Leer la seccion de informe para analizar que cambios se aplicaron sobre la version orginal