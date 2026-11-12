import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Compass, MapPin } from 'lucide-react';

const destinations = [
  ['Mumbai','Gateway of India','gateway-of-india'], ['Delhi','India Gate','india-gate'],
  ['Bangalore','Cubbon Park','cubbon-park'], ['Jaipur','Hawa Mahal','hawa-mahal'],
  ['Goa','Old Goa','basilica-of-bom-jesus'], ['Kochi','Fort Kochi','fort-kochi-beach'],
  ['Agra','Taj Mahal','taj-mahal'], ['Udaipur','City Palace','city-palace-udaipur']
];
const interestsList = ['Heritage','Museums','Nature','Food','Art','Shopping'];
const money = value => '₹' + Number(value).toLocaleString('en-IN');

export default function Wizard() {
  const navigate = useNavigate();
  const [city,setCity] = useState('');
  const [area,setArea] = useState('');
  const [start,setStart] = useState('09:00'), [end,setEnd] = useState('18:00');
  const [budget,setBudget] = useState(2500);
  const [interests,setInterests] = useState([]);
  const [custom,setCustom] = useState('');
  const [additional,setAdditional] = useState([]);
  const guest = sessionStorage.getItem('guest') === 'yes' && !localStorage.getItem('user');
  useEffect(() => {
    if (!guest && !localStorage.getItem('user')) navigate('/login');
  }, [guest,navigate]);

  function toggle(name) {
    setInterests(current => current.includes(name) ? current.filter(i => i !== name) : [...current,name].slice(0,5));
  }
  function addInterest() {
    const name = custom.trim();
    if (!name || interests.length >= 5) return;
    const existing = [...interestsList,...additional].find(i => i.toLowerCase() === name.toLowerCase());
    if (!existing) setAdditional([...additional,name]);
    if (!interests.includes(existing || name)) setInterests([...interests,existing || name]);
    setCustom('');
  }
  function submit(event) {
    event.preventDefault();
    if (!city.trim() || !start || end <= start) return;
    navigate('/itinerary',{state:{formData:{city:city.trim(),area:area.trim(),timings:{start,end},budget,interests}}});
  }
  return <main className="planner-page">
    <header className="guide-nav"><span className="wordmark"><Compass/> Smart Trip Planner</span>
      <button onClick={() => navigate(guest ? '/login':'/dashboard')}>{guest ? 'Guest · Sign in':'My trips'}</button></header>
    <div className="planner-intro"><h1>Plan your <em>day out.</em></h1><p>Pick a destination and we’ll put together three nearby routes for your day.</p></div>
    <form onSubmit={submit} className="planner-form">
      <section className="selection-panel"><h2>Destination</h2>
        <div className="destination-grid">{destinations.map(([name,area,photo]) => <button key={name} type="button" aria-pressed={city === name}
          onClick={() => setCity(name)}><img src={'/places/'+photo+'.webp'} alt=""/><span><strong>{name}</strong><small>{area}</small></span>
          {city === name && <Check size={17}/>}</button>)}</div>
        <div className="field-grid"><label>City or another Indian destination<input required value={city} onChange={e => setCity(e.target.value)} placeholder="Enter a city"/></label>
        <label>Preferred neighbourhood <small>(optional)</small><input value={area} onChange={e => setArea(e.target.value)} placeholder="e.g. Old City"/></label></div>
      </section>
      <section className="selection-panel"><h2>Your day</h2><div className="field-grid"><label>Start time<input type="time" required value={start} onChange={e => setStart(e.target.value)}/></label>
        <label>Finish by<input type="time" required value={end} onChange={e => setEnd(e.target.value)}/></label></div>
        {end <= start && <p role="alert">Choose a finish time after your start time.</p>}
        <div className="budget-heading"><label htmlFor="trip-budget">Day budget</label><output htmlFor="trip-budget">{money(budget)}</output></div>
        <input id="trip-budget" className="budget-range" type="range" min="100" max="25000" step="100" value={budget}
          aria-valuetext={money(budget)} style={{'--fill':((budget-100)/24900)*100+'%'}} onChange={e => setBudget(Number(e.target.value))}/>
        <div className="range-ends"><span>₹100</span><span>₹25,000</span></div>
        <div className="pick-chips">{[1000,2500,5000,10000,25000].map(n => <button key={n} type="button" aria-pressed={n===budget} onClick={() => setBudget(n)}>{money(n)}</button>)}</div>
      </section>
      <section className="selection-panel"><div className="selection-title"><h2>Your interests</h2><span>{interests.length} / 5</span></div>
        <div className="pick-chips">{[...interestsList,...additional].map(name => <button type="button" key={name} aria-pressed={interests.includes(name)}
          disabled={interests.length===5 && !interests.includes(name)} onClick={() => toggle(name)}>{interests.includes(name) && <Check size={14}/>} {name}</button>)}</div>
        <div className="custom-interest"><input aria-label="Custom interest" value={custom} placeholder="Add another interest" onChange={e => setCustom(e.target.value)}
          onKeyDown={e => {if(e.key==='Enter'){e.preventDefault();addInterest();}}}/><button type="button" disabled={!custom.trim() || interests.length===5} onClick={addInterest}>Add</button></div>
      </section>
      <div className="plan-submit"><span><MapPin size={16}/> Travel mode is suggested for each leg.</span><button className="cover-action" disabled={!city.trim() || !start || !end || end <= start}>Build my routes <ArrowRight size={18}/></button></div>
    </form>
  </main>;
}
