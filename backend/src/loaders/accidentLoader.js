const pool = require("../db/db");

async function insertAccidents(records) {
  if (!records.length) return;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Optional: ensure table exists (if initDB didn't run)
    await client.query(`
      CREATE TABLE IF NOT EXISTS accidents (
        accident_id VARCHAR(50) PRIMARY KEY,
        year INT, month INT, hour INT, weekday INT,
        category INT, type INT, light_condition INT, participants INT,
        longitude DECIMAL(10,7), latitude DECIMAL(10,7), region_id VARCHAR(20),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const batchSize = 1000;
    let totalInserted = 0;

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      const values = [];
      const placeholders = [];

      batch.forEach((r, idx) => {
        const offset = idx * 12;
        placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}, $${offset + 10}, $${offset + 11}, $${offset + 12})`);
        values.push(
          r.accident_id, r.year, r.month, r.hour, r.weekday,
          r.category, r.type, r.light_condition, r.participants,
          r.longitude, r.latitude, r.region_id
        );
      });

      const query = `
        INSERT INTO accidents
        (accident_id, year, month, hour, weekday, category, type,
         light_condition, participants, longitude, latitude, region_id)
        VALUES ${placeholders.join(",")}
        ON CONFLICT (accident_id) DO UPDATE SET
          year = EXCLUDED.year, month = EXCLUDED.month, hour = EXCLUDED.hour,
          weekday = EXCLUDED.weekday, category = EXCLUDED.category,
          type = EXCLUDED.type, light_condition = EXCLUDED.light_condition,
          participants = EXCLUDED.participants, longitude = EXCLUDED.longitude,
          latitude = EXCLUDED.latitude, region_id = EXCLUDED.region_id,
          updated_at = NOW()
      `;
      const res = await client.query(query, values);
      totalInserted += batch.length;
      console.log(`   Batch ${i / batchSize + 1}: ${batch.length} rows upserted`);
    }

    await client.query("COMMIT");
    console.log(`💾 Total ${totalInserted} accidents saved`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { insertAccidents };