// Initialize map centered around Mississauga/Toronto
var map = L.map('map').setView([43.6, -79.6], 11);

// Add base tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Layer holders
let wifiLayer, miWayLayer;

// Function to load GeoJSON data
function loadGeoJSON(url, layerType) {
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load ${url}`);
      return res.json();
    })
    .then(data => {
      if (layerType === 'wifi') {
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
      } else if (layerType === 'miway') {
        miWayLayer = L.geoJSON(data, {
          style: {
            color: 'green',
            weight: 2
          },
          onEachFeature: (feature, layer) => {
            const route = feature.properties?.Route || feature.properties?.StopNumber || 'N/A';
            layer.bindPopup(`Route: ${route}`);
          }
        }).addTo(map);
      }
    })
    .catch(error => console.error(error.message));
}

// Load GeoJSON data
loadGeoJSON('WiFi.geojson', 'wifi');
loadGeoJSON('MiWay_StopsRoutes.geojson', 'miway');

// Toggle functionality for WiFi layer
document.getElementById('toggle-wifi').addEventListener('change', function (e) {
  if (wifiLayer) {
    e.target.checked ? map.addLayer(wifiLayer) : map.removeLayer(wifiLayer);
  }
});

// Toggle functionality for MiWay layer
document.getElementById('toggle-transit').addEventListener('change', function (e) {
  if (miWayLayer) {
    e.target.checked ? map.addLayer(miWayLayer) : map.removeLayer(miWayLayer);
  }
});
