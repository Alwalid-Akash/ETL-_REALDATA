const fs = require("fs");
const path = require("path");

function findCsv(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      const result = findCsv(fullPath);

      if (result) {
        return result;
      }
    }

    if (file.toLowerCase().endsWith(".csv")) {
      return fullPath;
    }
  }

  return null;
}

module.exports = { findCsv };