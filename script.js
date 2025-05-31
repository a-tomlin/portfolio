// Create map centered around Mississauga/Toronto
var map = L.map('map').setView([43.6, -79.6], 11);

// Add base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Layer placeholders
let wifiLayer, miWayLayer;

// Load WiFi.geojson
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
      }).bindPopup(feature.properties?.Name || 'WiFi Point')
    }).addTo(map);
  });

// Load MiWay_StopsRoutes.geojson
fetch('MiWay_StopsRoutes.geojson')
  .then(res => res.json())
  .then(data => {
    miWayLayer = L.geoJSON(data, {
      style: {
        color: 'green',
        weight: 2
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(feature.properties?.ROUTE_NAME || 'Route');
      }
    }).addTo(map);
  });

// Checkbox toggles
document.getElementById('toggle-property').addEventListener('change', function (e) {
  if (wifiLayer) {
    e.target.checked ? map.addLayer(wifiLayer) : map.removeLayer(wifiLayer);
  }
});
document.getElementById('toggle-infrastructure').addEventListener('change', function (e) {
  if (miWayLayer) {
    e.target.checked ? map.addLayer(miWayLayer) : map.removeLayer(miWayLayer);
  }
});
