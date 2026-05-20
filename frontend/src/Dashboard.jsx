import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Trash2, LogOut, ExternalLink } from 'lucide-react';

function Dashboard() {
  const [itineraries, setItineraries] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchItineraries = async () => {
      try {
        const res = await fetch(`/api/itineraries/${user.id}`);
        const data = await res.json();
        setItineraries(data.itineraries);
      } catch (err) {
        console.error(err);
      }
    };
    fetchItineraries();
  }, [user, navigate]);

  const [filterCity, setFilterCity] = useState('');

  const handleSignOut = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/itineraries/${id}`, { method: 'DELETE' });
      setItineraries(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTrips = itineraries.filter(t => t.city.toLowerCase().includes(filterCity.toLowerCase()));

  return (
    <div className="app-container">
      <motion.div 
        className="glass-card" style={{ maxWidth: '800px' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <button className="btn btn-secondary" style={{ width: 'auto', marginTop: 0, padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => navigate('/plan')}>
            <ArrowLeft size={16} /> New Trip
          </button>
          <div style={{ fontWeight: 600 }}>Hello, {user?.name}</div>
          <button className="btn btn-secondary" style={{ width: 'auto', marginTop: 0, padding: '8px 16px', fontSize: '0.9rem' }} onClick={handleSignOut}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
        
        <h1 className="title">Your Past Trips</h1>
        
        <input 
          type="text" 
          placeholder="Filter by city..." 
          className="input-field" 
          value={filterCity}
          onChange={e => setFilterCity(e.target.value)}
          style={{ padding: '10px', marginTop: '10px' }}
        />
        
        <div style={{ marginTop: '1rem' }}>
          {filteredTrips.length === 0 ? (
            <p style={{ textAlign: 'center', opacity: 0.7 }}>No trips found.</p>
          ) : (
            filteredTrips.map(trip => (
              <div key={trip.id} className="task-item">
                <div className="task-item-time" style={{ fontSize: '1rem' }}>
                  {new Date(trip.created_at).toLocaleDateString()}
                </div>
                <div className="task-item-details">
                  <div className="task-item-title">{trip.city}</div>
                  <div className="task-item-location">
                    <MapPin size={14} /> Budget: ₹{trip.budget} | Transport: {trip.transport}
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div style={{ cursor: 'pointer', color: '#8ec5fc' }} onClick={() => navigate('/itinerary', { state: { savedTrip: trip } })}>
                    <ExternalLink size={20} />
                  </div>
                  <div style={{ cursor: 'pointer', color: '#ff6b6b' }} onClick={() => handleDelete(trip.id)}>
                    <Trash2 size={20} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Dashboard;
