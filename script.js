const map = L.map('map').setView([20.5937, 78.9629], 5); // Center of India

// Base map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Simulated rain zones
const rainZones = [
  { lat: 19.0760, lon: 72.8777, radius: 20, rain: "light", place: "Mumbai" },
  { lat: 28.6139, lon: 77.2090, radius: 25, rain: "heavy", place: "Delhi" },
  { lat: 26.8467, lon: 80.9462, radius: 15, rain: "moderate", place: "Lucknow" }
];

// Show simulated zones on map
rainZones.forEach(zone => {
  L.circle([zone.lat, zone.lon], {
    radius: zone.radius * 1000,
    color: "blue",
    fillColor: "#99ccff",
    fillOpacity: 0.3
  }).addTo(map).bindPopup(`🌧️ Rain Zone: ${zone.place} (${zone.rain})`);
});

// Check if clicked location is inside a rain zone
function isInRainZone(lat, lon) {
  return rainZones.find(zone => {
    const d = getDistance(lat, lon, zone.lat, zone.lon);
    return d < zone.radius;
  });
}

// Haversine formula to compute distance in km
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// On map click
map.on("click", (e) => {
  const lat = e.latlng.lat;
  const lon = e.latlng.lng;

  const rainZone = isInRainZone(lat, lon);

  let message = `📍 You clicked at: ${lat.toFixed(3)}, ${lon.toFixed(3)}<br>`;
  if (rainZone) {
    message += `🌧️ Rain Detected in ${rainZone.place} (${rainZone.rain} rain)<br>`;
    message += `❗ Suggest avoiding this route.`;
  } else {
    message += `☀️ No rain detected here.<br>✅ Route is safe.`;
  }

  // Show popup and info
  L.marker([lat, lon]).addTo(map).bindPopup(message).openPopup();
  document.g})
