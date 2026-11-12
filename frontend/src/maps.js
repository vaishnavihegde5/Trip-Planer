export function mapsSearch(...parts) {
  const query = [...parts.filter(Boolean), 'India'].join(', ');
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
}
