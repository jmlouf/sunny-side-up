var cityFormEl = document.querySelector('#city-form');
var cityInputEl = document.querySelector('#city-input');
var forecastContainerEl = document.querySelector('#forecast-container');
var citySearchTermEl = document.querySelector('#city-search-term');

var cityName;

var lat;
var lon;

var formSubmitHandler = function (event) {
    event.preventDefault();

    var cityName = cityInputEl.value.trim();

    if (cityName) {
        getCoordinates(cityName);

        forecastContainerEl.textContent = '';
        cityInputEl.value = '';
    } else {
        alert('Please enter a city');
    }
};


var getCoordinates = function (cityName) {
    var coordinatesApi = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&appid=71dbaa7d3be04107c31af3e354e26446';

    fetch(coordinatesApi)
        .then(function (response) {
            console.log(response);
            if (response.ok) {
                response.json().then(function (data) {
                    var lat = data[0].lat;
                    var lon = data[0].lon;
                    console.log(lat);
                    console.log(lon);
                    return lat, lon;

                });
            }
        });
};

/*
var getForecast = function () {
    var weatherApi = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=71dbaa7d3be04107c31af3e354e26446';

    fetch(weatherApi)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    displayRepos(data, cityForecast);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to OpenWeather');
        });
};
*/

cityFormEl.addEventListener('submit', formSubmitHandler);