// Function to fetch prayer times data from Aladhan API
function fetchPrayerTimes(city, countryCode) {
    // Replace 'YOUR_ALADHAN_API_KEY' with your actual Aladhan API key
    const apiKey = 'YOUR_ALADHAN_API_KEY'; 
    const apiUrl = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${countryCode}&method=8&school=1&apikey=${apiKey}`;
    
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayPrayerTimes(data.data.timings);
        })
        .catch(error => {
            console.error('Error fetching prayer times:', error);
            alert('Error fetching prayer times: ' + error.message);
        });
}

// Function to display prayer times on the webpage
function displayPrayerTimes(prayerTimings) {
    const prayerTimesDiv = document.getElementById('prayer-times');
    prayerTimesDiv.innerHTML = ''; // Clear previous content

    // Create a list to display prayer times
    const prayerTimesList = document.createElement('ul');
    
    // Iterate over each prayer time and create list items
    for (const [key, value] of Object.entries(prayerTimings)) {
        const listItem = document.createElement('li');
        listItem.textContent = `${key}: ${value}`;
        prayerTimesList.appendChild(listItem);
    }

    // Append the list to the prayerTimesDiv
    prayerTimesDiv.appendChild(prayerTimesList);
}

// Fetch prayer times for Dhaka, Bangladesh
fetchPrayerTimes('Dhaka', 'Bangladesh');

// Initialize and display the map
function initMap() {
    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            var map = new google.maps.Map(
                document.getElementById('map'), {zoom: 15, center: pos});
            
            var marker = new google.maps.Marker({position: pos, map: map});
        }, function(error) {
            // Handle geolocation errors
            console.error('Error getting geolocation:', error);
            alert('Error getting geolocation: ' + error.message);
        });
    } else {
        // Browser doesn't support Geolocation
        console.error('Geolocation is not supported by this browser.');
        alert('Geolocation is not supported by this browser.');
    }
}

// Update current time every second
let time = document.getElementById("current-time");
setInterval(() => {
    let d = new Date();
    time.innerHTML = d.toLocaleTimeString();
}, 1000);
