const map = L.map('map').setView([20, 0], 2); 

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const royalFamilies = {
    "United Kingdom": ["House of Windsor", "House of Stuart", "House of Tudor"],
    "Japan": ["Imperial House of Japan"],
    "Bhutan": ["Wangchuck Family"],
    "Saudi Arabia": ["House of Saud"],
};

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

closeModal.onclick = () => {
    modal.style.display = 'none';
};

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
