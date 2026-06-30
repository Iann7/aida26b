-- Migration: 20260615_120000_vessels_regions_packets.sql
-- Crea tablas para: barcos (vessels), regiones de interés (regions) y paquetes/envíos (packets)
-- Tabla: vessels (barcos)
CREATE TABLE IF NOT EXISTS vessels (
    mmsi text PRIMARY KEY,
    name text,
    vessel_type text,
    flag_country text,
    length_m numeric,
    width_m numeric,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Tabla: regions (regiones de interés en el mapa)
-- Usamos bbox (min/max lat/lon) para evitar dependencia a PostGIS.
CREATE TABLE IF NOT EXISTS regions (
    id text PRIMARY KEY,
    name text NOT NULL,
    description text,
    min_lat numeric NOT NULL,
    max_lat numeric NOT NULL,
    min_lon numeric NOT NULL,
    max_lon numeric NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_regions_bbox ON regions(min_lat, max_lat, min_lon, max_lon);

-- Tabla: positions (posiciones normalizadas por barco)
CREATE TABLE IF NOT EXISTS positions (
    id text PRIMARY KEY,
    vessel_mmsi text REFERENCES vessels(mmsi) ON DELETE CASCADE,
    latitude numeric NOT NULL,
    longitude numeric NOT NULL,
    recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_positions_vessel_mmsi ON positions(vessel_mmsi);
CREATE INDEX IF NOT EXISTS idx_positions_recorded_at ON positions(recorded_at);