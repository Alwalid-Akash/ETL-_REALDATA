require("dotenv").config();
const { runETL } = require("./src/pipeline/etlPipeline");

runETL(2024).then(() => {
  console.log("Done");
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});