// Initialize the map
const map = L.map('map').setView([43.6532, -79.3832], 12); // Toronto coordinates

// Add a Tile Layer (OpenStreetMap for free usage)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Define empty layers for Property Ownership and Infrastructure
const propertyLayer = L.geoJSON(null, {
  style: { color: 'blue', fillOpacity: 0.5 }
}).addTo(map);

const infrastructureLayer = L.geoJSON(null, {
  style: { color: 'red', weight: 2 }
}).addTo(map);

// Fetch GeoJSON data and add it to layers
fetch('property_ownership.geojson')
  .then(res => res.json())
  .then(data => {
    propertyLayer.addData(data);
    console.log("Property ownership data loaded successfully");
  })
  .catch(err => console.error("Error loading property ownership data:", err));

fetch('infrastructure.geojson')
  .then(res => res.json())
  .then(data => {
    infrastructureLayer.addData(data);
    console.log("Infrastructure data loaded successfully");
  })
  .catch(err => console.error("Error loading infrastructure data:", err));

// Toggle Layers on Checkbox Change
document.getElementById('toggle-property').addEventListener('change', (e) => {
  e.target.checked ? map.addLayer(propertyLayer) : map.removeLayer(propertyLayer);
});

document.getElementById('toggle-infrastructure').addEventListener('change', (e) => {
  e.target.checked ? map.addLayer(infrastructureLayer) : map.removeLayer(infrastructureLayer);
});

// Force Map to Refresh Size
setTimeout(() => {
  map.invalidateSize();
}, 500);