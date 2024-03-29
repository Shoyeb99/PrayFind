// Function to fetch prayer times data from Aladhan API
function fetchPrayerTimes(city, countryCode) {
  // Replace 'YOUR_ALADHAN_API_KEY' with your actual Aladhan API key
  const apiKey = "YOUR_ALADHAN_API_KEY";
  const apiUrl = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${countryCode}&method=8&school=1&apikey=${apiKey}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const keysToRemove = ["Midnight", "Firstthird"];
      const prayerTimes = data.data.timings;
      // Filter the object
      const filteredPrayerTimes = Object.keys(prayerTimes).reduce(
        (acc, key) => {
          if (!keysToRemove.includes(key)) {
            acc[key] = prayerTimes[key];
          }
          return acc;
        },
        {}
      );

      const prayerTimesString = JSON.stringify(filteredPrayerTimes);
      localStorage.setItem("prayerTimes", prayerTimesString);

      displayPrayerTimes(filteredPrayerTimes);
      console.log("all data", data.data);
    })
    .catch((error) => {
      console.error("Error fetching prayer times:", error);
      alert("Error fetching prayer times: " + error.message);
    });
}

const storedPrayerTimesString = localStorage.getItem("prayerTimes");

// Convert the string back into an object
const storedPrayerTimes = JSON.parse(storedPrayerTimesString);

// Function to get the current time in HH:MM format
function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Function to find the closest future prayer time
function findClosestFuturePrayerTime(prayerTimes) {
  const currentTime = getCurrentTime();
  const times = Object.entries(prayerTimes);
  const futureTimes = times.filter(([_, time]) => time > currentTime);
  const currentPrayerTime = times.filter(([_, time]) => time < currentTime);

  if (currentPrayerTime.length > 0) {
    currentPrayerTime.sort((a, b) => a[1].localeCompare(b[1]));

    return currentPrayerTime[0];
  }
  if (futureTimes.length > 0) {
    // Sort to find the closest time
    futureTimes.sort((a, b) => a[1].localeCompare(b[1]));
    return futureTimes[0]; // Returns the closest future prayer time as [name, time]
  }
  return null; // No future prayer times found
}
// Function to find the closest future prayer time
function findCurrentPrayerTime(prayerTimes) {
  const currentTime = getCurrentTime();
  const times = Object.entries(prayerTimes);
  const currentPrayerTime = times.filter(([_, time]) => time < currentTime);

  if (currentPrayerTime.length > 0) {
    currentPrayerTime.sort((a, b) => a[1].localeCompare(b[1]));

    return currentPrayerTime[0];
  }
  return null; // No future prayer times found
}

function getStoredPrayerTimes() {
  const storedPrayerTimesString = localStorage.getItem("prayerTimes");
  if (storedPrayerTimesString) {
    return JSON.parse(storedPrayerTimesString);
  }
  return null;
}

const prayerTimes = getStoredPrayerTimes();
if (prayerTimes) {
  const currentPrayerTimes = findCurrentPrayerTime(prayerTimes);
  if (currentPrayerTimes) {
    displayCurrentPrayerTime(currentPrayerTimes[0], currentPrayerTimes[1]);
  } else {
    console.log("---");
  }

  const closestFuturePrayerTime = findClosestFuturePrayerTime(prayerTimes);
  if (closestFuturePrayerTime) {
    console.log(
      `The closest future prayer time is ${closestFuturePrayerTime[0]} at ${closestFuturePrayerTime[1]}.`
    );
    displayClosetsPrayerTime(
      closestFuturePrayerTime[0],
      closestFuturePrayerTime[1]
    );
  } else {
    console.log("There are no future prayer times today.");
  }
} else {
  console.log("No prayer times data found in localStorage.");
}

// display current prayer time
function displayCurrentPrayerTime(title, time) {
  const currentTimesWrap = document.getElementById("currentPrayer");
  currentTimesWrap.innerHTML = title;
}

// display closet prayer time
function displayClosetsPrayerTime(title, time) {
  const closetTimesWrap = document.getElementById("closestPrayer");
  closetTimesWrap.innerHTML = `${title} at ${time}`;
}

// Function to display prayer times on the webpage
function displayPrayerTimes(prayerTimings) {
  const prayerTimesDiv = document.getElementById("prayer-times");
  prayerTimesDiv.innerHTML = ""; // Clear previous content

  // Create a list to display prayer times
  const prayerTimesList = document.createElement("ul");

  // Iterate over each prayer time and create list items
  for (const [key, value] of Object.entries(prayerTimings)) {
    const listItem = document.createElement("li");
    listItem.textContent = `${key}: ${value}`;
    prayerTimesList.appendChild(listItem);
  }

  // Append the list to the prayerTimesDiv
  prayerTimesDiv.appendChild(prayerTimesList);
}

// Fetch prayer times for Dhaka, Bangladesh
fetchPrayerTimes("Dhaka", "Bangladesh");

// Initialize and display the map
function initMap() {
  // Try HTML5 geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        var map = new google.maps.Map(document.getElementById("map"), {
          zoom: 15,
          center: pos,
        });

        var marker = new google.maps.Marker({ position: pos, map: map });
      },
      function (error) {
        // Handle geolocation errors
        console.error("Error getting geolocation:", error);
        alert("Error getting geolocation: " + error.message);
      }
    );
  } else {
    // Browser doesn't support Geolocation
    console.error("Geolocation is not supported by this browser.");
    alert("Geolocation is not supported by this browser.");
  }
}

// Update current time every second
let time = document.getElementById("current-time");
setInterval(() => {
  let d = new Date();
  time.innerHTML = d.toLocaleTimeString();
}, 1000);
