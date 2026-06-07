const axios = require("axios");

/**
 * Generates the correct download URL for a given year.
 * @param {number} year - The year for which to get the URL (e.g., 2024).
 * @returns {Promise<string>} The direct URL to the CSV zip file.
 */
async function getUnfallUrl(year) {
  // Base URL for all Unfallatlas data
  const baseUrl = "https://www.opengeodata.nrw.de/produkte/transport_verkehr/unfallatlas/";

  // Construct the filename based on the discovered pattern.
  // Example: Unfallorte2024_EPSG25832_CSV.zip
  const fileName = `Unfallorte${year}_EPSG25832_CSV.zip`;
  const fullUrl = `${baseUrl}${fileName}`;

  console.log(`🔍 Generated URL for ${year}: ${fullUrl}`);

  // Optional but recommended: Verify the URL is valid before returning
  try {
    // Use a HEAD request to check if the file exists without downloading it
    await axios.head(fullUrl, { timeout: 5000 });
    console.log(`✅ URL is valid for ${year}.`);
    return fullUrl;
  } catch (error) {
    // If the HEAD request fails, the file might not exist for this year
    console.error(`❌ File for year ${year} not found at ${fullUrl}`);
    throw new Error(`No data available for year ${year}.`);
  }
}

module.exports = { getUnfallUrl };