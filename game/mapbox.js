// MAPBOX.JS

const MAPBOX_TOKEN = 'pk.eyJ1IjoiaGlqaWFuZ3RhbyIsImEiOiJjampxcjFnb3E2NTB5M3BvM253ZHV5YjhjIn0.WneUon5qFigfJRJ3oaZ3Ow';
const BASE_URL = 'https://api.mapbox.com/directions/v5/mapbox/walking';

/**
 * Fetch walking route and call callback with array of {lat, lon}.
 */
window.getRoute = async function(originLonLat, destLonLat) {
  const url = `${BASE_URL}/${originLonLat[0]},${originLonLat[1]};${destLonLat[0]},${destLonLat[1]}?geometries=geojson&steps=true&access_token=${MAPBOX_TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Mapbox error: ' + res.statusText);
  const data = await res.json();
  return data.routes[0].legs[0].steps.map(step => ({
    lat: step.maneuver.location[1],
    lon: step.maneuver.location[0]
  }));
};