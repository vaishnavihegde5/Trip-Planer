const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Basic test route
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0].now });
  } catch (error) {
    console.log("Database connection failed, but backend is running.");
    res.json({ success: true, warning: "Database not connected", error: error.message });
  }
});

const { generateTripPlan, applyRainyDay } = require('./planner');

app.post('/api/plan', (req, res) => {
  try {
    res.json(generateTripPlan(req.body));
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

app.post('/api/plan/rainy-day', (req, res) => {
  res.json({ schedule: applyRainyDay(req.body.schedule, req.body.city) });
});

app.post('/api/auth', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    let result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      if (!name) return res.status(400).json({ error: 'Name required for new registration' });
      result = await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at', [name, email, password]);
      res.json({ user: result.rows[0] });
    } else {
      const user = result.rows[0];
      if (user.password !== password) {
        return res.status(401).json({ error: 'Incorrect password' });
      }
      delete user.password;
      res.json({ user });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save Itinerary
app.post('/api/itineraries', async (req, res) => {
  const { user_id, city, budget, transport, schedule } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO itineraries (user_id, city, budget, transport, schedule) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, city, budget, transport, JSON.stringify(schedule)]
    );
    res.json({ itinerary: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Itineraries
app.get('/api/itineraries/:userId', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM itineraries WHERE user_id = $1 ORDER BY created_at DESC', [req.params.userId]);
    res.json({ itineraries: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Itinerary
app.delete('/api/itineraries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM itineraries WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
