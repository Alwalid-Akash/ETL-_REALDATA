const fs = require("fs");
const axios = require("axios");

async function downloadZip(url, destPath, retries = 3, timeoutMs = 120000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`⬇️ Download attempt ${attempt}: ${url}`);
      const response = await axios({
        method: "GET",
        url,
        responseType: "stream",
        timeout: timeoutMs,
      });

      const writer = fs.createWriteStream(destPath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
      console.log(`✅ Downloaded: ${destPath}`);
      return destPath;
    } catch (err) {
      console.error(`Attempt ${attempt} failed:`, err.message);
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 2000 * attempt));
    }
  }
}

module.exports = { downloadZip };