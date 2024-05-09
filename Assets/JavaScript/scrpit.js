 // Add event listener to the submit button for searching based on user input
 document.getElementById("submitBtn").addEventListener("click", function () {
    searchBasedOnInput(); // Call the function to search based on user input
});

// Add event listener to the "Find Breweries Near Me" button for finding breweries near user's location
document.getElementById("findNearMeBtn").addEventListener("click", function () {
    findBreweriesNearMe(); // Call the function to find breweries near user's location
});

// Function to search breweries based on user input
function searchBasedOnInput() {
    var query = document.getElementById('searchInput').value;
    if (query.trim() !== '') {
        searchBreweries(query);
    } else {
        alert('Please enter a valid query');
    }
}

// Function to find breweries near user's location
function findBreweriesNearMe() {
    fetch('https://api.ipgeolocation.io/ipgeo?apiKey=ffd1b3ca5b3d46aab22ef6c4e8520bc4&fields=state_prov')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(userLocation => {
            console.log('User location:', userLocation); // Debugging: Log user location data
            var state = userLocation.state_prov;
            console.log('State:', state); // Debugging: Log city
            if (state !== undefined && state !== null && state !== '') {
                searchBreweries(state);
            } else {
                alert('Failed to get user location');
            }
        })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to fetch user location from IP-API');
            });
}

// Function to search breweries using the Open Brewery DB API
function searchBreweries(query = '') {
    console.log('Searching breweries near: ', location)
    var apiUrl = 'https://api.openbrewerydb.org/v1/breweries/search?query=' + query;


    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Breweries:', data); // Debugging: Log breweries data
            // displayBreweries(data)
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to fetch breweries');
        });       
}
