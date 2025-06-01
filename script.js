// Initialize map centered on Mississauga
const map = L.map('map').setView([43.6, -79.6], 11);

// Add OpenStreetMap base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Placeholder for layers
let wifiLayer;
let miWayLayer;

// Load WiFi GeoJSON
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

    // Setup toggle once layer is ready
    const wifiCheckbox = document.getElementById('toggle-wifi');
    wifiCheckbox.addEventListener('change', () => {
      if (wifiCheckbox.checked) {
        map.addLayer(wifiLayer);
      } else {
        map.removeLayer(wifiLayer);
      }
    });
  });

// Load MiWay GeoJSON
fetch('MiWay_StopsRoutes.geojson')
  .then(res => res.json())
  .then(data => {
    miWayLayer = L.geoJSON(data, {
      style: {
        color: 'green',
        weight: 2
      },
      onEachFeature: (feature, layer) => {
        const label = feature.properties?.ROUTE_NAME || feature.properties?.StopNumber || 'N/A';
        layer.bindPopup(`Route: ${label}`);
      }
    }).addTo(map);

    // Setup toggle once layer is ready
    const miWayCheckbox = document.getElementById('toggle-transit');
    miWayCheckbox.addEventListener('change', () => {
      if (miWayCheckbox.checked) {
        map.addLayer(miWayLayer);
      } else {
        map.removeLayer(miWayLayer);
      }
    });
  });
