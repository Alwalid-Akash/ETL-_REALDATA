-- =============================================
-- Unfallatlas Accidents Table Schema
-- Production-ready with primary key and indexes
-- =============================================

-- Drop table if you want a clean slate (comment out if data must be preserved)
-- DROP TABLE IF EXISTS accidents CASCADE;

-- Create accidents table with proper constraints
CREATE TABLE IF NOT EXISTS accidents (
    accident_id      VARCHAR(50) PRIMARY KEY,   -- Unique accident identifier (OID_ from CSV)
    year             INT,                       -- UJAHR
    month            INT,                       -- UMONAT (1-12)
    hour             INT,                       -- USTUNDE (0-23)
    weekday          INT,                       -- UWOCHENTAG (1=Monday ... 7=Sunday)
    category         INT,                       -- UKATEGORIE (accident severity)
    type             INT,                       -- UART (accident type)
    light_condition  INT,                       -- ULICHTVERH (daylight, darkness, etc.)
    participants     INT,                       -- ANZ_PERSON (number of persons involved)
    longitude        DECIMAL(10,7),             -- XGCS (Gauss-Krüger coordinate)
    latitude         DECIMAL(10,7),             -- YGCS
    region_id        VARCHAR(20),               -- UKREIS (district code)
    updated_at       TIMESTAMP DEFAULT NOW()    -- Last update timestamp
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_accidents_year ON accidents(year);
CREATE INDEX IF NOT EXISTS idx_accidents_month ON accidents(month);
CREATE INDEX IF NOT EXISTS idx_accidents_category ON accidents(category);
CREATE INDEX IF NOT EXISTS idx_accidents_region ON accidents(region_id);
CREATE INDEX IF NOT EXISTS idx_accidents_location ON accidents(longitude, latitude);

-- Optional: Composite index for time‑based analyses
CREATE INDEX IF NOT EXISTS idx_accidents_year_month ON accidents(year, month);

-- Optional: Comment on table and columns (documentation)
COMMENT ON TABLE accidents IS 'Traffic accidents from NRW Unfallatlas';
COMMENT ON COLUMN accidents.accident_id IS 'Unique accident identifier (OID_ from source CSV)';
COMMENT ON COLUMN accidents.year IS 'Year of accident (UJAHR)';
COMMENT ON COLUMN accidents.month IS 'Month of accident (UMONAT)';
COMMENT ON COLUMN accidents.hour IS 'Hour of accident (USTUNDE)';
COMMENT ON COLUMN accidents.weekday IS 'Day of week: 1=Monday ... 7=Sunday (UWOCHENTAG)';
COMMENT ON COLUMN accidents.category IS 'Accident severity category (UKATEGORIE)';
COMMENT ON COLUMN accidents.type IS 'Accident type (UART)';
COMMENT ON COLUMN accidents.light_condition IS 'Light condition (ULICHTVERH)';
COMMENT ON COLUMN accidents.participants IS 'Number of persons involved (ANZ_PERSON)';
COMMENT ON COLUMN accidents.longitude IS 'X coordinate (Gauss-Krüger, EPSG:25832) – XGCS';
COMMENT ON COLUMN accidents.latitude IS 'Y coordinate (Gauss-Krüger, EPSG:25832) – YGCS';
COMMENT ON COLUMN accidents.region_id IS 'District code (UKREIS)';
COMMENT ON COLUMN accidents.updated_at IS 'Timestamp of last insert or update';