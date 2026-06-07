# 🚦 Unfallatlas ETL Pipeline

ETL (Extract, Transform, Load) pipeline for the **German traffic accident atlas (Unfallatlas)** of North Rhine‑Westphalia (NRW).  
Downloads accident data from the official open data portal, transforms it, and stores it in a PostgreSQL database for analysis.

---

## 📦 Features

- **Fully automated ETL** – download → unzip → parse → insert
- **Idempotent upserts** – `ON CONFLICT` with primary key, no duplicates
- **Batch processing** – 1,000 rows per batch, configurable
- **Automatic retry** on download failures (3 attempts with backoff)
- **Production‑ready** – environment validation, error recovery, logging
- **REST API** – trigger ETL manually or let it run on startup
- **Large‑data ready** – handles 250k+ accident records per year

---

## 🗺️ Data Source

[OpenGeodata NRW – Unfallatlas](https://www.opengeodata.nrw.de/produkte/transport_verkehr/unfallatlas/)  
CSV files with accident data from 2015 onward, in **EPSG:25832** (Gauss‑Krüger) coordinates.

---

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+
- PostgreSQL 15+ (with `psql` command‑line tool)
- ~500 MB free disk space (per year)

### 2. Clone & Install

```bash
git clone https://github.com/yourusername/unfallatlas-etl.git
cd unfallatlas-etl
npm install

PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=unfallatlas
BATCH_SIZE=1000
DOWNLOAD_TIMEOUT_MS=300000
DISABLE_AUTO_ETL=false   # set to true if you don't want auto‑run on startup


┌─────────────┐     ┌──────────┐     ┌────────────┐     ┌──────────┐
│  Download   │ ──► │  Unzip   │ ──► │   Parse    │ ──► │  Insert  │
│   .zip URL  │     │          │     │    CSV     │     │   into   │
│ (retry 3×)  │     │          │     │  (batch)   │     │ Postgres │
└─────────────┘     └──────────┘     └────────────┘     └──────────┘
Extract: Fetches the correct zip file (e.g. Unfallorte2024_EPSG25832_CSV.zip) from the official server.

Transform: Maps NRW column names (UJAHR, ULICHTVERH, ANZ_PERSON, XGCS, YGCS …) to a clean database schema.

Load: Uses INSERT ... ON CONFLICT (accident_id) DO UPDATE – idempotent and safe for repeated runs.

Batch size: Configurable via BATCH_SIZE (default 1000). Prevents memory overflow.


.
├── data/                     # Downloaded zip + extracted CSV (ignored by git)
├── pgsql/
│   └── schema.sql            # Database schema definition
├── src/
│   ├── db/
│   │   ├── db.js             # PostgreSQL connection pool
│   │   └── init.js           # Schema initialiser
│   ├── extractors/
│   │   ├── downloadDataset.js
│   │   └── unzipDataset.js
│   ├── loaders/
│   │   └── accidentLoader.js # Batch insert with upsert
│   ├── pipeline/
│   │   └── etlPipeline.js    # Main ETL orchestration
│   ├── transformars/
│   │   └── accidentTransformer.js # CSV → DB column mapping
│   └── utils/
│       
├── .env.example
├── package.json
├── server.js                 # Express server + auto‑ETL trigger
└── README.md
