// Initialize favoriteBreweries array from local storage, or an empty array if not present
var favoriteBreweries = JSON.parse(localStorage.getItem('favoriteBreweries')) || [];

// Function to add a brewery to favoriteBreweries array and store it in local storage
function addToFavorites(brewery) {
    var existingBrewery = favoriteBreweries.find(b => b.id === brewery.id);
    if (!existingBrewery) {
        favoriteBreweries.push(brewery);
        localStorage.setItem('favoriteBreweries', JSON.stringify(favoriteBreweries));
        displayFavorites();
    } else {
        // Show modal alert
        showModal('This brewery is already in your favorites.');
    }
}

// Function to show modal alert
function showModal(message) {
    var modal = document.getElementById('modal');
    var modalMessage = document.getElementById('modalMessage');
    modalMessage.textContent = message;
    modal.classList.remove('hidden');
}

// Close modal button event listener
document.getElementById('modalCloseButton').addEventListener('click', function () {
    var modal = document.getElementById('modal');
    modal.classList.add('hidden');
});

// Function to display favorited breweries in dropdown
function displayFavorites() {
    var favoritesDropdown = document.getElementById('favoritesDropdown');
    favoritesDropdown.innerHTML = ''; // Clear previous dropdown items

    if (favoriteBreweries.length > 0) {
        favoriteBreweries.forEach(brewery => {
            var listItem = document.createElement('li');

            var optionLink = document.createElement('a');
            optionLink.textContent = brewery.name;
            optionLink.href = brewery.website_url;
            optionLink.target = '_blank';
            listItem.appendChild(optionLink);

            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Remove';
            deleteButton.classList.add('bg-red-500', 'text-white', 'm-3', 'rounded');
            
            // Event listener to remove brewery from favorites
            deleteButton.addEventListener('click', function(event) {
                event.stopPropagation(); // Stop event propagation to prevent anchor click
                removeFavorite(brewery.id);
            });

            listItem.appendChild(deleteButton);
            favoritesDropdown.appendChild(listItem);
        });
    } else {
        var option = document.createElement('option');
        option.text = 'No favorites found';
        favoritesDropdown.appendChild(option);
    }
}


// Function to remove a brewery from the favorites list
function removeFavorite(breweryId) {
    favoriteBreweries = favoriteBreweries.filter(brewery => brewery.id !== breweryId);
    localStorage.setItem('favoriteBreweries', JSON.stringify(favoriteBreweries));
    displayFavorites(); // Update the display of favorite breweries
}


const favoritesButtonWrapper = document.getElementById('favoritesButtonWrapper');
document.addEventListener('click', function(event) {
    if(favoritesButtonWrapper.contains(event.target)) {
        document.getElementById('favoritesDropdown').classList.remove('hidden');
    } else {
        document.getElementById('favoritesDropdown').classList.add('hidden');
    }
})

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
            saveButton.addEventListener('click', function() {
                addToFavorites(brewery);
            });

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
        var noResults = document.createElement('div');
        noResults.classList.add('text-center', 'text-lg', 'text-orange-500', 'p-4', 'font-bold', 'rounded-lg', 'shadow-md', 'bg-orange-100', 'w-1/2' , 'mx-auto', 'mt-4');
        noResults.textContent = 'No results found';
        resultsContainer.appendChild(noResults);
    }
}
// Add event listener to the search input for searching based on user input
function handlekeypress(event) {
    if (event.key === 'Enter') {
        searchBasedOnInput();
    }
}
document.getElementById("searchInput").addEventListener("keypress", handlekeypress);

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
        showModal('Please enter a valid query');
    }
}

// Function to find breweries near user's location
function findBreweriesNearMe() {
    document.getElementById('searchInput').value = '';

    fetch('https://api.ipgeolocation.io/ipgeo?apiKey=ffd1b3ca5b3d46aab22ef6c4e8520bc4')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(userLocation => {
            console.log('User location:', userLocation); // Debugging: Log user location data
            var latitude = userLocation.latitude;
            var longitude = userLocation.longitude;
            console.log('Latitude:', latitude); // Debugging: Log latitude
            console.log('Longitude:', longitude); // Debugging: Log longitude
            if (latitude !== undefined && longitude !== undefined) {
                searchBreweries('', latitude, longitude); // Pass empty query for nearby search
            } else {
                console.error('Failed to get user location');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to search breweries using the Open Brewery DB API
function searchBreweries(query, latitude, longitude) {
    var apiUrl = 'https://api.openbrewerydb.org/v1/breweries?';

    // Check if query is empty for nearby search
    if (!query.trim()) {
        // Use latitude and longitude for nearby search
        apiUrl += 'by_dist=' + latitude + ',' + longitude;
    } else if (!isNaN(query)) {
        // If query is a number, assume it's latitude and longitude
        apiUrl += 'by_dist=' + query;
    } else {
        // If query is not a number, assume it's a state abbreviation
        apiUrl += 'by_state=' + encodeURIComponent(query);
    }

    apiUrl += '&per_page=12';

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


