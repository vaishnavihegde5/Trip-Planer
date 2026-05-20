const { Pool } = require('pg');

if (process.env.DATABASE_URL) {
  module.exports = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  return;
}

console.warn('DATABASE_URL not set. Using in-memory fallback database.');

const users = [];
const itineraries = [];
let nextUserId = 1;
let nextItineraryId = 1;

function findUserByEmail(email) {
  return users.find((user) => user.email === email);
}

module.exports = {
  query: async (text, params) => {
    if (text.startsWith('SELECT * FROM users WHERE email =')) {
      const email = params[0];
      const user = findUserByEmail(email);
      return { rows: user ? [user] : [] };
    }

    if (text.startsWith('INSERT INTO users')) {
      const [name, email, password] = params;
      const user = {
        id: nextUserId++,
        name,
        email,
        password,
        created_at: new Date().toISOString(),
      };
      users.push(user);
      return { rows: [user] };
    }

    if (text.startsWith('INSERT INTO itineraries')) {
      const [user_id, city, budget, transport, schedule] = params;
      const itinerary = {
        id: nextItineraryId++,
        user_id,
        city,
        budget,
        transport,
        schedule,
        created_at: new Date().toISOString(),
      };
      itineraries.push(itinerary);
      return { rows: [itinerary] };
    }

    if (text.startsWith('SELECT * FROM itineraries WHERE user_id')) {
      const userId = params[0];
      const rows = itineraries
        .filter((it) => String(it.user_id) === String(userId))
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
      return { rows };
    }

    if (text.startsWith('DELETE FROM itineraries WHERE id')) {
      const id = params[0];
      const index = itineraries.findIndex((it) => String(it.id) === String(id));
      if (index !== -1) {
        itineraries.splice(index, 1);
      }
      return { rows: [] };
    }

    throw new Error(`Unsupported fallback query: ${text}`);
  },
};
