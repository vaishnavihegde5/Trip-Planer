import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CloudRain, Compass, MapPin, Sun } from 'lucide-react';
import { mapsSearch } from './maps';
import jaipur from './assets/jaipur.webp';

export default function Home() {
  const [rain, setRain] = useState(false);
  const signedIn = Boolean(localStorage.getItem('user'));
  const stops = [
    ['08:00', rain ? 'Albert Hall Museum' : 'Amber Fort'],
    ['10:00', 'Tapri Central'],
    ['12:00', rain ? 'City Palace Museum' : 'Jal Mahal'],
  ];
  return <main className="travel-home">
    <header className="masthead">
      <span className="wordmark"><Compass aria-hidden="true"/> Smart Trip Planner</span>
      <Link to={signedIn ? '/dashboard' : '/login'}>{signedIn ? 'My trips' : 'Sign in'} <ArrowRight size={16}/></Link>
    </header>
    <section className="cover">
      <div className="cover-copy">
        <h1>Your trip,<br/><em>at your pace.</em></h1>
        <p>Build a day around the places you love. Move stops as you go, or switch to an indoor itinerary when the rain rolls in.</p>
        <Link className="cover-action" to={signedIn ? '/plan' : '/login'}>Plan my trip <ArrowRight size={18}/></Link>
      </div>
      <article className="sample">
        <div className="sample-photo">
          <img src={jaipur} alt="Amber Fort overlooking the lake in Jaipur"/>
          <div><small><MapPin size={14}/> Rajasthan, India</small><h2>Jaipur</h2></div>
        </div>
        <div className="sample-body">
          <div className="sample-heading"><h3>Sample itinerary</h3>
            <button className="weather-chip" aria-pressed={rain} onClick={() => setRain(!rain)}>{rain ? <CloudRain size={15}/> : <Sun size={15}/>} Rainy Day <i/></button>
          </div>
          <ol className="sample-stops" aria-live="polite">{stops.map(([time, place]) => <li key={time}><time>{time}</time><a href={mapsSearch(place, 'Jaipur')} target="_blank" rel="noreferrer" aria-label={`Find ${place} on Google Maps`}>{place}<MapPin size={14}/></a></li>)}</ol>
        </div>
      </article>
    </section>
  </main>;
}
