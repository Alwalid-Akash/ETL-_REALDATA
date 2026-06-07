const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");

async function unzipFile(zipPath, outputDir) {
  fs.mkdirSync(outputDir, { recursive: true });

  await fs
    .createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: outputDir }))
    .promise();

  return outputDir;
}

module.exports = { unzipFile };