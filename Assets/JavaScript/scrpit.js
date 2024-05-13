// Initialize favoriteBreweries array from local storage, or an empty array if not present
var favoriteBreweries = JSON.parse(localStorage.getItem('favoriteBreweries')) || [];

// Function to add a brewery to favoriteBreweries array and store it in local storage
function addToFavorites(brewery) {
    favoriteBreweries.push(brewery);
    localStorage.setItem('favoriteBreweries', JSON.stringify(favoriteBreweries));
    displayFavorites(); // Update the display of favorite breweries
}

// Function to display favorited breweries in dropdown
function displayFavorites() {
    var favoritesDropdown = document.getElementById('favoritesDropdown');
    favoritesDropdown.innerHTML = ''; // Clear previous dropdown items

    if (favoriteBreweries.length > 0) {
        favoriteBreweries.forEach(brewery => {
            var option = document.createElement('option');
            option.text = brewery.name;
            option.value = brewery.id;
            favoritesDropdown.appendChild(option);
        });
    } else {
        var option = document.createElement('option');
        option.text = 'No favorites found';
        favoritesDropdown.appendChild(option);
    }
}

// Event listener for the Favorites button
document.getElementById('favoritesButton').addEventListener('click', function () {
    // Toggle the class to show/hide the dropdown when the Favorites button is clicked
    document.getElementById('favoritesDropdown').classList.toggle('hidden');
});

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.favoritesButton')) {
        var dropdowns = document.getElementsByClassName("favoritesDropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// Call the displayFavorites function initially to populate the dropdown
displayFavorites();

//Display search results
const resultsContainer = document.getElementById('resultsContainer');

// Function to display search results
function displayBreweries(breweries) {
    var resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';

    if (breweries.length > 0) {
        var div = document.createElement('div');
        div.classList.add('grid', 'grid-cols-1', 'sm:grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4', 'gap-4', 'mx-auto', 'p-4');

        breweries.forEach(function(brewery) {
            var li = document.createElement('div');
            li.classList.add('flex', 'flex-col', 'bg-orange-100', 'shadow-md', 'p-4', 'rounded-lg', 'space-y-2');

            var infoDiv = document.createElement('div');
            infoDiv.classList.add('flex', 'flex-col', 'space-y-2');

            var name = document.createElement('h3');
            name.textContent = brewery.name;
            name.classList.add('text-lg', 'font-bold', 'text-gray-800');

            var city = document.createElement('p');
            city.textContent = 'City: ' + brewery.city;
            city.classList.add('text-gray-600');

            var address = document.createElement('p');
            address.textContent = 'Address: ' + brewery.address_1;
            address.classList.add('text-gray-600');

            var link = document.createElement('a');
            link.href = brewery.website_url;
            link.textContent = 'Visit Website';
            link.target = '_blank';
            link.classList.add('text-blue-500', 'hover:text-blue-700', 'font-bold', 'underline');

            var saveButton = document.createElement('button');
            saveButton.textContent = 'Save';
            saveButton.classList.add('bg-red-500', 'hover:bg-red-600', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'focus:outline-none', 'focus:ring-2', 'focus:ring-red-500', 'focus:ring-opacity-50', 'place-self-end');

            infoDiv.appendChild(name);
            infoDiv.appendChild(city);
            infoDiv.appendChild(address);
            infoDiv.appendChild(link);

            li.appendChild(infoDiv);
            li.appendChild(saveButton);
            div.appendChild(li);

        });
        resultsContainer.appendChild(div);
    } else {
        resultsContainer.textContent = 'No breweries found';
    }
}



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
    var apiUrl = 'https://api.openbrewerydb.org/v1/breweries/search?query=' + query + '&per_page=12';


    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayBreweries(data);
            console.log('Breweries:', data); // Debugging: Log breweries data
            // displayBreweries(data)
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to fetch breweries');
        });       
}
