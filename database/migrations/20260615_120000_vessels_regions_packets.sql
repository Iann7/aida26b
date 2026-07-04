-- Migration: 20260615_120000_vessels_regions_packets.sql

----------------------------------------------------
-- VESSELS
----------------------------------------------------
CREATE TABLE IF NOT EXISTS vessels (
    mmsi text PRIMARY KEY,
    name text,
    vessel_type text,
    flag_country text,
    length_m numeric,
    width_m numeric,
    created_at timestamptz NOT NULL DEFAULT now()
);

----------------------------------------------------
-- REGIONS
----------------------------------------------------
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

CREATE INDEX IF NOT EXISTS idx_regions_bbox
ON regions(min_lat, max_lat, min_lon, max_lon);

----------------------------------------------------
-- PACKETS (mensaje AIS recibido)
----------------------------------------------------
CREATE TABLE IF NOT EXISTS packets (
    id text PRIMARY KEY,
    vessel_mmsi text REFERENCES vessels(mmsi) ON DELETE CASCADE,
    packet_type text NOT NULL,
    source text,
    received_at timestamptz NOT NULL DEFAULT now(),
    raw_payload jsonb NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_packets_vessel
ON packets(vessel_mmsi);

CREATE INDEX IF NOT EXISTS idx_packets_received
ON packets(received_at);

----------------------------------------------------
-- POSITIONS
----------------------------------------------------
CREATE TABLE IF NOT EXISTS positions (
    id text PRIMARY KEY,
    vessel_mmsi text REFERENCES vessels(mmsi) ON DELETE CASCADE,

    packet_id text REFERENCES packets(id) ON DELETE SET NULL,

    latitude numeric NOT NULL,
    longitude numeric NOT NULL,

    speed_knots numeric,
    heading numeric,

    recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_positions_vessel_mmsi
ON positions(vessel_mmsi);

CREATE INDEX IF NOT EXISTS idx_positions_recorded_at
ON positions(recorded_at);

----------------------------------------------------
-- INTERESTING VESSELS
----------------------------------------------------
CREATE TABLE IF NOT EXISTS interesting_vessels (
    vessel_mmsi text PRIMARY KEY
        REFERENCES vessels(mmsi)
        ON DELETE CASCADE,

    color varchar(7) NOT NULL DEFAULT '#1976D2',

    priority integer NOT NULL DEFAULT 1,

    visible_on_map boolean NOT NULL DEFAULT true,

    notes text,

    added_at timestamptz NOT NULL DEFAULT now()
);

----------------------------------------------------
-- CREW MEMBERS
----------------------------------------------------
CREATE TABLE IF NOT EXISTS crew_members (
    id text PRIMARY KEY,

    vessel_mmsi text NOT NULL
        REFERENCES vessels(mmsi)
        ON DELETE CASCADE,

    first_name text NOT NULL,

    last_name text NOT NULL,

    rank text,

    nationality text,

    embarked_at date,

    disembarked_at date
);

CREATE INDEX IF NOT EXISTS idx_crew_vessel
ON crew_members(vessel_mmsi);

CREATE INDEX IF NOT EXISTS idx_crew_last_name
ON crew_members(last_name);