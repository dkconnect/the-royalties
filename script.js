// Initialize the Leaflet map with locked settings
const map = L.map('map', {
    center: [20, 0], // Center on the world
    zoom: 2, // Fixed zoom level
    dragging: false, // Disable dragging/panning
    zoomControl: false, // Remove zoom controls
    scrollWheelZoom: false, // Disable zoom with mouse wheel
    doubleClickZoom: false, // Disable zoom on double-click
    boxZoom: false, // Disable zoom by dragging a box
    tap: false, // Disable tap-based interactions (for mobile)
    touchZoom: false, // Disable pinch-to-zoom (for mobile)
    keyboard: false // Disable keyboard navigation
}).setView([20, 0], 2);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Placeholder data for royal families (replace with your actual data)
const royalFamilies = {
    "United Kingdom": ["House of Windsor", "House of Stuart", "House of Tudor"],
    "Japan": ["Imperial House of Japan"],
    "Bhutan": ["Wangchuck Family"],
    "Saudi Arabia": ["House of Saud"],
    // Add more countries and families as needed
};

// Load GeoJSON data for country borders
fetch('https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: {
                weight: 1,
                color: '#3388ff',
                fillOpacity: 0.2
            },
            onEachFeature: (feature, layer) => {
                // Add click event to each country
                layer.on('click', () => {
                    const countryName = feature.properties.name;
                    showFamilyList(countryName);
                });
            }
        }).addTo(map);
    })
    .catch(error => console.error('Error loading GeoJSON:', error));

// Modal functionality
const modal = document.getElementById('familyModal');
const closeModal = document.querySelector('.close');
const countryNameDisplay = document.getElementById('countryName');
const familyList = document.getElementById('familyList');

// Show modal with family list
function showFamilyList(country) {
    countryNameDisplay.textContent = country;
    familyList.innerHTML = ''; // Clear previous list
    const families = royalFamilies[country] || ['No royal families recorded for this country'];
    families.forEach(family => {
        const li = document.createElement('li');
        li.textContent = family;
        familyList.appendChild(li);
    });
    modal.style.display = 'block';
}

// Close modal when clicking the close button
closeModal.onclick = () => {
    modal.style.display = 'none';
};

// Close modal when clicking outside
window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
