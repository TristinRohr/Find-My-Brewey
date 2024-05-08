// fetch data from IP-API
function searchLocation() {
    var query = document.getElementById('searchInput').value;
    if (query.trim() !== '') {
        var apiUrl = 'http://ip-api.com/json/' + query;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            // after fetching data from IP-API, search breweries based on city, state or postal code
            .then(data => {
                if (data.status === 'success') {
                    var city = data.city;
                    var state = data.regionName;
                    var zip = data.zip;
                    if (city) {
                        searchBreweries(city, 'city');
                    } else if (state) {
                        searchBreweries(state, 'state');
                    } else if (zip) {
                        searchBreweries(zip, 'postal_code');
                    } else {
                        alert('No location data found');
                    }
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to fetch data from IP-API');
            });
    } else {
        alert('Please enter a valid query');
    }
}
// fetch data from Open Brewery DB API
function searchBreweries(location, type) {
    var apiUrl = 'https://api.openbrewerydb.org/v1/breweries?' + type + '=' + location;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.length > 0) {
                alert('Found ' + data.length + ' breweries in ' + location);
                console.log(data); // Display data in console
            } else {
                alert('No breweries found in ' + location);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to fetch data from Open Brewery DB API');
        });
}
