var apiKey = '71dbaa7d3be04107c31af3e354e26446';

var cityFormEl = document.querySelector('#city-form');
var cityInputEl = document.querySelector('#city-input');

var showingWeatherInEl = document.querySelector('.showing-weather-in');

var currentContainerEl = document.querySelector('.current-container');
var currentEl = document.querySelector('.current');
var currentDateEl = document.querySelector('.current-date');
var currentTimeEl = document.querySelector('.current-time');
var listCurrentGroupEl = document.querySelector('.list-current-group');

var forecastContainerEl = document.querySelector('.forecast-container');
var forecastEl = document.querySelector('.forecast');
var listForecastGroupEl = document.querySelector('.list-forecast-group');


var formSubmitHandler = function (event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();

    if (city) {
        getCoordinates(city);

        cityInputEl.value = '';

    } else {
        alert('Please enter a city');
    }

};


var getCoordinates = function (city) {
    var geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;

    fetch(geocodeUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json()
                    .then(function (data) {

                        var city = data[0].name;
                        var state = data[0].state;

                        var location = `${city}, ${state}`;

                        var locationInputEl = document.querySelector('h2')
                        locationInputEl.textContent = location;
                        showingWeatherInEl.appendChild(locationInputEl);

                        var lat = data[0].lat;
                        var lon = data[0].lon;

                        getCurrentWeather(lat, lon);
                    });
            }
        });

};


var getCurrentWeather = function (lat, lon) {
    var currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`

    fetch(currentUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json()
                    .then(function (currentData) {

                        console.log(currentData);

                        if (currentData.length === 0) {
                            listCurrentGroupEl.textContent = 'No results found';
                            return;
                        }

                        currentEl.textContent = 'Currently:';

                        // Current date (MM/DD/YYYY) and time ().
                        updateTime();
                        setInterval(updateTime, 1000);

                        function updateTime() {

                            var now = new Date();

                            // Format date (w/ time).
                            var dateOptions = {
                                weekday: 'short',
                                month: 'short',
                                day: '2-digit',
                                year: 'numeric',
                            };

                            var timeOptions = {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true,
                            };

                            var currentTime = now.toLocaleString('en-US', timeOptions);
                            var currentDate = now.toLocaleString('en-US', dateOptions);

                            currentTimeEl.textContent = 'Local Time: ' + currentTime;
                            currentDateEl.textContent = currentDate;

                        };

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
                        currentTempEl.textContent = 'Temp:  ' + currentTempFahrenheit.toFixed(1) + '°F / ' + currentTempCelsius.toFixed(1) + '°C';
                        listCurrentGroupEl.appendChild(currentTempEl);

                        // Current wind speed (m/s -> mph).
                        var currentWindMs = currentData.wind.speed;
                        var currentWindMph = currentWindMs * 2.237;
                        console.log(currentWindMph);

                        var currentWindEl = document.createElement('div');
                        currentWindEl.textContent = 'Wind:  ' + currentWindMph.toFixed(2) + ' m/s';
                        listCurrentGroupEl.appendChild(currentWindEl);

                        // Current humidity (%).
                        var currentHumidity = currentData.main.humidity;
                        console.log(currentHumidity);

                        var currentHumidityEl = document.createElement('div');
                        currentHumidityEl.textContent = 'Humidity:  ' + currentHumidity.toFixed(0) + '%';
                        listCurrentGroupEl.appendChild(currentHumidityEl);

                        getForecast(lat, lon);
                    });
            }
        });
};


var getForecast = function (lat, lon) {
    var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(forecastUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json()
                    .then(function (forecastData) {

                        console.log(forecastData)

                        if (forecastData.length === 0) {
                            forecastContainerEl.textContent = '';
                            return;
                        }

                        forecastEl.textContent = '5-Day Forecast:';

                        for (var i = 0; i < forecastData.list.length; i += 8) {

                            var dayForecast = forecastData.list[i];

                            // Forecast date (MM/DD/YYYY).
                            var formatDayForecast = new Date(dayForecast.dt * 1000);

                            // Format date.
                            var options = {
                                weekday: 'short',
                                month: 'short',
                                day: '2-digit',
                                year: 'numeric',
                            };

                            var standardDayForecast = formatDayForecast.toLocaleString('en-US', options);

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
                            forecastTempEl.textContent = 'Temp:  ' + forecastTempFahrenheit.toFixed(1) + '°F / ' + forecastTempCelsius.toFixed(1) + '°C';
                            listForecastGroupEl.appendChild(forecastTempEl);

                            // Forecast wind speed (m/s -> mph). 
                            var forecastWindMs = dayForecast.wind.speed;
                            var forecastWindMph = forecastWindMs * 2.237;
                            console.log(forecastWindMph);

                            var forecastWindSpeedEl = document.createElement('div');
                            forecastWindSpeedEl.textContent = 'Wind:  ' + forecastWindMph.toFixed(2) + ' mph';
                            listForecastGroupEl.appendChild(forecastWindSpeedEl);

                            // Forecast humidity (%).
                            var forecastHumidity = dayForecast.main.humidity;
                            console.log(forecastHumidity);

                            var forecastHumidityEl = document.createElement('div');
                            forecastHumidityEl.textContent = 'Humidity:  ' + forecastHumidity.toFixed(0) + '%';
                            listForecastGroupEl.appendChild(forecastHumidityEl);
                        }
                    });
            }
        });

};


cityFormEl.addEventListener('submit', formSubmitHandler);
