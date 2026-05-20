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

// Mock AI Plan generation
app.post('/api/plan', (req, res) => {
  const { city, area, budget, interests, timings, transport, vibe, option } = req.body;
  const planVibe = vibe || 'relaxed';
  const planOption = option || 'option1'; 
  const locPrefix = area ? `${area}, ${city}` : city;

  const realPlacesDB = {
    'Mumbai': [
      { name: 'Gateway of India', area: 'Colaba', type: 'outdoor', keyword: 'monument' },
      { name: 'Prithvi Cafe', area: 'Juhu', type: 'indoor', keyword: 'cafe' },
      { name: 'Sanjay Gandhi National Park', area: 'Borivali', type: 'outdoor', keyword: 'park' },
      { name: 'Leopold Cafe', area: 'Colaba', type: 'indoor', keyword: 'restaurant' },
      { name: 'Dr. Bhau Daji Lad Museum', area: 'Byculla', type: 'indoor', keyword: 'museum' },
      { name: 'Marine Drive', area: 'Churchgate', type: 'outdoor', keyword: 'landscape' },
      { name: 'Bandra Fort', area: 'Bandra', type: 'outdoor', keyword: 'landscape' },
      { name: 'The Bombay Canteen', area: 'Lower Parel', type: 'indoor', keyword: 'restaurant' }
    ],
    'Delhi': [
      { name: 'India Gate', area: 'Rajpath', type: 'outdoor', keyword: 'monument' },
      { name: 'United Coffee House', area: 'Connaught Place', type: 'indoor', keyword: 'cafe' },
      { name: 'Lodhi Gardens', area: 'Lodhi Estate', type: 'outdoor', keyword: 'park' },
      { name: "Karim's", area: 'Old Delhi', type: 'indoor', keyword: 'restaurant' },
      { name: 'National Museum', area: 'Janpath', type: 'indoor', keyword: 'museum' },
      { name: 'Hauz Khas Fort', area: 'Hauz Khas', type: 'outdoor', keyword: 'landscape' },
      { name: 'Qutub Minar', area: 'Mehrauli', type: 'outdoor', keyword: 'monument' },
      { name: 'Indian Accent', area: 'Lodhi Road', type: 'indoor', keyword: 'restaurant' }
    ],
    'Bangalore': [
      { name: 'Bangalore Palace', area: 'Vasanth Nagar', type: 'outdoor', keyword: 'palace' },
      { name: 'Third Wave Coffee', area: 'Indiranagar', type: 'indoor', keyword: 'cafe' },
      { name: 'Lalbagh Botanical Garden', area: 'Mavalli', type: 'outdoor', keyword: 'park' },
      { name: 'Vidyarthi Bhavan', area: 'Basavanagudi', type: 'indoor', keyword: 'restaurant' },
      { name: 'Visvesvaraya Museum', area: 'Kasturba Road', type: 'indoor', keyword: 'museum' },
      { name: 'Cubbon Park', area: 'Ambedkar Veedhi', type: 'outdoor', keyword: 'park' },
      { name: 'Nandi Hills', area: 'Chikkaballapur', type: 'outdoor', keyword: 'landscape' },
      { name: 'Toit Brewpub', area: 'Indiranagar', type: 'indoor', keyword: 'restaurant' }
    ],
    'Jaipur': [
      { name: 'Hawa Mahal', area: 'Badi Choupad', type: 'outdoor', keyword: 'palace' },
      { name: 'Tapri Central', area: 'C-Scheme', type: 'indoor', keyword: 'cafe' },
      { name: 'Central Park', area: 'Rambagh', type: 'outdoor', keyword: 'park' },
      { name: 'Chokhi Dhani', area: 'Tonk Road', type: 'outdoor', keyword: 'restaurant' },
      { name: 'Albert Hall Museum', area: 'Ram Niwas Garden', type: 'indoor', keyword: 'museum' },
      { name: 'Amer Fort', area: 'Amer', type: 'outdoor', keyword: 'monument' },
      { name: 'Jal Mahal', area: 'Amer Road', type: 'outdoor', keyword: 'landscape' },
      { name: 'Suvarna Mahal', area: 'Rambagh Palace', type: 'indoor', keyword: 'restaurant' }
    ],
    'Goa': [
      { name: 'Basilica of Bom Jesus', area: 'Old Goa', type: 'indoor', keyword: 'church' },
      { name: 'Artjuna Cafe', area: 'Anjuna', type: 'indoor', keyword: 'cafe' },
      { name: 'Dudhsagar Falls', area: 'Sanguem', type: 'outdoor', keyword: 'landscape' },
      { name: 'Thalassa', area: 'Siolim', type: 'indoor', keyword: 'restaurant' },
      { name: 'Goa State Museum', area: 'Panaji', type: 'indoor', keyword: 'museum' },
      { name: 'Baga Beach', area: 'Baga', type: 'outdoor', keyword: 'landscape' },
      { name: 'Aguada Fort', area: 'Candolim', type: 'outdoor', keyword: 'monument' },
      { name: 'Gunpowder', area: 'Assagao', type: 'indoor', keyword: 'restaurant' }
    ],
    'Kerala': [
      { name: 'Chinese Fishing Nets', area: 'Fort Kochi', type: 'outdoor', keyword: 'landscape' },
      { name: 'Kashi Art Cafe', area: 'Fort Kochi', type: 'indoor', keyword: 'cafe' },
      { name: 'Eravikulam National Park', area: 'Munnar', type: 'outdoor', keyword: 'park' },
      { name: 'Paragon Restaurant', area: 'Kozhikode', type: 'indoor', keyword: 'restaurant' },
      { name: 'Napier Museum', area: 'Trivandrum', type: 'indoor', keyword: 'museum' },
      { name: 'Alleppey Backwaters', area: 'Alappuzha', type: 'outdoor', keyword: 'lake' },
      { name: 'Varkala Cliff', area: 'Varkala', type: 'outdoor', keyword: 'landscape' },
      { name: 'Villa Maya', area: 'Trivandrum', type: 'indoor', keyword: 'restaurant' }
    ],
    'Agra': [
      { name: 'Taj Mahal', area: 'Tajganj', type: 'outdoor', keyword: 'monument' },
      { name: 'Sheroes Hangout', area: 'Fatehabad Road', type: 'indoor', keyword: 'cafe' },
      { name: 'Mehtab Bagh', area: 'Dharmapuri', type: 'outdoor', keyword: 'park' },
      { name: 'Pinch of Spice', area: 'Sanjay Place', type: 'indoor', keyword: 'restaurant' },
      { name: 'Agra Fort', area: 'Rakabganj', type: 'outdoor', keyword: 'monument' },
      { name: 'Tomb of Itimad-ud-Daulah', area: 'Moti Bagh', type: 'indoor', keyword: 'monument' },
      { name: 'Fatehpur Sikri', area: 'Fatehpur Sikri', type: 'outdoor', keyword: 'monument' },
      { name: 'Peshawri', area: 'Tajganj', type: 'indoor', keyword: 'restaurant' }
    ],
    'Udaipur': [
      { name: 'City Palace', area: 'Old City', type: 'indoor', keyword: 'palace' },
      { name: "Jheel's Ginger Coffee Bar", area: 'Gangaur Ghat', type: 'indoor', keyword: 'cafe' },
      { name: 'Saheliyon Ki Bari', area: 'Panchwati', type: 'outdoor', keyword: 'park' },
      { name: 'Ambrai Restaurant', area: 'Chand Pole', type: 'outdoor', keyword: 'restaurant' },
      { name: 'Vintage Car Museum', area: 'Gulab Bagh', type: 'indoor', keyword: 'museum' },
      { name: 'Lake Pichola', area: 'Pichola', type: 'outdoor', keyword: 'lake' },
      { name: 'Sajjangarh Monsoon Palace', area: 'Bansdara Peak', type: 'outdoor', keyword: 'palace' },
      { name: 'Tribute Restaurant', area: 'Fateh Sagar', type: 'indoor', keyword: 'restaurant' }
    ]
  };

  const genericFallback = [
    { name: `Historic Monument of ${city}`, area: 'Heritage Square', type: 'outdoor', keyword: 'monument' },
    { name: `Central ${city} Cafe`, area: 'Downtown', type: 'indoor', keyword: 'cafe' },
    { name: `${city} Botanical Gardens`, area: 'Riverside', type: 'outdoor', keyword: 'park' },
    { name: `Authentic ${city} Bistro`, area: 'Market Street', type: 'indoor', keyword: 'restaurant' },
    { name: `${city} Art Gallery`, area: 'Cultural Quarter', type: 'indoor', keyword: 'museum' },
    { name: `${city} Lake Promenade`, area: 'Westside', type: 'outdoor', keyword: 'lake' },
    { name: `${city} Sunset Viewpoint`, area: 'Uptown', type: 'outdoor', keyword: 'landscape' },
    { name: `Luxury Dining Lounge`, area: 'East End', type: 'indoor', keyword: 'restaurant' }
  ];

  exactPlaces = realPlacesDB[city] || genericFallback;

  // We slightly shuffle or offset the exactPlaces array based on option to create variation
  if (planOption === 'option2') {
    exactPlaces = [...exactPlaces.slice(3), ...exactPlaces.slice(0, 3)];
  } else if (planOption === 'option3') {
    exactPlaces = [...exactPlaces.slice(6), ...exactPlaces.slice(0, 6)];
  }

  const times = ['08:00 AM', '10:00 AM', '12:00 PM', '01:30 PM', '03:00 PM', '05:00 PM', '07:00 PM', '09:00 PM'];
  const mockSchedule = times.map((time, i) => {
    let place = exactPlaces[i];
    return {
      id: String(i + 1),
      title: place.name,
      time: time,
      location: place.name,
      area: place.area,
      type: place.type,
      imageUrl: `https://loremflickr.com/400/300/${place.keyword}?random=${place.name.replace(/\s+/g, '')}${i}`,
      aboutUrl: `https://www.google.com/search?q=${encodeURIComponent(place.name)}`
    };
  });

  res.json({ schedule: mockSchedule });
});

app.post('/api/plan/rainy-day', (req, res) => {
  const { schedule } = req.body;
  const indoorOptions = [
    { title: "Local Museum of Art", keyword: "museum" },
    { title: "Cozy Books & Coffee Cafe", keyword: "cafe" },
    { title: "City Central Arcade", keyword: "arcade" },
    { title: "Relaxing Indoor Spa", keyword: "spa" },
    { title: "Grand Public Library", keyword: "library" },
    { title: "Indoor Botanical Conservatory", keyword: "conservatory" },
    { title: "Boutique Shopping Mall", keyword: "mall" },
    { title: "Heritage Indoor Theater", keyword: "theater" }
  ];

  const rainyDaySchedule = schedule.map((item, index) => {
    if (item.type === 'outdoor') {
      const option = indoorOptions[index % indoorOptions.length];
      const areaLocation = item.location.split(',')[0] || item.location;
      return { 
        ...item, 
        title: `${option.title}`, 
        location: `${areaLocation}`, 
        type: 'indoor',
        imageUrl: `https://loremflickr.com/400/300/${option.keyword}?random=${item.id}rain`,
        aboutUrl: `https://en.wikipedia.org/wiki/Special:Search?search=${option.title.split(' ').join('+')}`
      };
    }
    return item;
  });
  
  res.json({ schedule: rainyDaySchedule });
});

// Mock Social Login Auth (Now with Password)
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
