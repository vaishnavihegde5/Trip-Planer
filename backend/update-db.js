const { Client } = require('pg');

async function updateDB() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'aitripplanner',
    password: 'okok',
    port: 5432,
  });

  try {
    await client.connect();
    console.log("Connected to aitripplanner database.");
    
    await client.query('DROP TABLE IF EXISTS itineraries CASCADE');
    await client.query('DROP TABLE IF EXISTS users CASCADE');
    console.log("Dropped existing tables.");

    const schema = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS itineraries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        city VARCHAR(255) NOT NULL,
        budget INTEGER NOT NULL,
        transport VARCHAR(50),
        schedule JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await client.query(schema);
    console.log("Schema created successfully with password field.");
  } catch (err) {
    console.error("Error updating schema:", err);
  } finally {
    await client.end();
  }
}

updateDB();
