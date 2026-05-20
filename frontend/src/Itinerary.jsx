import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { CloudRain, Sun, ArrowLeft, Map, Info, RefreshCw, MapPin } from 'lucide-react';

function Itinerary() {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;
  const savedTrip = location.state?.savedTrip;
  
  const [schedule, setSchedule] = useState(savedTrip ? savedTrip.schedule : []);
  const [loading, setLoading] = useState(!savedTrip);
  const [isRainy, setIsRainy] = useState(false);
  const [activeOption, setActiveOption] = useState('option1');

  useEffect(() => {
    const skyBg = document.querySelector('.sky-background');
    if (skyBg) {
      if (isRainy) {
        skyBg.classList.add('rainy-background');
      } else {
        skyBg.classList.remove('rainy-background');
      }
    }
  }, [isRainy]);



  const fetchPlan = async (option = 'option1') => {
    setLoading(true);
    setActiveOption(option);
    try {
      const payload = formData ? { ...formData, option } : { city: savedTrip?.city, option };
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setSchedule(data.schedule);
      
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && formData) {
        await fetch('/api/itineraries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            city: formData.city,
            budget: formData.budget || 0,
            transport: formData.transport || 'N/A',
            schedule: data.schedule
          })
        });
      }
    } catch (err) {
      console.error("Failed to fetch plan", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!formData && !savedTrip) {
      navigate('/');
      return;
    }
    
    if (savedTrip) return;

    fetchPlan('option1');
  }, [formData, savedTrip, navigate]);

  const toggleRainyDay = async () => {
    setLoading(true);
    setIsRainy(!isRainy);
    try {
      const endpoint = !isRainy ? '/api/plan/rainy-day' : '/api/plan';
      const response = await fetch(`${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(!isRainy ? { schedule } : formData)
      });
      const data = await response.json();
      setSchedule(data.schedule);
    } catch (err) {
      console.error("Failed to toggle rainy day", err);
    } finally {
      setLoading(false);
    }
  };



  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(schedule);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    let startTimeStr = formData?.timings?.start || '09:00';
    let [hours, minutes] = startTimeStr.split(':').map(Number);
    
    const updatedItems = items.map((item) => {
      let suffix = hours >= 12 ? 'PM' : 'AM';
      let displayHours = hours % 12 || 12;
      let displayMins = minutes < 10 ? '0' + minutes : minutes;
      
      const newTime = `${displayHours}:${displayMins} ${suffix}`;
      
      minutes += 90;
      hours += Math.floor(minutes / 60);
      minutes = minutes % 60;
      
      return { ...item, time: newTime };
    });
    
    setSchedule(updatedItems);
  };

  if (loading) {
    return (
      <div className="app-container">
        <h2 className="title" style={{ animation: 'pulse 1.5s infinite' }}>Planning your trip...</h2>
      </div>
    );
  }

  return (
    <div className="app-container">
      <motion.div 
        className="glass-card" style={{ maxWidth: '800px' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <button className="btn btn-secondary" style={{ width: 'auto', marginBottom: '1rem' }} onClick={() => navigate('/plan')}>
          <ArrowLeft size={18} /> Back to Edit
        </button>
        
        <h1 className="title">Your {formData?.city || savedTrip?.city} Itinerary</h1>
        {(formData?.area || savedTrip?.area) && (
          <p className="subtitle" style={{ marginTop: '-15px', marginBottom: '1.5rem' }}>Area: {formData?.area || savedTrip?.area}</p>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <button className={`btn ${activeOption === 'option1' ? '' : 'btn-secondary'}`} style={{ width: 'auto' }} onClick={() => fetchPlan('option1')}>Option 1</button>
          <button className={`btn ${activeOption === 'option2' ? '' : 'btn-secondary'}`} style={{ width: 'auto' }} onClick={() => fetchPlan('option2')}>Option 2</button>
          <button className={`btn ${activeOption === 'option3' ? '' : 'btn-secondary'}`} style={{ width: 'auto' }} onClick={() => fetchPlan('option3')}>Option 3</button>
        </div>
        
        <div className="rainy-toggle">
          <span>Sunny Day</span>
          <div 
            style={{ 
              width: '60px', height: '30px', background: isRainy ? '#4a1a4a' : '#ff8e53', 
              borderRadius: '15px', position: 'relative', cursor: 'pointer', transition: '0.3s'
            }}
            onClick={toggleRainyDay}
          >
            <div style={{
              width: '26px', height: '26px', background: 'white', borderRadius: '50%',
              position: 'absolute', top: '2px', left: isRainy ? '32px' : '2px', transition: '0.3s',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {isRainy ? <CloudRain size={16} color="#4a1a4a" /> : <Sun size={16} color="#ff8e53" />}
            </div>
          </div>
          <span>Rainy Day</span>
        </div>

        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="schedule">
            {(provided) => (
                <div 
                  className="timeline-container"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {schedule.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div 
                          className="timeline-item"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="timeline-dot"></div>
                          <div className="task-item timeline-card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '15px', padding: '15px' }}>
                            <div className="task-item-time" style={{ width: '80px', flexShrink: 0, marginTop: '5px' }}>{item.time}</div>
                            {item.imageUrl && <img src={item.imageUrl} alt={item.title} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} />}
                            <div className="task-item-details" style={{ flexGrow: 1, margin: 0 }}>
                              <div className="task-item-title">{item.title}</div>
                              
                              <div className="task-item-location" style={{ marginBottom: '10px', marginTop: '8px' }}>
                                <Map size={14} /> 
                                <a 
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location + ' ' + (formData?.city || savedTrip?.city || ''))}`}
                                  target="_blank" 
                                  rel="noreferrer"
                                  style={{ color: '#ea580c', textDecoration: 'none', marginLeft: '2px', fontWeight: '500' }}
                                >
                                  View on Map
                                </a> 
                                {item.aboutUrl && (
                                  <a href={item.aboutUrl} target="_blank" rel="noreferrer" style={{ marginLeft: '12px', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: '500' }}>
                                    <Info size={14} /> Learn More
                                  </a>
                                )}
                              </div>
                              
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                                  <MapPin size={12} /> {item.area || formData?.city || savedTrip?.city}
                                </div>
                                <div style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', background: 'rgba(234, 88, 12, 0.1)', color: '#ea580c', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                                  {item.type}
                                </div>
                              </div>
                            </div>
                            <div className="drag-handle" style={{ marginTop: '5px' }}>::</div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
            )}
          </Droppable>
        </DragDropContext>
      </motion.div>
    </div>
  );
}

export default Itinerary;
