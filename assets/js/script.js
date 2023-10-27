var cityFormEl = document.querySelector('#city-form');
var cityInputEl = document.querySelector('#city-input');
var forecastContainerEl = document.querySelector('#forecast-container');
var citySearchTermEl = document.querySelector('#city-search-term');


var formSubmitHandler = function (event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();

    if (city) {
        getCoordinates(city);

        forecastContainerEl.textContent = '';
        cityInputEl.value = '';

    } else {
        alert('Please enter a city');
    }
    
};


var getCoordinates = function (city) {
    var geocodeUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=71dbaa7d3be04107c31af3e354e26446';

    fetch(geocodeUrl)
        .then(function (response) {
            console.log(response);
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        var lat = data[0].lat;
                        var lon = data[0].lon;
                        getForecast(lat, lon);
                    });
            }
        });

};


var getForecast = function (lat, lon) {
    var weatherUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=71dbaa7d3be04107c31af3e354e26446';

    fetch(weatherUrl)
        .then(function (response) {
            console.log(response);
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        console.log(data);
                    });
            }
        });

};


cityFormEl.addEventListener('submit', formSubmitHandler);
