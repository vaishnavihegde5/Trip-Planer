// Custom destinations use geotagged Wikipedia articles with venue-specific Commons photos.
const cache = new Map();
async function discoverVenues(city) {
  if (cache.has(city)) return cache.get(city);
  async function query(params) {
    const url = new URL('https://en.wikipedia.org/w/api.php');
    url.search = new URLSearchParams({action:'query', format:'json', formatversion:'2', ...params});
    const response = await fetch(url, { signal: AbortSignal.timeout(7000) });
    if (!response.ok) throw new Error();
    return (await response.json()).query?.pages || [];
  }
  try {
    const pages = await query({titles:city, redirects:'1', prop:'coordinates'});
    const center = pages[0]?.coordinates?.[0];
    if (!center || center.lat < 6 || center.lat > 38 || center.lon < 68 || center.lon > 98) throw new Error();
    const nearby = await query({generator:'geosearch', ggscoord:center.lat+'|'+center.lon, ggsradius:'4000',
      ggslimit:'50', prop:'coordinates|pageimages', piprop:'thumbnail', pithumbsize:'360', pilicense:'free'});
    const places = nearby.flatMap(page => {
      const point = page.coordinates?.[0], url = page.thumbnail?.source;
      if (!point || !url?.includes('/commons/thumb/') || /\.svg/i.test(url)) return [];
      const name = page.title;
      const indoor = /museum|gallery|cathedral|church|temple|mosque|synagogue|library|mall/i.test(name);
      if (!indoor && !/fort|garden|park|ghat|tower|beach|memorial|monument/i.test(name)) return [];
      return [{name, area:'', category: /museum/i.test(name) ? 'Museums' : /gallery/i.test(name) ? 'Art' : /park|garden|beach/i.test(name) ? 'Nature' : 'Heritage',
        type:indoor ? 'indoor':'outdoor', point:[point.lat,point.lon], imageUrl:url,
        aboutUrl:'https://en.wikipedia.org/?curid='+page.pageid, photoCreditUrl:'https://commons.wikimedia.org/wiki/File:'+url.split('/').at(-2)}];
    }).slice(0,12);
    if (places.filter(p => p.type === 'indoor').length < 3) throw new Error();
    if (cache.size >= 50) cache.delete(cache.keys().next().value);
    cache.set(city, places);
    return places;
  } catch {
    throw Object.assign(new Error('We couldn’t find enough nearby places with photos here. Try one of the featured destinations.'), {statusCode:422});
  }
}
module.exports = { discoverVenues };
