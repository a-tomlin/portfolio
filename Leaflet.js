// Initialize the map
const map = L.map('map').setView([43.6532, -79.3832], 12); // Toronto coordinates

// Add a Tile Layer (OpenStreetMap for free usage)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Load Property Ownership GeoJSON
const propertyLayer = L.geoJSON(null, {
  style: { color: 'blue', fillOpacity: 0.5 }
}).addTo(map);

// Load Infrastructure GeoJSON
const infrastructureLayer = L.geoJSON(null, {
  style: { color: 'red', weight: 2 }
}).addTo(map);

// Fetch GeoJSON data and add it to layers
fetch('property_ownership.geojson')
  .then(res => res.json())
  .then(data => propertyLayer.addData(data));

fetch('infrastructure.geojson')
  .then(res => res.json())
  .then(data => infrastructureLayer.addData(data));

// Toggle Layers
document.getElementById('toggle-property').addEventListener('change', (e) => {
  e.target.checked ? map.addLayer(propertyLayer) : map.removeLayer(propertyLayer);
});

document.getElementById('toggle-infrastructure').addEventListener('change', (e) => {
  e.target.checked ? map.addLayer(infrastructureLayer) : map.removeLayer(infrastructureLayer);
});