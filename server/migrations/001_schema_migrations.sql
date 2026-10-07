-- ==============================================================================
-- DRG App Schema Migration #001: Schema Migrations Tracking Table
-- SOP v4.0 Compliance: Server-Authoritative Version Tracking
-- ==============================================================================

CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    batch INTEGER NOT NULL DEFAULT 1,
    execution_time_ms INTEGER NOT NULL DEFAULT 0,
    checksum VARCHAR(64) NOT NULL,
    applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(32) NOT NULL DEFAULT 'applied'
);

CREATE INDEX IF NOT EXISTS idx_schema_migrations_batch ON schema_migrations(batch);
