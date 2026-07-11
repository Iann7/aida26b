

CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    name text NOT NULL,
    description text,

    min_lat numeric NOT NULL,
    max_lat numeric NOT NULL,
    min_lon numeric NOT NULL,
    max_lon numeric NOT NULL,

    created_at timestamptz NOT NULL DEFAULT now()
);

----------------------------------------------------
-- NOTES
----------------------------------------------------
CREATE TABLE IF NOT EXISTS notes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    vessel_mmsi text NOT NULL
        REFERENCES vessels(mmsi)
        ON DELETE CASCADE,  

    title text NOT NULL,

    category text NOT NULL,

    content text NOT NULL,
    
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_regions_bbox
ON regions(min_lat, max_lat, min_lon, max_lon);

----------------------------------------------------
-- PACKETS
----------------------------------------------------
CREATE TABLE IF NOT EXISTS packets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    vessel_mmsi text NOT NULL
        REFERENCES vessels(mmsi)
        ON DELETE CASCADE,

    packet_code text UNIQUE,

    packet_type text NOT NULL,

    weight_kg numeric,

    company text,

    source text,

    received_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_packets_vessel
ON packets(vessel_mmsi);

CREATE INDEX IF NOT EXISTS idx_packets_received
ON packets(received_at);

----------------------------------------------------
-- POSITIONS
----------------------------------------------------
CREATE TABLE IF NOT EXISTS positions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    vessel_mmsi text NOT NULL
        REFERENCES vessels(mmsi)
        ON DELETE CASCADE,

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

    notes text,

    added_at timestamptz NOT NULL DEFAULT now()
);

----------------------------------------------------
-- CREW MEMBERS
----------------------------------------------------
CREATE TABLE IF NOT EXISTS crew_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    vessel_mmsi text NOT NULL
        REFERENCES vessels(mmsi)
        ON DELETE CASCADE,

    first_name text NOT NULL,

    last_name text NOT NULL,

    rank text,

    age integer,

    nationality text,

    status text DEFAULT 'On Board',

    embarked_at date
);

CREATE INDEX IF NOT EXISTS idx_crew_vessel
ON crew_members(vessel_mmsi);

CREATE INDEX IF NOT EXISTS idx_crew_last_name
ON crew_members(last_name);