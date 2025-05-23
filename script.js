// Initialize the Leaflet map with zoom controls and panning enabled
const map = L.map('map', {
    center: [20, 0], // Center on the world
    zoom: 2, // Fixed initial zoom level
    dragging: true, // Enable dragging/panning
    zoomControl: true, // Enable zoom controls (+/- buttons)
    scrollWheelZoom: false, // Disable zoom with mouse wheel (set to true for desktop if desired)
    doubleClickZoom: false, // Disable zoom on double-click
    boxZoom: false, // Disable zoom by dragging a box
    tap: true, // Enable tap-based interactions (for mobile)
    touchZoom: false, // Disable pinch-to-zoom (for mobile)
    keyboard: false, // Disable keyboard navigation
    minZoom: 2, // Prevent zooming out too far
    maxZoom: 5 // Prevent zooming in too close
}).setView([20, 0], 2);

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
                weight: 2, // Thicker borders
                color: '#000', // Black borders
                fillOpacity: 0.1 // Lighter fill
            },
            onEachFeature: (feature, layer) => {
                // Add click event to each country
                layer.on('click', () => {
                    // Highlight country on click
                    layer.setStyle({ fillColor: '#ff0000', fillOpacity: 0.5 });
                    setTimeout(() => layer.setStyle({ fillColor: '#000', fillOpacity: 0.1 }), 1000); // Reset after 1s
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
