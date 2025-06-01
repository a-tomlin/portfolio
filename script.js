// Initialize map centered on Mississauga
const map = L.map('map').setView([43.6, -79.6], 11);

// Add OpenStreetMap base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);
L.marker([43.6, -79.6]).addTo(map).bindPopup('Mississauga').openPopup();

// Define color functions
function getWiFiColor(type) {
  switch(type) {
    case 'library': return 'blue';
    case 'park': return 'green';
    case 'community centre': return 'red';
    default: return 'gray';
  }
}

function getRouteColor(routeType) {
  switch(routeType) {
    case 'local': return 'green';
    case 'express': return 'blue';
    case 'high-school': return 'red';
    default: return 'gray';
  }
}

// Placeholder for layers
let wifiLayer;
let miWayStopsLayer;
let miWayRoutesLayer;

// Load WiFi GeoJSON
fetch('WiFi.geojson')
  .then(res => res.json())
  .then(data => {
    wifiLayer = L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        const color = getWiFiColor(feature.properties.type); // Adjust 'type' to actual property
        return L.circleMarker(latlng, {
          radius: 6,
          fillColor: color,
          color: 'darkblue',
          weight: 1,
          fillOpacity: 0.7
        });
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`WiFi: ${feature.properties?.DESCRIPT || 'No description'}`);
      }
    }).addTo(map);

    // Setup toggle
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
    miWayStopsLayer = L.geoJSON(data, {
      filter: (feature) => feature.geometry.type === 'Point',
      pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
        radius: 4,
        fillColor: 'orange',
        color: 'darkorange',
        weight: 1,
        fillOpacity: 0.7
      }),
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`Stop: ${feature.properties?.StopNumber || 'N/A'}`);
      }
    }).addTo(map);

    miWayRoutesLayer = L.geoJSON(data, {
      filter: (feature) => feature.geometry.type === 'LineString',
      style: (feature) => {
        const routeType = feature.properties?.route_type || 'unknown'; // Adjust 'route_type' to actual property
        return { color: getRouteColor(routeType), weight: 2 };
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`Route: ${feature.properties?.ROUTE_NAME || 'N/A'}`);
      }
    }).addTo(map);

    // Setup toggles
    const miWayStopsCheckbox = document.getElementById('toggle-miway-stops');
    miWayStopsCheckbox.addEventListener('change', () => {
      if (miWayStopsCheckbox.checked) {
        map.addLayer(miWayStopsLayer);
      } else {
        map.removeLayer(miWayStopsLayer);
      }
    });

    const miWayRoutesCheckbox = document.getElementById('toggle-miway-routes');
    miWayRoutesCheckbox.addEventListener('change', () => {
      if (miWayRoutesCheckbox.checked) {
        map.addLayer(miWayRoutesLayer);
      } else {
        map.removeLayer(miWayRoutesLayer);
      }
    });
  });

// Add legend
const legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'info legend');
  div.innerHTML = '<h4>Legend</h4>';

  // WiFi locations
  div.innerHTML += '<strong>WiFi Locations</strong><br>';
  const wifiCategories = [
    {type: 'library', color: 'blue'},
    {type: 'park', color: 'green'},
    {type: 'community centre', color: 'red'}
  ];
  wifiCategories.forEach(cat => {
    div.innerHTML += `<i style="background:${cat.color}; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i> ${cat.type}<br>`;
  });

  // MiWay Stops
  div.innerHTML += '<br><strong>MiWay Stops</strong><br>';
  div.innerHTML += '<i style="background:orange; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i> Bus Stop<br>';

  // MiWay Routes
  div.innerHTML += '<br><strong>MiWay Routes</strong><br>';
  const routeTypes = [
    {type: 'local', color: 'green'},
    {type: 'express', color: 'blue'},
    {type: 'high-school', color: 'red'}
  ];
  routeTypes.forEach(rt => {
    div.innerHTML += `<i style="background:${rt.color}; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i> ${rt.type}<br>`;
  });

  return div;
};

legend.addTo(map);
