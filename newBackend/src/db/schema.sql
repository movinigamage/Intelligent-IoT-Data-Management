-- ============================================================
--  Database Schema for Time-Series Backend
--  Tables: datasets, timeseries_long
--  Author: Farris (Backend Lead)
-- ============================================================

-- Drop tables if they exist (optional for development)
DROP TABLE IF EXISTS timeseries_long;
DROP TABLE IF EXISTS datasets;

-- ============================================================
--  DATASETS TABLE
--  Stores dataset metadata (one row per dataset)
-- ============================================================

CREATE TABLE datasets (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

-- ============================================================
--  TIMESERIES_LONG TABLE
--  Stores long-format time-series data
--  One row per (dataset, entity, metric, timestamp)
-- ============================================================

CREATE TABLE timeseries_long (
    id SERIAL PRIMARY KEY,

    dataset_id INTEGER NOT NULL REFERENCES datasets(id)
        ON DELETE CASCADE,

    entity TEXT,
    metric TEXT NOT NULL,
    ts TIMESTAMP NOT NULL,
    value DOUBLE PRECISION,
    quality_flag TEXT
);

-- ============================================================
--  INDEXES (recommended for performance)
-- ============================================================

-- Fast lookup by dataset + metric
CREATE INDEX idx_timeseries_dataset_metric
    ON timeseries_long (dataset_id, metric);

-- Fast lookup by timestamp
CREATE INDEX idx_timeseries_ts
    ON timeseries_long (ts);

-- Fast lookup by entity
CREATE INDEX idx_timeseries_entity
    ON timeseries_long (entity);
