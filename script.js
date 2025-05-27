// Initialize the Leaflet map with responsive settings
const map = L.map('map', {
    center: [20, 0], // Center on the world
    zoom: 2, // Initial zoom level
    dragging: true, // Enable panning
    zoomControl: true, // Enable zoom buttons
    scrollWheelZoom: false, // Disable mouse wheel zoom (optional: set to true for desktop)
    doubleClickZoom: false, // Disable double-click zoom
    boxZoom: false, // Disable box zoom
    tap: true, // Enable touch interactions
    touchZoom: false, // Disable pinch-to-zoom
    keyboard: false, // Disable keyboard navigation
    minZoom: 2, // Minimum zoom level
    maxZoom: 5 // Maximum zoom level
}).setView([20, 0], 2);

// Country name mapping to handle mismatches between CSV and GeoJSON
const countryNameMap = {
    'United Kingdom': 'United Kingdom of Great Britain and Northern Ireland',
    'United States': 'United States of America',
    'Russia': 'Russian Federation',
    // Add more mappings as needed based on your CSV and GeoJSON
};

// Store royal families data
let royalFamilies = {};

// Load CSV data
Papa.parse('data/royalfamilies.csv', {
    download: true,
    header: true,
    complete: function(results) {
        results.data.forEach(row => {
            if (row.Country && row.Family) {
                const geoName = countryNameMap[row.Country] || row.Country;
                if (!royalFamilies[geoName]) {
                    royalFamilies[geoName] = [];
                }
                royalFamilies[geoName].push(row.Family.trim());
            }
        });
        loadGeoJSON(); // Load map after CSV is processed
    },
    error: function(error) {
        console.error('Error loading CSV:', error);
        loadGeoJSON(); // Load map even if CSV fails
    }
});

// Load GeoJSON and bind click events
function loadGeoJSON() {
    fetch('https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: {
                    weight: 2, // Thicker borders
                    color: '#4a2c00', // Dark brown to match style.css
                    fillOpacity: 0.1 // Light fill
                },
                onEachFeature: (feature, layer) => {
                    layer.on('click', () => {
                        // Highlight country
                        layer.setStyle({ fillColor: '#ff0000', fillOpacity: 0.5 });
                        setTimeout(() => layer.setStyle({ fillColor: '#4a2c00', fillOpacity: 0.1 }), 1000);
                        // Show modal with family data
                        const countryName = feature.properties.name;
                        document.getElementById('countryName').textContent = countryName;
                        const familyList = document.getElementById('familyList');
                        familyList.innerHTML = '';
                        const families = royalFamilies[countryName] || ['No royal families recorded for this country'];
                        families.forEach(family => {
                            const li = document.createElement('li');
                            li.textContent = family;
                            familyList.appendChild(li);
                        });
                        document.getElementById('familyModal').style.display = 'block';
                    });
                }
            }).addTo(map);
        })
        .catch(error => console.error('Error loading GeoJSON:', error));
}

// Modal close functionality
document.querySelector('.close').onclick = () => {
    document.getElementById('familyModal').style.display = 'none';
};

window.onclick = (event) => {
    if (event.target === document.getElementById('familyModal')) {
        document.getElementById('familyModal').style.display = 'none';
    }
};



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
