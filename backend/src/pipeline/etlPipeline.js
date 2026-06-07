const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");

const { downloadZip } = require("../extractors/downloadDataset");   // ✅ fixed
const { unzipFile } = require("../extractors/unzipDataset");
const { getUnfallUrl } = require("../utils/getUnfallatlasUrl");
const { findCsv } = require("../utils/findCsv");
const { transformAccident } = require("../transformars/accidentTransformer");
const { insertAccidents } = require("../loaders/accidentLoader");

async function runETL(year = 2024) {
  console.log(`\n🚀 ===== STARTING ETL FOR ${year} =====`);

  const url = await getUnfallUrl(year);
  const dataDir = path.join(__dirname, "../../data");
  fs.mkdirSync(dataDir, { recursive: true });

  const zipPath = path.join(dataDir, `${year}.zip`);
  const extractDir = path.join(dataDir, `${year}`);

  // 1. Download
  console.log("📥 Downloading...");
  await downloadZip(url, zipPath);

  // 2. Unzip
  console.log("📦 Unzipping...");
  await unzipFile(zipPath, extractDir);

  // 3. Find CSV
  const csvPath = findCsv(extractDir);
  if (!csvPath) throw new Error(`No CSV found in ${extractDir}`);
  console.log(`📄 CSV found: ${csvPath}`);

  // 4. Parse & transform
  const records = [];
  let errorCount = 0;
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv({ separator: ";" }))
      .on("data", (row) => {
        try {
          const transformed = transformAccident(row);
          if (transformed.accident_id) {
            records.push(transformed);
          } else {
            errorCount++;
            console.warn(`⚠️ Skipping row without accident_id: ${JSON.stringify(row).slice(0, 200)}`);
          }
        } catch (err) {
          errorCount++;
          console.warn(`⚠️ Transform error: ${err.message} in row: ${JSON.stringify(row).slice(0, 200)}`);
        }
      })
      .on("end", () => {
        console.log(`📊 Parsed ${records.length} valid rows (${errorCount} skipped)`);
        resolve();
      })
      .on("error", reject);
  });

  if (records.length === 0) throw new Error(`No valid records for year ${year}`);

  // 5. Insert into DB
  console.log("💾 Inserting into database...");
  await insertAccidents(records);
  console.log(`✅ ETL for ${year} COMPLETED – ${records.length} accidents stored\n`);
}

module.exports = { runETL };