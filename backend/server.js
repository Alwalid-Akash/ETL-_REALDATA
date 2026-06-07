require("dotenv").config();
const express = require("express");
const { initDB } = require("./src/db/init");
const { runETL } = require("./src/pipeline/etlPipeline");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "running" });
});

app.post("/run-etl", async (req, res) => {
  const year = req.body.year || 2024;
  console.log(`➡️ Received request to run ETL for year ${year}`);
  try {
    await runETL(year);
    res.json({ success: true, year, message: "ETL completed successfully" });
  } catch (e) {
    console.error("❌ ETL failed:", e);
    res.status(500).json({ error: e.message, stack: e.stack });
  }
});

const PORT = process.env.PORT || 3000;

async function start() {
  await initDB();
  await runETL(2024);   // <-- ETL runs automatically on server start
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

start();