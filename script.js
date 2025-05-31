// Create map centered around Mississauga/Toronto
var map = L.map('map').setView([43.6, -79.6], 11);

// Add base tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Layer holders
let wifiLayer, miWayLayer;

// Load WiFi.geojson and add to map
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
  });

// Load MiWay_StopsRoutes.geojson and add to map
fetch('MiWay_StopsRoutes.geojson')
  .then(res => res.json())
  .then(data => {
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
  });

// Checkbox toggle for WiFi layer
document.getElementById('toggle-wifi').addEventListener('change', function (e) {
  if (wifiLayer) {
    e.target.checked ? map.addLayer(wifiLayer) : map.removeLayer(wifiLayer);
  }
});

// Checkbox toggle for MiWay layer
document.getElementById('toggle-transit').addEventListener('change', function (e) {
  if (miWayLayer) {
    e.target.checked ? map.addLayer(miWayLayer) : map.removeLayer(miWayLayer);
  }
});
