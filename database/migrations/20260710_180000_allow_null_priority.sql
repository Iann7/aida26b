-- Permitir NULL en priority de interesting_vessels
ALTER TABLE interesting_vessels ALTER COLUMN priority DROP NOT NULL;
