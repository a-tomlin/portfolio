// Create the map
const map = L.map('map').setView([43.6, -79.6], 11);

// Add base map layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Declare layer variables
let wifiLayer = null;
let miWayLayer = null;

// Load WiFi layer
fetch('WiFi.geojson')
  .then(res => res.json())
  .then(data => {
    wifiLayer = L.geoJSON(data, {
      pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
        radius: 6,
        fillColor: 'blue',
        color: 'darkblue',
        weight: 1,
        fillOpacity: 0.7
      }),
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`WiFi: ${feature.properties?.DESCRIPT || 'No description'}`);
      }
    }).addTo(map);

    setupToggle('toggle-wifi', wifiLayer);
  });

// Load MiWay layer
fetch('MiWay_StopsRoutes.geojson')
  .then(res => res.json())
  .then(data => {
    miWayLayer = L.geoJSON(data, {
      style: {
        color: 'green',
        weight: 2
      },
      onEachFeature: (feature, layer) => {
        const route = feature.properties?.ROUTE_NAME || feature.properties?.StopNumber || 'N/A';
        layer.bindPopup(`Route: ${route}`);
      }
    }).addTo(map);

    setupToggle('toggle-miway', miWayLayer);
  });

// Helper function to set up checkbox toggling
function setupToggle(checkboxId, layer) {
  const checkbox = document.getElementById(checkboxId);
  checkbox.addEventListener('change', function () {
    if (checkbox.checked) {
      map.addLayer(layer);
    } else {
      map.removeLayer(layer);
    }
  });
}
