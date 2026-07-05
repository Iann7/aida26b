-- Seed data
-- Ejecutar una única vez en desarrollo

SET client_encoding = 'UTF8';

----------------------------------------------------
-- Limpiar datos existentes
----------------------------------------------------

TRUNCATE TABLE
    crew_members,
    interesting_vessels,
    positions,
    packets,
    vessels,
    regions
CASCADE;

----------------------------------------------------
-- VESSELS
----------------------------------------------------

-- NOTES: Estos barcos son semillas (dummy) para pruebas de la UI y del mapa.
--  - '205128000' (Atlantic Explorer): barco principal usado en tests de tabla/panel.
--  - '701000001' (Patagonia Surveyor): barco secundario para verificaciones de zoom/tooltip.
-- Asegúrese de que la app use estos MMSI para localizar marcadores en el mapa durante pruebas.


INSERT INTO vessels (
    mmsi,
    name,
    vessel_type,
    flag_country,
    length_m,
    width_m
)
VALUES
(
    '205128000',
    'Atlantic Explorer',
    'Cargo',
    'Belgium',
    210,
    32
),
(
    '701000001',
    'Patagonia Surveyor',
    'Research',
    'Argentina',
    95,
    18
);
 
----------------------------------------------------
-- CREW MEMBERS
----------------------------------------------------

INSERT INTO crew_members (
    vessel_mmsi,
    first_name,
    last_name,
    rank,
    nationality,
    embarked_at
)
VALUES
(
    '205128000',
    'Pedro',
    'López',
    'Captain',
    'Argentina',
    '2026-07-01'
),
(
    '205128000',
    'Ana',
    'Martínez',
    'Chief Officer',
    'Argentina',
    '2026-07-02'
),
(
    '205128000',
    'Luis',
    'Ramírez',
    'Chief Engineer',


    'Uruguay',
    '2026-07-03'
),
(
    '205128000',
    'María',
    'Suárez',
    'Deck Officer',
    'Chile',
    '2026-07-04'
);

----------------------------------------------------
-- PACKETS
----------------------------------------------------

INSERT INTO packets (
    vessel_mmsi,
    packet_type,
    source,
    received_at
)
VALUES
(
    '205128000',
    'PositionReport',
    'AISStream',
    '2026-07-04T10:00:00Z'
),
(
    '205128000',
    'PositionReport',
    'AISStream',
    '2026-07-04T10:05:00Z'
),
(
    '205128000',
    'StaticData',
    'AISStream',
    '2026-07-04T10:10:00Z'
);

----------------------------------------------------
-- POSITIONS
----------------------------------------------------

----------------------------------------------------
-- INTERESTING_VESSELS (markers)
-- Notes: these entries create map markers with explicit colors
-- so the frontend can be tested for color/highlight/visibility behavior.
-- The `vessel_mmsi` must match one of the seeded `vessels` above.
-- Colors are hex strings and `visible_on_map` controls whether they appear.

INSERT INTO interesting_vessels (
    vessel_mmsi,
    color,
    priority,
    notes,
    added_at
)
VALUES
(
    '205128000',
    '#ff4444', -- rojo para pruebas (debe resaltar en la UI)
    1,
    'Marker rojo de prueba para Atlantic Explorer',
    now()
),
(
    '701000001',
    '#44ff44', -- verde para pruebas
    2,
    'Marker verde de prueba para Patagonia Surveyor',
    now()
);


INSERT INTO positions (
    vessel_mmsi,
    latitude,
    longitude,
    speed_knots,
    heading,
    recorded_at
)
VALUES
(
    '205128000',
    -34.5900,
    -58.3800,
    12.5,
    75,
    '2026-07-04T10:00:00Z'
),
(
    '205128000',
    -34.5850,
    -58.3650,
    12.8,
    78,
    '2026-07-04T10:05:00Z'
),
(
    '205128000',
    -34.5800,
    -58.3500,
    13.1,
    80,
    '2026-07-04T10:10:00Z'
),
(
    '701000001',
    -45.8700,
    -67.5000,
    9.2,
    210,
    '2026-07-04T10:08:00Z'
);

----------------------------------------------------
-- REGIONS
----------------------------------------------------

INSERT INTO regions (
    name,
    description,
    min_lat,
    max_lat,
    min_lon,
    max_lon
)
VALUES
(
    'Costa Argentina',
    'Zona costera del Atlántico Argentino',
    -55.0,
    -34.0,
    -68.0,
    -53.0
),
(
    'Costa de Chile',
    'Zona costera del Pacífico Chileno',
    -56.0,
    -17.0,
    -76.0,
    -66.0
),
(
    'Río de la Plata',
    'Área de monitoreo del Río de la Plata',
    -35.2,
    -33.4,
    -59.8,
    -56.2
);