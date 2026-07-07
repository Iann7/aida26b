-- Seed data
SET client_encoding = 'UTF8';

----------------------------------------------------
-- CLEAN
----------------------------------------------------

TRUNCATE TABLE
    notes,
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
    age,
    nationality,
    status,
    embarked_at
)
VALUES
(
    '205128000',
    'Pedro',
    'López',
    'captain',
    54,
    'Argentina',
    'On Board',
    '2026-07-01'
),
(
    '205128000',
    'Ana',
    'Martínez',
    'chief_officer',
    41,
    'Argentina',
    'On Board',
    '2026-07-02'
),
(
    '205128000',
    'Luis',
    'Ramírez',
    'second_officer',
    46,
    'Uruguay',
    'On Board',
    '2026-07-03'
),
(
    '701000001',
    'María',
    'Suárez',
    'second_officer',
    35,
    'Chile',
    'Off Board',
    '2026-07-04'
);

----------------------------------------------------
-- NOTES
----------------------------------------------------

INSERT INTO notes (
    vessel_mmsi,
    title,
    category,
    content
)
VALUES
(
    '205128000',
    'Radar revisado',
    'maintenance',
    'Se realizó mantenimiento preventivo del radar principal.'
),
(
    '205128000',
    'Inspección anual',
    'inspection',
    'La inspección anual fue completada sin observaciones.'
),
(
    '701000001',
    'Condiciones climáticas',
    'weather',
    'Se esperan fuertes vientos en la próxima navegación.'
);

----------------------------------------------------
-- PACKETS
----------------------------------------------------

INSERT INTO packets (
    vessel_mmsi,
    packet_code,
    packet_type,
    weight_kg,
    company,
    source,
    received_at
)
VALUES
(
    '205128000',
    'PKT-1001',
    'Container',
    4200,
    'Maersk Logistics',
    'Buenos Aires',
    '2026-07-04T10:00:00Z'
),
(
    '205128000',
    'PKT-1002',
    'Medical',
    350,
    'Mercy Cargo',
    'Montevideo',
    '2026-07-04T10:05:00Z'
),
(
    '701000001',
    'PKT-2001',
    'Scientific',
    180,
    'National Research Institute',
    'Ushuaia',
    '2026-07-04T10:10:00Z'
);

----------------------------------------------------
-- INTERESTING VESSELS
----------------------------------------------------

INSERT INTO interesting_vessels (
    vessel_mmsi,
    color,
    priority,
    notes
)
VALUES
(
    '205128000',
    '#ff4444',
    1,
    'Barco monitoreado diariamente.'
),
(
    '701000001',
    '#44aa44',
    2,
    'Barco de investigación.'
);

----------------------------------------------------
-- POSITIONS
----------------------------------------------------

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