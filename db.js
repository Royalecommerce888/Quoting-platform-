const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  console.warn("Warning: DATABASE_URL is not set. DB will not work.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// This is the function index.js expects to call: db.query(...)
async function query(text, params) {
  return pool.query(text, params);
}

module.exports = { query };
