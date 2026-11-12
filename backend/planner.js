const photos = require('./placePhotos.json');

const realPlacesDB = {
  Mumbai: [
    { name: 'Gateway of India', area: 'Colaba', type: 'outdoor', keyword: 'monument' },
    { name: 'Prithvi Cafe', area: 'Juhu', type: 'indoor', keyword: 'cafe' },
    { name: 'Sanjay Gandhi National Park', area: 'Borivali', type: 'outdoor', keyword: 'park' },
    { name: 'Leopold Cafe', area: 'Colaba', type: 'indoor', keyword: 'restaurant' },
    { name: 'Dr. Bhau Daji Lad Museum', area: 'Byculla', type: 'indoor', keyword: 'museum' },
    { name: 'Marine Drive', area: 'Churchgate', type: 'outdoor', keyword: 'landscape' },
    { name: 'Bandra Fort', area: 'Bandra', type: 'outdoor', keyword: 'landscape' },
    { name: 'The Bombay Canteen', area: 'Lower Parel', type: 'indoor', keyword: 'restaurant' }
  ],
  Delhi: [
    { name: 'India Gate', area: 'Rajpath', type: 'outdoor', keyword: 'monument' },
    { name: 'United Coffee House', area: 'Connaught Place', type: 'indoor', keyword: 'cafe' },
    { name: 'Lodhi Gardens', area: 'Lodhi Estate', type: 'outdoor', keyword: 'park' },
    { name: "Karim's", area: 'Old Delhi', type: 'indoor', keyword: 'restaurant' },
    { name: 'National Museum', area: 'Janpath', type: 'indoor', keyword: 'museum' },
    { name: 'Hauz Khas Fort', area: 'Hauz Khas', type: 'outdoor', keyword: 'landscape' },
    { name: 'Qutub Minar', area: 'Mehrauli', type: 'outdoor', keyword: 'monument' },
    { name: 'Indian Accent', area: 'Lodhi Road', type: 'indoor', keyword: 'restaurant' }
  ],
  Bangalore: [
    { name: 'Bangalore Palace', area: 'Vasanth Nagar', type: 'outdoor', keyword: 'palace' },
    { name: 'Third Wave Coffee', area: 'Indiranagar', type: 'indoor', keyword: 'cafe' },
    { name: 'Lalbagh Botanical Garden', area: 'Mavalli', type: 'outdoor', keyword: 'park' },
    { name: 'Vidyarthi Bhavan', area: 'Basavanagudi', type: 'indoor', keyword: 'restaurant' },
    { name: 'Visvesvaraya Museum', area: 'Kasturba Road', type: 'indoor', keyword: 'museum' },
    { name: 'Cubbon Park', area: 'Ambedkar Veedhi', type: 'outdoor', keyword: 'park' },
    { name: 'Nandi Hills', area: 'Chikkaballapur', type: 'outdoor', keyword: 'landscape' },
    { name: 'Toit Brewpub', area: 'Indiranagar', type: 'indoor', keyword: 'restaurant' }
  ],
  Jaipur: [
    { name: 'City Palace Museum', area: 'Old City', type: 'indoor', keyword: 'museum' },
    { name: 'Anokhi Museum of Hand Printing', area: 'Amer', type: 'indoor', keyword: 'museum' },
    { name: 'Hawa Mahal', area: 'Badi Choupad', type: 'outdoor', keyword: 'palace' },
    { name: 'Tapri Central', area: 'C-Scheme', type: 'indoor', keyword: 'cafe' },
    { name: 'Central Park', area: 'Rambagh', type: 'outdoor', keyword: 'park' },
    { name: 'Chokhi Dhani', area: 'Tonk Road', type: 'outdoor', keyword: 'restaurant' },
    { name: 'Albert Hall Museum', area: 'Ram Niwas Garden', type: 'indoor', keyword: 'museum' },
    { name: 'Amer Fort', area: 'Amer', type: 'outdoor', keyword: 'monument' },
    { name: 'Jal Mahal', area: 'Amer Road', type: 'outdoor', keyword: 'landscape' },
    { name: 'Suvarna Mahal', area: 'Rambagh Palace', type: 'indoor', keyword: 'restaurant' }
  ],
  Goa: [
    { name: 'Basilica of Bom Jesus', area: 'Old Goa', type: 'indoor', keyword: 'church' },
    { name: 'Artjuna Cafe', area: 'Anjuna', type: 'indoor', keyword: 'cafe' },
    { name: 'Dudhsagar Falls', area: 'Sanguem', type: 'outdoor', keyword: 'landscape' },
    { name: 'Thalassa', area: 'Siolim', type: 'indoor', keyword: 'restaurant' },
    { name: 'Goa State Museum', area: 'Panaji', type: 'indoor', keyword: 'museum' },
    { name: 'Baga Beach', area: 'Baga', type: 'outdoor', keyword: 'landscape' },
    { name: 'Aguada Fort', area: 'Candolim', type: 'outdoor', keyword: 'monument' },
    { name: 'Gunpowder', area: 'Assagao', type: 'indoor', keyword: 'restaurant' }
  ],
  Kochi: [
    { name: 'Chinese Fishing Nets', area: 'Fort Kochi', type: 'outdoor', keyword: 'landscape' },
    { name: 'Fort Kochi Beach', area: 'Fort Kochi', type: 'outdoor', keyword: 'park' },
    { name: 'Kashi Art Cafe', area: 'Fort Kochi', type: 'indoor', keyword: 'cafe' },
    { name: 'Mattancherry Palace', area: 'Mattancherry', type: 'indoor', keyword: 'palace' },
    { name: 'Indo-Portuguese Museum', area: 'Fort Kochi', type: 'indoor', keyword: 'museum' },
    { name: 'Indian Naval Maritime Museum', area: 'Fort Kochi', type: 'indoor', keyword: 'museum' }
  ],
  Agra: [
    { name: 'Agra Art Gallery', area: 'Tajganj', type: 'indoor', keyword: 'museum' },
    { name: 'Taj Museum', area: 'Taj Mahal complex', type: 'indoor', keyword: 'museum' },
    { name: 'Taj Mahal', area: 'Tajganj', type: 'outdoor', keyword: 'monument' },
    { name: 'Sheroes Hangout', area: 'Fatehabad Road', type: 'indoor', keyword: 'cafe' },
    { name: 'Mehtab Bagh', area: 'Dharmapuri', type: 'outdoor', keyword: 'park' },
    { name: 'Pinch of Spice', area: 'Sanjay Place', type: 'indoor', keyword: 'restaurant' },
    { name: 'Agra Fort', area: 'Rakabganj', type: 'outdoor', keyword: 'monument' },
    { name: 'Tomb of Itimad-ud-Daulah', area: 'Moti Bagh', type: 'outdoor', keyword: 'monument' },
    { name: 'Fatehpur Sikri', area: 'Fatehpur Sikri', type: 'outdoor', keyword: 'monument' },
    { name: 'Peshawri', area: 'Tajganj', type: 'indoor', keyword: 'restaurant' }
  ],
  Udaipur: [
    { name: 'Bagore Ki Haveli', area: 'Gangaur Ghat', type: 'indoor', keyword: 'museum' },
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

const interestKeywords = {
  heritage: ['monument', 'palace', 'church'], museums: ['museum'], art: ['museum', 'palace'],
  nature: ['park', 'lake', 'landscape'], adventure: ['park', 'landscape'],
  'street food': ['restaurant', 'cafe'], nightlife: ['restaurant'], cultural: ['museum', 'palace', 'monument']
};

function destination(value = '') {
  const name = value.trim().toLowerCase();
  if (name === 'kerala') return 'Kochi';
  if (name === 'bengaluru') return 'Bangalore';
  return Object.keys(realPlacesDB).find(city => city.toLowerCase() === name) || value.trim();
}

function discoveryPlace(keyword, area, type) {
  return { name: 'Find ' + keyword, area, type, keyword, searchTerm: keyword };
}

function stop(place, city) {
  const query = [place.searchTerm || place.name, place.area, city, 'India'].filter(Boolean).join(', ');
  return {
    title: place.name, location: place.searchTerm || place.name, area: place.area, city,
    type: place.type, mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query),
    ...photos[place.name]
  };
}

function applyRainyDay(schedule = [], requestedCity) {
  const inferredCity = Object.keys(realPlacesDB).find(key =>
    schedule.some(item => realPlacesDB[key].some(p => p.name === item.title)));
  const city = destination(requestedCity || schedule[0]?.city || inferredCity || '');
  const indoorSearches = ['art galleries', 'libraries', 'indoor shopping centres', 'museums'];
  let searchIndex = 0;
  const used = new Set(schedule.filter(item => item.type === 'indoor').map(item => item.title));
  const indoor = (realPlacesDB[city] || []).filter(place => place.type === 'indoor');
  return schedule.map(item => {
    if (item.type !== 'outdoor') return item;
    const available = indoor.filter(place => !used.has(place.name));
    const place = available.find(place => place.area === item.area) || available[0]
      || discoveryPlace(indoorSearches[searchIndex++ % indoorSearches.length], item.area, 'indoor');
    used.add(place.name);
    return { ...stop(place, city), id: item.id, time: item.time };
  });
}

function minutes(value) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return NaN;
  const [hours, mins] = value.split(':').map(Number);
  return hours * 60 + mins;
}

function generateTripPlan({ city: rawCity, area = '', timings, interests = [], vibe, option, transport }) {
  const city = destination(rawCity);
  const start = minutes(timings?.start ?? '09:00');
  const end = minutes(timings?.end ?? '18:00');
  if (!city || !(start < end)) {
    throw Object.assign(new Error('Choose a city and an end time after your start time.'), { statusCode: 400 });
  }
  const district = area.trim().toLowerCase();
  const places = realPlacesDB[city] || [
    discoveryPlace('local landmarks', area, 'outdoor'), discoveryPlace('museums', area, 'indoor'),
    discoveryPlace('parks', area, 'outdoor'), discoveryPlace('cafes', area, 'indoor')
  ];
  const wanted = [...interests, vibe || ''].flatMap(i => interestKeywords[i.toLowerCase()] || [i.toLowerCase()]);
  const offset = option === 'option2' ? 2 : option === 'option3' ? 3 : 0;
  const rotated = [...places.slice(offset), ...places.slice(0, offset)];
  const score = place => (district && place.area.toLowerCase().includes(district) ? 5 : 0)
    + wanted.filter(word => word && place.keyword.includes(word)).length;
  let ranked = rotated.sort((a,b) => score(b) - score(a));
  if (transport === 'Walking') {
    const near = ranked[0].area;
    ranked = ranked.filter(place => place.area === near);
  }
  const duration = vibe === 'relaxed' ? 120 : 90;
  const count = Math.min(4, ranked.length, Math.max(1, Math.floor((end - start) / duration)));
  const schedule = ranked.slice(0,count).map((place,i) => {
    const t = start + Math.floor(i * (end-start) / count);
    const hours = Math.floor(t/60);
    const time = (hours % 12 || 12) + ':' + String(t%60).padStart(2,'0') + (hours < 12 ? ' AM' : ' PM');
    return { ...stop(place, city), id: String(i + 1), time };
  });
  return { schedule, rainySchedule: applyRainyDay(schedule, city) };
}

module.exports = { generateTripPlan, applyRainyDay };
