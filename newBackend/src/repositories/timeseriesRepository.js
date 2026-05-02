/**
 * TIMESERIES REPOSITORY
 * ----------------------
 * Handles all database operations for long‑format time‑series rows.
 *
 * Responsibilities:
 *   - Resolve dataset name → dataset ID
 *   - Count rows for a dataset
 *   - Fetch all long‑format rows for a dataset
 *   - Fetch distinct metric names for a dataset
 *
 * This repository interacts with:
 *   - datasets
 *   - timeseries_long
 */

const pool = require('../db/pool'); // Correct import

class TimeseriesRepository {
  async getDatasetIdByName(name) {
    const result = await pool.query(
      `
      SELECT id
      FROM datasets
      WHERE name = $1
      `,
      [name]
    );
    return result.rows[0]?.id ?? null;
  }

  async countRowsByDatasetId(datasetId) {
    const result = await pool.query(
      `
      SELECT COUNT(*) AS count
      FROM timeseries_long
      WHERE dataset_id = $1
      `,
      [datasetId]
    );
    return Number(result.rows[0].count);
  }

  async findAllLongByDatasetId(datasetId) {
    const result = await pool.query(
      `
      SELECT
        ts,
        entity,
        metric,
        value
      FROM timeseries_long
      WHERE dataset_id = $1
      ORDER BY ts ASC
      `,
      [datasetId]
    );
    return result.rows;
  }

  async findDistinctMetricsByDatasetId(datasetId) {
    const result = await pool.query(
      `
      SELECT DISTINCT metric
      FROM timeseries_long
      WHERE dataset_id = $1
      ORDER BY metric ASC
      `,
      [datasetId]
    );
    return result.rows.map((r) => r.metric);
  }
}

module.exports = TimeseriesRepository;
