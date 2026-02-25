const { Pool } = require('pg');
const config = require('./index');

// Pool matlab ek connection baar baar banane ki
// jagah, ek group of connections ready rakhta hai
const pool = new Pool({
  host: config.PG_HOST,
  port: config.PG_PORT,
  user: config.PG_USER,
  password: config.PG_PASSWORD,
  database: config.PG_DATABASE,
});

// Test connection on startup
const connectPostgreSQL = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL connected successfully');
    client.release(); // connection wapas pool mein daalo
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error.message);
    process.exit(1);
  }
};

module.exports = { pool, connectPostgreSQL };