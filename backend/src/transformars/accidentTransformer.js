/**
 * Transforms a raw CSV row from the NRW Unfallatlas into the database format.
 * 
 * Typical columns in the CSV (based on your error output):
 *   OID_, UIDENTSTLAE, ULAND, UREGBEZ, UKREIS, UGEMEINDE, UJAHR, UMONAT,
 *   USTUNDE, UWOCHENTAG, UKATEGORIE, UART, ULICHTVERH, ANZ_PERSON,
 *   XGCS, YGCS, ...
 */
function transformAccident(row) {
  // Use OID_ as the unique identifier (it's a number, works perfectly with ON CONFLICT)
  // Fallback to UIDENTSTLAE if OID_ is missing (rare)
  const accidentId = row.OID_ || row.UIDENTSTLAE || null;

  const toNumber = (val) => (val && val !== "" ? Number(val) : null);

  return {
    accident_id: accidentId,
    year: toNumber(row.UJAHR),
    month: toNumber(row.UMONAT),
    hour: toNumber(row.USTUNDE),
    weekday: toNumber(row.UWOCHENTAG),
    category: toNumber(row.UKATEGORIE),
    type: toNumber(row.UART),
    light_condition: toNumber(row.ULICHTVERH),    // correct column name
    participants: toNumber(row.ANZ_PERSON),       // correct column name
    // The CSV provides coordinates in Gauss‑Krüger (XGCS, YGCS) – store them as is.
    // If you need lat/lon, you would need a conversion (e.g., using proj4).
    longitude: toNumber(row.XGCS),
    latitude: toNumber(row.YGCS),
    region_id: row.UKREIS || null,               // district code
  };
}

module.exports = { transformAccident };