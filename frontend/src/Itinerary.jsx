import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mapsSearch } from './maps';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { CloudRain, Sun, ArrowLeft, ExternalLink, GripVertical, MapPin } from 'lucide-react';

function Itinerary() {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;
  const savedTrip = location.state?.savedTrip;
  
  const [sunnySchedule, setSchedule] = useState(() => {
    const stored = savedTrip?.schedule;
    if (Array.isArray(stored)) return stored;
    try { return JSON.parse(stored || '[]'); } catch { return []; }
  });
  const [loading, setLoading] = useState(!savedTrip);
  const [isRainy, setIsRainy] = useState(false);
  const [activeOption, setActiveOption] = useState('option1');

  const [alternatives, setAlternatives] = useState(null);
  const [weatherBusy, setWeatherBusy] = useState(false);
  const [error, setError] = useState('');
  const schedule = isRainy && alternatives
    ? sunnySchedule.map(item => ({ ...alternatives.get(item.id), time: item.time }))
    : sunnySchedule;

  const fetchPlan = async (option = 'option1') => {
    setLoading(true);
    setError('');
    try {
      const payload = formData ? { ...formData, option } : { city: savedTrip?.city, option };
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.schedule)) throw new Error();
      setActiveOption(option);
      setAlternatives(data.rainySchedule ? new Map(data.rainySchedule.map(item => [item.id, item])) : null);
      setIsRainy(false);
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
      setError("We couldn’t load this itinerary. Choose a route to try again.");
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
    if (alternatives) {
      setIsRainy(!isRainy);
      return;
    }
    setWeatherBusy(true);
    setError('');
    try {
      const response = await fetch('/api/plan/rainy-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule: sunnySchedule, city: formData?.city || savedTrip?.city })
      });
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.schedule)) throw new Error();
      const byId = new Map(data.schedule.map(item => [item.id, item]));
      if (!sunnySchedule.every(item => byId.has(item.id))) throw new Error();
      setAlternatives(byId);
      setIsRainy(true);
    } catch {
      setError('Indoor alternatives could not be loaded. Try Rainy Day again.');
    } finally {
      setWeatherBusy(false);
    }
  };

  const handleOnDragEnd = ({ source, destination }) => {
    if (!destination || destination.index === source.index) return;
    const items = [...sunnySchedule];
    const [moved] = items.splice(source.index, 1);
    items.splice(destination.index, 0, moved);
    setSchedule(items.map((item, index) => ({ ...item, time: sunnySchedule[index].time })));
  };

  if (loading) {
    return (
      <div className="app-container">
        <h2 className="title" style={{ animation: 'pulse 1.5s infinite' }}>Planning your trip...</h2>
      </div>
    );
  }

  const city = sunnySchedule[0]?.city || formData?.city || savedTrip?.city;
  return (
    <main className="day-guide">
      <header className="guide-nav">
        <button onClick={() => navigate('/plan')}><ArrowLeft size={16}/> Plan a trip</button>
        <button onClick={() => navigate('/dashboard')}>My trips</button>
      </header>
      <div className="guide-heading">
        <p><MapPin size={15}/> {city}, India</p>
        <h1>Your day in <em>{city}</em></h1>
        <span>{schedule.length} stops {schedule.length > 0 && <> · {schedule[0].time} – {schedule.at(-1).time}</>}</span>
      </div>
      <div className="guide-layout">
        <aside className="guide-options">
          <h2>Plan options</h2>
          <div className="route-options">{['option1','option2','option3'].map((option,index) => (
            <button key={option} aria-pressed={activeOption === option} disabled={weatherBusy}
              onClick={() => fetchPlan(option)}>Route {index + 1}</button>
          ))}</div>
          <button className="weather-chip weather-control" aria-pressed={isRainy}
            disabled={weatherBusy || !schedule.length} onClick={toggleRainyDay}>
            {isRainy ? <CloudRain size={18}/> : <Sun size={18}/>}
            {weatherBusy ? 'Finding stops…' : 'Rainy Day'} <i/>
          </button>
          <p>{isRainy ? 'Indoor stops are showing. Switch back to restore your outdoor stops.' : 'Swap outdoor stops for indoor alternatives in this destination.'}</p>
        </aside>
        <section className="guide-list">
          <h2>Day itinerary</h2>
          <p className="schedule-note">Suggested times · Drag a grip to change the order.</p>
          {error && <p role="alert">{error}</p>}
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="schedule">{provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {schedule.map((item,index) => (
                  <Draggable key={item.id} draggableId={String(item.id)} index={index}>{drag => (
                    <article className="stop-card" ref={drag.innerRef} {...drag.draggableProps}>
                      <div className="stop-meta"><time>{item.time}</time><span>{item.type}</span></div>
                      <div className="stop-content">
                        {item.photoCreditUrl && item.imageUrl && <a className="stop-photo" href={item.photoCreditUrl}
                          target="_blank" rel="noreferrer" aria-label={`Photo credits for ${item.title}`}>
                          <img src={item.imageUrl} alt={item.title} loading="lazy"
                            onError={event => { event.currentTarget.hidden = true; }}/>
                        </a>}
                        <div><h3>{item.title}</h3><p>{[item.area,city].filter(Boolean).join(', ')}</p>
                          <a className="map-link" target="_blank" rel="noreferrer"
                            href={item.mapsUrl || mapsSearch(item.title, item.area, city)}>
                            Google Maps <ExternalLink size={13}/>
                          </a>
                          {item.aboutUrl && <a className="place-info" href={item.aboutUrl} target="_blank" rel="noreferrer">Place info</a>}
                        </div>
                      </div>
                      <span className="grip" {...drag.dragHandleProps} aria-label={`Move ${item.title}`}><GripVertical size={18}/></span>
                    </article>
                  )}</Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}</Droppable>
          </DragDropContext>
        </section>
      </div>
    </main>
  );
}

export default Itinerary;
