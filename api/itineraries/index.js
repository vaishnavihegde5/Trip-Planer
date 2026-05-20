const { saveItinerary } = require('../../../backend/apiHandlers');

async function parseJsonBody(req) {
  if (req.body) return req.body;
  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }
  return body ? JSON.parse(body) : {};
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = await parseJsonBody(req);
    const itinerary = await saveItinerary(body);
    res.status(200).json({ itinerary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
