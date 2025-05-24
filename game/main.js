window.addEventListener('load', () => {
  const overlay = document.getElementById('overlay');

  // Request camera (handled by AR.js upon scene load)
  overlay.innerText = 'Requesting location permission…';

  navigator.geolocation.watchPosition(pos => {
    const lat = pos.coords.latitude, lon = pos.coords.longitude;
    map.setCenter([lon, lat]);
  }, err => console.error(err), { enableHighAccuracy: true });


  // Request geolocation
  if (!navigator.geolocation) {
    overlay.innerText = 'Geolocation not supported by this browser.';
    return;
  }

  // Init mini‑map
  mapboxgl.accessToken = 'pk.eyJ1IjoiaGlqaWFuZ3RhbyIsImEiOiJjampxcjFnb3E2NTB5M3BvM253ZHV5YjhjIn0.WneUon5qFigfJRJ3oaZ3Ow';
  const map = new mapboxgl.Map({
    container: 'mini-map',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 16,
    pitch: 60,
    bearing: 0,
    interactive: true
  });

  navigator.geolocation.getCurrentPosition(async pos => {
    const lat = pos.coords.latitude, lon = pos.coords.longitude;
    overlay.innerText = 'Calculating route…';

    const waypoint = [1.730498126567631, 41.22088936842049]; // [lon, lat]
    const steps = await window.getRoute([lon,lat], waypoint);

    // 1) Draw AR blue line
    overlay.innerText = 'Drawing AR route…';
    window.placeDirectionalArrow({ lat: waypoint[1], lon: waypoint[0] });

    // 2) Draw 2D line on mini‑map
    overlay.innerText = 'Rendering map overlay…';
    const coords = steps.map(pt => [pt.lon, pt.lat]);
    map.setCenter(coords[0]);
    map.addSource('route', {
      type: 'geojson',
      data: { type: 'Feature', geometry: { type: 'LineString', coordinates: coords }}
    });
    map.addLayer({
      id: 'route', type: 'line', source: 'route',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#007aff', 'line-width': 4 }
    });

    overlay.innerText = 'Follow the blue line!';
  }, err => overlay.innerText = 'Error: '+err.message,
     { enableHighAccuracy: true });

  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().then(response => {
        if (response === 'granted') {
          window.addEventListener('deviceorientationabsolute', e => {
            if (e.absolute && e.alpha != null) {
              map.setBearing(360 - e.alpha);
            }
          });
        }
      }).catch(console.error);
    } else {
      // Android or older browsers
      window.addEventListener('deviceorientationabsolute', e => {
        if (e.alpha != null) {
          map.setBearing(360 - e.alpha);
        }
      });
    }
});