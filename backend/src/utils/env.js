const dotenv = require("dotenv");
dotenv.config();

const required = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"];
for (const varName of required) {
  if (!process.env[varName]) {
    console.error(`❌ Missing environment variable: ${varName}`);
    process.exit(1);
  }
}

module.exports = {
  PORT: process.env.PORT || 3000,
  BATCH_SIZE: parseInt(process.env.BATCH_SIZE || "1000"),
  DOWNLOAD_TIMEOUT_MS: parseInt(process.env.DOWNLOAD_TIMEOUT_MS || "300000"),
  dbConfig: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
};