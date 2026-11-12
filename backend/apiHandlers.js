const pool = require('./db');

const { generateTripPlan, applyRainyDay } = require('./planner');

async function authenticateUser(body) {
  const { name, email, password } = body;
  if (!email || !password) {
    const error = new Error('Email and password required');
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) {
    if (!name) {
      const error = new Error('Name required for new registration');
      error.statusCode = 400;
      throw error;
    }
    const insertResult = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, password]
    );
    return insertResult.rows[0];
  }

  const user = result.rows[0];
  if (user.password !== password) {
    const error = new Error('Incorrect password');
    error.statusCode = 401;
    throw error;
  }
  delete user.password;
  return user;
}

async function saveItinerary(body) {
  const { user_id, city, budget, transport, schedule } = body;
  const result = await pool.query(
    'INSERT INTO itineraries (user_id, city, budget, transport, schedule) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [user_id, city, budget, transport, JSON.stringify(schedule)]
  );
  return result.rows[0];
}

async function getItineraries(userId) {
  const result = await pool.query('SELECT * FROM itineraries WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return result.rows;
}

async function deleteItinerary(id) {
  await pool.query('DELETE FROM itineraries WHERE id = $1', [id]);
}

module.exports = {
  generateTripPlan,
  applyRainyDay,
  authenticateUser,
  saveItinerary,
  getItineraries,
  deleteItinerary
};
