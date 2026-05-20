const { Pool } = require('pg');

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        user: 'postgres',
        host: 'localhost',
        database: 'aitripplanner',
        password: 'okok',
        port: 5432,
      }
);

module.exports = pool;
