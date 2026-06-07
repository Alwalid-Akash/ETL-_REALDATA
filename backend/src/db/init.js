const pool = require("./db");
const fs = require("fs");
const path = require("path");

async function initDB() {
  // Try multiple possible locations for schema.sql
  const possiblePaths = [
    path.join(__dirname, "../../pgsql/schema.sql"),   // backend/pgsql/
    path.join(process.cwd(), "pgsql/schema.sql"),    // root/pgsql/
    path.join(__dirname, "schema.sql"),              // src/db/schema.sql
  ];

  let schemaPath = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      schemaPath = p;
      break;
    }
  }

  if (!schemaPath) {
    throw new Error(`schema.sql not found. Tried: ${possiblePaths.join(", ")}`);
  }

  const sql = fs.readFileSync(schemaPath, "utf-8");
  await pool.query(sql);
  console.log("✅ Database schema ready");
}

module.exports = { initDB };