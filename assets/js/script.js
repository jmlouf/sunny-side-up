var cityFormEl = document.querySelector('#city-form');
var cityInputEl = document.querySelector('#city-input');
var cityNameEl = document.querySelector('#city-name');
var currentDateEl = document.querySelector('#current-date');
var listCurrentGroupEl = document.querySelector('#list-current-group');
var listForecastGroupEl = document.querySelector('#list-forecast-group');

var formSubmitHandler = function (event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();
    cityNameEl.textContent = city;

    if (city) {
        getCoordinates(city);

        listCurrentGroupEl.textContent = '';
        listForecastGroupEl.textContent = '';
        cityInputEl.value = '';

    } else {
        alert('Please enter a city');
    }

};


var getCoordinates = function (city) {
    var geocodeUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=71dbaa7d3be04107c31af3e354e26446';

    fetch(geocodeUrl)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (coords) {
                        console.log(coords);
                        var lat = coords[0].lat;
                        var lon = coords[0].lon;
                        getCurrentWeather(lat, lon);
                    });
            }
        });

};


var getCurrentWeather = function (lat, lon) {
    var currentUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=71dbaa7d3be04107c31af3e354e26446';

    fetch(currentUrl)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (currentData) {

                        console.log(currentData);

                        if (currentData.length === 0) {
                            listCurrentGroupEl.textContent = 'No results found';
                            return;
                        }

                        // Current date (MM/DD/YYYY).
                        var formatCurrentDate = new Date(currentData.dt * 1000);
                        var standardCurrentDate = formatCurrentDate.toLocaleString();
                        currentDateEl.textContent = standardCurrentDate;

                        // Current weather conditions/icons.
                        var currentWeatherConditions = currentData.weather[0];
                        console.log(currentWeatherConditions);

                        var currentWeatherIcon = currentWeatherConditions.icon;
                        var iconUrl = 'http://openweathermap.org/img/w/' + currentWeatherIcon + '.png';
                        
                        var currentIconImg = document.createElement('img');
                        currentIconImg.src = iconUrl;
                        listCurrentGroupEl.appendChild(currentIconImg);

                        // Current temperature (Fahrenheit / Celsius).
                        var currentTempKelvin = currentData.main.temp;
                        console.log(currentTempKelvin);

                        var currentTempFahrenheit = 1.8 * (currentTempKelvin - 273.15) + 32;
                        console.log(currentTempFahrenheit);

                        var currentTempCelsius = currentTempKelvin - 273.15;
                        console.log(currentTempCelsius);

                        var currentTempEl = document.createElement('div');
                        currentTempEl.textContent = currentTempFahrenheit + '°F / ' + currentTempCelsius + '°C';
                        listCurrentGroupEl.appendChild(currentTempEl);

                        // Current wind speed (m/s).
                        var currentWind = currentData.wind.speed;
                        console.log(currentWind);

                        var currentWindEl = document.createElement('div');
                        currentWindEl.textContent = currentWind + ' m/s';
                        listCurrentGroupEl.appendChild(currentWindEl);

                        // Current humidity (%).
                        var currentHumidity = currentData.main.humidity;
                        console.log(currentHumidity);

                        var currentHumidityEl = document.createElement('div');
                        currentHumidityEl.textContent = currentHumidity + '%';
                        listCurrentGroupEl.appendChild(currentHumidityEl);

                        getForecast(lat, lon);
                    });
            }
        });
};


var getForecast = function (lat, lon) {
    var forecastUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=71dbaa7d3be04107c31af3e354e26446';

    fetch(forecastUrl)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (forecastData) {

                        console.log(forecastData)

                        if (forecastData.length === 0) {
                            forecastContainerEl.textContent = '';
                            return;
                        }

                        for (var i = 0; i < forecastData.list.length; i += 8) {

                            var dayForecast = forecastData.list[i];

                            // Forecast date (MM/DD/YYYY).
                            var formatDayForecast = new Date(dayForecast.dt * 1000);
                            var standardDayForecast = formatDayForecast.toLocaleString();
                            console.log(standardDayForecast);

                            var standardDayForecastEl = document.createElement('div');
                            standardDayForecastEl.textContent = standardDayForecast;
                            listForecastGroupEl.appendChild(standardDayForecastEl);

                            // Forecast weather conditions/icons.
                            var forecastWeatherConditions = dayForecast.weather[0];
                            console.log(forecastWeatherConditions);

                            var forecastWeatherIcon = forecastWeatherConditions.icon;
                            var forecastIconUrl = 'http://openweathermap.org/img/w/' + forecastWeatherIcon + '.png';

                            var forecastIconImg = document.createElement('img');
                            forecastIconImg.src = forecastIconUrl;
                            listForecastGroupEl.appendChild(forecastIconImg);

                            // Forecast temperature (Fahrenheit / Celsius).
                            var forecastTempKelvin = dayForecast.main.temp;
                            console.log(forecastTempKelvin);

                            var forecastTempFahrenheit = 1.8 * (forecastTempKelvin - 273.15) + 32;
                            console.log(forecastTempFahrenheit);

                            var forecastTempCelsius = forecastTempKelvin - 273.15;
                            console.log(forecastTempCelsius);

                            var forecastTempEl = document.createElement('div');
                            forecastTempEl.textContent = forecastTempFahrenheit + '°F / ' + forecastTempCelsius + '°C';
                            listForecastGroupEl.appendChild(forecastTempEl);

                            // Forecast wind speed (m/s). 
                            var forecastWindSpeed = dayForecast.wind.speed;
                            console.log(forecastWindSpeed);

                            var forecastWindSpeedEl = document.createElement('div');
                            forecastWindSpeedEl.textContent = forecastWindSpeed + 'm/s';
                            listForecastGroupEl.appendChild(forecastWindSpeedEl);

                            // Forecast humidity (%).
                            var forecastHumidity = dayForecast.main.humidity;
                            console.log(forecastHumidity);

                            var forecastHumidityEl = document.createElement('div');
                            forecastHumidityEl.textContent = forecastHumidity + '%';
                            listForecastGroupEl.appendChild(forecastHumidityEl);
                        }
                    });
            }
        });

};


cityFormEl.addEventListener('submit', formSubmitHandler);
