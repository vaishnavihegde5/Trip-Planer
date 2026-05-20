const { Client } = require('pg');

async function initDB() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'okok',
    port: 5432,
  });

  try {
    await client.connect();
    console.log("Connected to default postgres database.");
    
    // Check if database exists
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'aitripplanner'");
    if (res.rowCount === 0) {
      await client.query('CREATE DATABASE aitripplanner');
      console.log("Database aitripplanner created.");
    } else {
      console.log("Database aitripplanner already exists.");
    }
  } catch (err) {
    console.error("Error creating database:", err);
  } finally {
    await client.end();
  }

  // Now connect to the new database and create tables
  const appClient = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'aitripplanner',
    password: 'okok',
    port: 5432,
  });

  try {
    await appClient.connect();
    console.log("Connected to aitripplanner database.");
    
    const schema = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
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
    
    await appClient.query(schema);
    console.log("Schema created successfully.");
  } catch (err) {
    console.error("Error creating schema:", err);
  } finally {
    await appClient.end();
  }
}

initDB();
