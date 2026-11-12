const venues = require('./venues.json');
const { discoverVenues } = require('./venueDiscovery');

const profiles = [
  { name: 'Neighbourhood stroll', count: 2, radius: 1.6, interests: ['Nature', 'Food'] },
  { name: 'Culture trail', count: 3, radius: 3, interests: ['Museums', 'Art', 'Heritage'] },
  { name: 'City sampler', count: 4, radius: 4, interests: ['Shopping', 'Nature', 'Heritage'] }
];

function destination(value = '') {
  const input = value.trim().toLowerCase();
  if (input === 'kerala') return 'Kochi';
  if (input === 'bengaluru') return 'Bangalore';
  return Object.keys(venues).find(city => city.toLowerCase() === input) || value.trim();
}

function distance(a, b) {
  const rad = Math.PI / 180;
  const lat = (b.point[0] - a.point[0]) * rad;
  const lon = (b.point[1] - a.point[1]) * rad;
  const h = Math.sin(lat / 2) ** 2 + Math.cos(a.point[0] * rad) * Math.cos(b.point[0] * rad) * Math.sin(lon / 2) ** 2;
  return 12742 * Math.asin(Math.min(1, Math.sqrt(h)));
}

function transfer(a, b, budget) {
  const km = distance(a, b);
  const walking = km <= 0.9;
  const mode = walking ? 'Walk' : budget < 2500 ? 'Auto-rickshaw' : 'Taxi';
  const minutes = walking ? Math.max(3, Math.ceil(km * 1.45 * 15)) : 8 + Math.ceil(km * 1.45 * 4);
  return { km: Number(km.toFixed(2)), minutes, mode };
}

function asStop(place, city) {
  return { title: place.name, city, location: place.name, area: place.area, type: place.type,
    point: place.point, imageUrl: place.imageUrl, photoCreditUrl: place.photoCreditUrl,
    aboutUrl: place.aboutUrl, mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent([place.name, place.area, city, 'India'].filter(Boolean).join(', ')) };
}

function minutes(value) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return NaN;
  const [hours, mins] = value.split(':').map(Number);
  return hours * 60 + mins;
}

function clock(t) {
  const hours = Math.floor(t / 60);
  return (hours % 12 || 12) + ':' + String(t % 60).padStart(2, '0') + (hours < 12 ? ' AM' : ' PM');
}

// Evaluate small, bounded routes. Distance and the visit window constrain both weather versions.
function buildPlans(pool, city, options) {
  const { start, end, budget, interests, area } = options;
  const usedSets = new Set();
  const usedStops = new Set();
  const usedRain = new Set();
  const indoor = pool.filter(p => p.type === 'indoor');
  return profiles.map(profile => {
    let best;
    const visit = Math.min(50, end - start);
    function explore(path, elapsed, totalKm) {
      const last = path.at(-1);
      const key = path.map(p => p.name).sort().join('|');
      if (path.length && !usedSets.has(key)) {
        const score = 10 * path.length - totalKm + path.reduce((sum, p) => sum +
          (usedStops.has(p.name) ? 0 : 6) + (interests.includes(p.category) ? 3 : 0) +
          (area && p.area.toLowerCase().includes(area) ? 4 : 0) +
          (profile.interests.includes(p.category) ? 1 : 0), 0);
        if (!best || score > best.score) {
          const rainy = matchIndoor(path, indoor);
          const rainKey = rainy.map(p => p.name).sort().join('|');
          let required = visit * path.length;
          for (let i = 1; i < path.length; i++) required += Math.max(
            transfer(path[i-1],path[i],budget).minutes, transfer(rainy[i-1],rainy[i],budget).minutes);
          const localRain = rainy.every(p => rainy.every(q => distance(p,q) <= 4));
          if (!usedRain.has(rainKey) && localRain && required <= end - start) {
            best = { path: [...path], rainy, rainKey, score, key };
          }
        }
      }
      if (path.length >= Math.min(profile.count, indoor.length)) return;
      for (const place of pool) {
        if (path.includes(place) || path.some(p => distance(p, place) > profile.radius)) continue;
        const leg = last ? transfer(last, place, budget) : { minutes: 0, km: 0 };
        if (elapsed + visit + leg.minutes <= end - start)
          explore([...path, place], elapsed + visit + leg.minutes, totalKm + leg.km);
      }
    }
    explore([], 0, 0);
    if (!best) throw Object.assign(new Error('This destination needs more nearby photographed places for three routes.'), { statusCode: 422 });
    usedSets.add(best.key);
    best.path.forEach(p => usedStops.add(p.name));
    const rainy = best.rainy;
    usedRain.add(best.rainKey);
    let t = start;
    const schedule = [], rainySchedule = [];
    for (const [i, place] of best.path.entries()) {
      // Reserve enough time for the longer of the sunny and rainy transfers.
      if (i) t += visit + Math.max(transfer(best.path[i-1], place, budget).minutes, transfer(rainy[i-1], rainy[i], budget).minutes);

      const slot = { id: String(i + 1), time: clock(t) };
      schedule.push({ ...asStop(place, city), ...slot });
      rainySchedule.push({ ...asStop(rainy[i], city), ...slot });
    }
    return { name: profile.name, schedule, rainySchedule };
  });
}

function matchIndoor(path, indoor) {
  const reserved = new Set(path.filter(p => p.type === 'indoor').map(p => p.name));
  return path.map(place => {
    if (place.type === 'indoor') return place;
    const candidates = indoor.filter(p => !reserved.has(p.name)).sort((a,b) => distance(place,a) - distance(place,b));
    const replacement = candidates[0];
    if (!replacement) throw Object.assign(new Error('No distinct indoor alternative is available nearby.'), { statusCode: 422 });
    reserved.add(replacement.name);
    return replacement;
  });
}

async function generateTripPlan({city: input, area = '', timings, interests = [], option = 'option1', budget = 2500}) {
  const city = destination(input);
  const start = minutes(timings?.start ?? '09:00'), end = minutes(timings?.end ?? '18:00');
  if (!city || !(start < end) || !Number.isFinite(Number(budget)) || budget > 25000 || budget < 0) {
    throw Object.assign(new Error('Choose a destination, a valid time window and a budget up to ₹25,000.'), {statusCode: 400});
  }
  const pool = venues[city] || await discoverVenues(city);
  const plans = buildPlans(pool, city, {start, end, budget, interests, area: area.trim().toLowerCase()});
  const index = ['option1','option2','option3'].indexOf(option);
  const chosen = plans[Math.max(0,index)];
  const stops = [...chosen.schedule, ...chosen.rainySchedule];
  for (const stop of stops) {
    stop.transfersFrom = Object.fromEntries(stops.filter(p => p.title !== stop.title).map(p => [p.title, transfer(p,stop,budget)]));
  }
  const modes = chosen.schedule.slice(1).map((s,i) => s.transfersFrom[chosen.schedule[i].title].mode);
  return { ...chosen, transport: [...new Set(modes)].join(' + ') || 'Single stop',
    routes: plans.map(p => ({name:p.name, count:p.schedule.length})) };
}

async function applyRainyDay(schedule = [], requestedCity) {
  const city = destination(requestedCity || schedule[0]?.city || '');
  const pool = venues[city] || await discoverVenues(city);
  const indoor = pool.filter(p => p.type === 'indoor');
  const reserved = new Set(schedule.filter(s => s.type === 'indoor').map(s => s.title));
  return schedule.map(item => {
    const place = pool.find(p => p.name === item.title);
    if (item.type === 'indoor') return place ? {...item, ...asStop(place,city)} : item;
    const candidates = indoor.filter(p => !reserved.has(p.name));
    if (place) candidates.sort((a,b) => distance(place,a) - distance(place,b));
    const alternative = candidates[0] || indoor[0];
    reserved.add(alternative.name);
    return {...asStop(alternative,city), id:item.id, time:item.time};
  });
}

module.exports = { generateTripPlan, applyRainyDay };
