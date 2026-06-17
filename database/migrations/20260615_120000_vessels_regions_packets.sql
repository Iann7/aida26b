-- Migration: 20260615_120000_vessels_regions_packets.sql
-- Crea tablas para: barcos (vessels), regiones de interés (regions) y paquetes/envíos (packets)

-- Habilita extensión para generar UUIDs (pgcrypto es más moderno en muchas instalaciones)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

BEGIN;

-- Tabla: vessels (barcos)
CREATE TABLE IF NOT EXISTS vessels (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    mmsi bigint UNIQUE,
    name text,
    vessel_type text,
    call_sign text,
    imo integer,
    flag_country text,
    length_m numeric,
    width_m numeric,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Tabla: regions (regiones de interés en el mapa)
-- Usamos bbox (min/max lat/lon) para evitar dependencia a PostGIS.
CREATE TABLE IF NOT EXISTS regions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    min_lat numeric NOT NULL,
    max_lat numeric NOT NULL,
    min_lon numeric NOT NULL,
    max_lon numeric NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Tabla: packets (paquetes/distintas transmisiones enviadas por barco)
-- Guardamos payload crudo en JSONB y campos normalizados para consultas espaciales/temporales.
CREATE TABLE IF NOT EXISTS packets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vessel_id uuid REFERENCES vessels(id) ON DELETE CASCADE,
    packet_type text,
    sequence_number bigint,
    received_at timestamptz NOT NULL DEFAULT now(),
    source text,
    payload jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_packets_vessel_id ON packets(vessel_id);
CREATE INDEX IF NOT EXISTS idx_packets_received_at ON packets(received_at);
CREATE INDEX IF NOT EXISTS idx_regions_bbox ON regions(min_lat, max_lat, min_lon, max_lon);

-- Tabla: positions (posiciones normalizadas por barco)
CREATE TABLE IF NOT EXISTS positions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vessel_id uuid REFERENCES vessels(id) ON DELETE CASCADE,
    latitude numeric NOT NULL,
    longitude numeric NOT NULL,
    speed_knots numeric,
    heading numeric,
    recorded_at timestamptz NOT NULL DEFAULT now(),
    source text,
    packet_id uuid REFERENCES packets(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_positions_vessel_id ON positions(vessel_id);
CREATE INDEX IF NOT EXISTS idx_positions_recorded_at ON positions(recorded_at);

COMMIT;

-- Notas:
-- - `payload` permite almacenar el paquete AIS/telemetría completo en JSONB.
-- - Si se desea soporte geográfico avanzado (geometrías, búsquedas espaciales),
--   considerar instalar y usar PostGIS y cambiar `regions` para almacenar polígonos.
