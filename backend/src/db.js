// db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test connection on startup so Render logs show the real errorp
(async function testConnection() {
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT 1');
      console.log('Postgres: connection OK');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Postgres: connection FAILED ->', err && err.message ? err.message : err);
  }
})();

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
