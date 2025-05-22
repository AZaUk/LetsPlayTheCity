// AR-UTILS.JS

/**
 * Place a 3D model at given GPS coords in the A-Frame scene.
 * @param {number} lat
 * @param {number} lon
 * @param {string} modelUrl
 * @param {number} scale
 */
window.placeModel = function(lat, lon, modelUrl, scale = 1) {
  const scene = document.querySelector('a-scene');
  const entity = document.createElement('a-entity');
  entity.setAttribute('gps-entity-place', `latitude: ${lat}; longitude: ${lon}`);
  entity.setAttribute('gltf-model', modelUrl);
  entity.setAttribute('scale', `${scale} ${scale} ${scale}`);
  scene.appendChild(entity);
  console.log(`Placed model at ${lat}, ${lon}`);
}

/**
 * Test helper to place a cone at a sample location near you.
 * Coordinates here are for testing — replace with your target lat/lon.
 */
window.placeTestObject = () => {
  const testLat = 41.3925376;
  const testLon = 2.1561344;
  placeModel(testLat, testLon, 'https://cdn.aframe.io/test-models/models/glTF-2.0/virtualcity/VC.gltf');
};

let directionalArrow = null;

window.placeDirectionalArrow = function(destination) {
  const scene = document.querySelector('a-scene');

  // Create only one arrow
  if (!directionalArrow) {
    directionalArrow = document.createElement('a-image');
    directionalArrow.setAttribute('src', '#arrow-icon');
    directionalArrow.setAttribute('scale', '5 5 5');
    directionalArrow.setAttribute('position', '0 0 5'); // In front of camera
    directionalArrow.setAttribute('look-at', '[gps-camera]');
    directionalArrow.setAttribute('class', 'non-interactive');
    directionalArrow.setAttribute('rotation', '180 0 0');
    directionalArrow.setAttribute('visible', 'true');

    // Attach to camera so it always faces forward
    scene.appendChild(directionalArrow); // Fallback
  }

  // Update logic for rotation
  window.updateArrowDirection(destination);
};

window.updateArrowDirection = function(destination) {
  // Watch location + orientation
  if (!destination) return;

  navigator.geolocation.watchPosition(pos => {
    const user = {
      lat: pos.coords.latitude,
      lon: pos.coords.longitude
    };

    const bearing = window.computeBearing(user, destination);

    const arrow = directionalArrow;
    if (arrow) {
      arrow.setAttribute('rotation', `0 ${bearing} 0`);
    }
  }, console.error, { enableHighAccuracy: true });
};


/**
 * Haversine distance (meters)
 */
window.computeDistance = (a, b) => {
  const R = 6371000;
  const φ1 = a.lat * Math.PI/180, φ2 = b.lat * Math.PI/180;
  const Δφ = (b.lat - a.lat) * Math.PI/180;
  const Δλ = (b.lon - a.lon) * Math.PI/180;
  const x = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
  return R * c;
};

/**
 * Bearing from a→b in degrees
 */
window.computeBearing = (a, b) => {
  const φ1 = a.lat * Math.PI/180, φ2 = b.lat * Math.PI/180;
  const λ1 = a.lon * Math.PI/180, λ2 = b.lon * Math.PI/180;
  const y = Math.sin(λ2-λ1) * Math.cos(φ2);
  const x = Math.cos(φ1)*Math.sin(φ2) -
            Math.sin(φ1)*Math.cos(φ2)*Math.cos(λ2-λ1);
  return (Math.atan2(y, x)*180/Math.PI + 360) % 360;
};