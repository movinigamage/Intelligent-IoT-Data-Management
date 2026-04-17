/**
 * DATASET REPOSITORY
 * -------------------
 * Handles all database operations related to dataset metadata.
 *
 * Responsibilities:
 *   - Fetch all datasets
 *   - Fetch a dataset by ID
 *   - Insert a new dataset
 *
 * This repository does NOT interact with time‑series rows.
 */

const db = require('../db'); // your pg Pool instance

class DatasetRepository {
  async findAll() {
    const result = await db.query(`
      SELECT id, name, description, created_at
      FROM datasets
      ORDER BY id ASC
    `);
    return result.rows;
  }

  async findById(id) {
    const result = await db.query(
      `
      SELECT id, name, description, created_at
      FROM datasets
      WHERE id = $1
      `,
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data) {
    const { name, description } = data;

    const result = await db.query(
      `
      INSERT INTO datasets (name, description)
      VALUES ($1, $2)
      RETURNING id, name, description, created_at
      `,
      [name, description]
    );

    return result.rows[0];
  }
}

module.exports = DatasetRepository;
