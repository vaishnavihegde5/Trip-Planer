const { getItineraries, deleteItinerary } = require('../../../backend/apiHandlers');

module.exports = async (req, res) => {
  const { id } = req.query || {};

  if (req.method === 'GET') {
    try {
      const itineraries = await getItineraries(id);
      res.status(200).json({ itineraries });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    return;
  }

  if (req.method === 'DELETE') {
    try {
      await deleteItinerary(id);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
};
