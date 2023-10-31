var apiKey = '71dbaa7d3be04107c31af3e354e26446';

var localTimeEl = document.querySelector('#local-time');
var searchFormEl = document.querySelector('#search-form');

var resultContainerEl = document.querySelector('.result');
var showResultsEl = document.querySelector('#show-results');
var resultContentEl = document.querySelector('#result-content');

var historyContainer = document.querySelector('#search-history');

var weatherContainerEl = document.querySelector('.weather');
var cityNameStateEl = document.querySelector('.city-name-state');

var currentForecastContainerEl = document.querySelector('.current-forecast-container');
var listCurrentGroupEl = document.querySelector('.list-current-group');

var fiveDayForecastContainerEl = document.querySelector('.five-day-forecast-container');
var listForecastGroupEl = document.querySelector('.list-forecast-group');

// Initialize an empty array to store the cloned history buttons
var clonedHistory = [];

var timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
};

// Format date (w/o time).
var dateOptions = {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
};

function getUnitLabel(units) {
    if (units === 'imperial') {
        return '°F';
    } else if (units === 'metric') {
        return '°C';
    } else if (units === 'standard') {
        return 'kelvins'
    }
};

function getWindSpeedUnitLabel(units) {
    if (units === 'imperial') {
        return 'mph';
    } else if (units === 'metric') {
        return 'm/s';
    } else if (units === 'standard') {
        return 'm/s';
    }
};

function convertToDMS(decimal) {
    var deg = Math.floor(decimal);
    decimal = decimal - deg;
    decimal = decimal * 60;
    var min = Math.floor(decimal);
    decimal = decimal - min;
    decimal = decimal * 60;
    var sec = decimal.toFixed(2);
    return `${deg}° ${min}' ${sec}"`;
};

function updateTime() {
    var now = new Date();
    var localTime = now.toLocaleString('en-US', timeOptions);
    localTimeEl.textContent = localTime;
};


// Initialize local, updated time.
updateTime();
setInterval(updateTime, 1000);

function getParams() {

    // Get search params from URL.
    var searchParamsArr = document.location.search.split('&');

    // Get query and units values.
    var query = searchParamsArr[0].split('=').pop();
    var units = searchParamsArr[1].split('=').pop();

    searchApi(query, units);

};

getParams();


function searchApi(query, units) {

    var directGeocodingUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + query + '&limit=5&appid=' + apiKey;

    fetch(directGeocodingUrl)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }

            return response.json();
        })
        .then(function (searchResults) {

            // Write query to page for the user to view.
            showResultsEl.innerHTML = '<div>Showing results for:</div>' + decodeURIComponent(query);

            if (!searchResults.length) {
                resultContentEl.textContent = 'No results found';
            } else {
                resultContentEl.textContent = '';
                for (var i = 0; i < searchResults.length; i++) {
                    printResults(searchResults[i], units); // Pass `units` to printResults
                }
            }
        });

};


function printResults(searchResult, units) {

    resultContainerEl.classList.remove('hidden');
    weatherContainerEl.classList.add('hidden');

    var lat = searchResult.lat;
    var lon = searchResult.lon;

    var resultBtnEl = document.createElement('button');
    resultBtnEl.classList.add('white-space');
    resultBtnEl.setAttribute('id', 'result-button');

    resultBtnEl.innerHTML = '<h3>' + searchResult.name + ',  ' + searchResult.state + ',  ' + searchResult.country + '</h3><div><p>(' + convertToDMS(searchResult.lat.toFixed(4)) + ',  ' + convertToDMS(searchResult.lon.toFixed(4)) + ')</p>';
    resultContentEl.appendChild(resultBtnEl);
    resultContentEl.appendChild(document.createElement('br'));

    resultBtnEl.addEventListener('click', function () {

        getCurrentWeather(lat, lon, units, searchResult);
        getForecast(lat, lon, units, searchResult);

        // Add this line to clear the previous results
        resultContentEl.textContent = '';

        // Pass the city name and units to saveButtonToHistory
        saveButtonToHistory(resultBtnEl, searchResult.lat, searchResult.lon, units);

    });

};


function saveButtonToHistory(buttonElement, lat, lon, units) {

    // Clone the button element to ensure it is a new instance
    var clonedButton = buttonElement.cloneNode(true);

    // Add the city name and units as data attributes to the button
    clonedButton.setAttribute('data-lat', lat);
    clonedButton.setAttribute('data-lon', lon);
    clonedButton.setAttribute('data-units', units);

    // Add an event listener to the cloned button to handle the weather retrieval
    clonedButton.addEventListener('click', function () {
        var lat = clonedButton.getAttribute('data-lat');
        var lon = clonedButton.getAttribute('data-lon');
        var units = clonedButton.getAttribute('data-units');

        // Update the current weather and forecast
        getCurrentWeather(lat, lon, units);
        getForecast(lat, lon, units);
    });

    // Add the cloned button to the cloned history array
    clonedHistory.push(clonedButton);

    // Limit the history to the last 5 buttons
    if (clonedHistory.length > 5) {
        clonedHistory.shift(); // Remove the oldest button
    }

    // Reverse the clonedHistory array
    var reversedHistory = clonedHistory.slice().reverse();

    for (var i = 0; i < reversedHistory.length; i++) {
        historyContainer.appendChild(reversedHistory[i]);
    }

};


function getCurrentWeather(lat, lon, units, searchResult) {

    weatherContainerEl.classList.remove('hidden');
    resultContainerEl.classList.add('hidden');

    var currentUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=' + units + '&appid=' + apiKey;

    // Create a container for the forecast items
    var listCurrentGroupEl = document.createElement('div');
    listCurrentGroupEl.classList.add('list-current-group');

    fetch(currentUrl)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }

            return response.json();
        })
        .then(function (currentData) {
            console.log(currentData);

            listCurrentGroupEl.textContent = '';

            if (currentData.length === 0) {
                listCurrentGroupEl.textContent = 'No results found';
            } else {

                currentForecastContainerEl.innerHTML = '<h3>Currently in: ' + searchResult.name + ', ' + searchResult.state + ', ' + searchResult.country + '<h3>';

                var currentDay = document.createElement('div');
                currentDay.classList.add('current-day');

                // Current date (ddd, MMM DD, YYYY).
                var standardCurrentData = new Date(currentData.dt * 1000).toLocaleString('en-US', dateOptions);

                var standardCurrentDataEl = document.createElement('div');
                standardCurrentDataEl.textContent = standardCurrentData;
                currentDay.appendChild(standardCurrentDataEl);

                // Current weather conditions/icons.
                var currentWeatherConditions = currentData.weather[0];
                console.log(currentWeatherConditions);

                var currentWeatherIcon = currentWeatherConditions.icon;
                var iconUrl = 'http://openweathermap.org/img/w/' + currentWeatherIcon + '.png';

                var currentIconImg = document.createElement('img');
                currentIconImg.src = iconUrl;
                currentDay.appendChild(currentIconImg);

                // Get the appropriate unit label (kelvins / °C / °F).
                var tempUnitLabel = getUnitLabel(units);
                console.log(tempUnitLabel);

                var currentTempEl = document.createElement('div');
                currentTempEl.textContent = 'Temp:  ' + currentData.main.temp.toFixed(1) + ' ' + tempUnitLabel;
                currentDay.appendChild(currentTempEl);

                // Get the appropriate unit label (m/s or mph).
                var windSpeedUnitLabel = getWindSpeedUnitLabel(units);

                var currentWindSpeedEl = document.createElement('div');
                currentWindSpeedEl.textContent = 'Wind:  ' + currentData.wind.speed.toFixed(2) + ' ' + windSpeedUnitLabel;
                currentDay.appendChild(currentWindSpeedEl);

                // Current humidity (%).
                var currentHumidity = currentData.main.humidity;
                console.log(currentHumidity);

                var currentHumidityEl = document.createElement('div');
                currentHumidityEl.textContent = 'Humidity:  ' + currentHumidity.toFixed(0) + '%';
                currentDay.appendChild(currentHumidityEl);

                listCurrentGroupEl.appendChild(currentDay);

                currentForecastContainerEl.appendChild(listCurrentGroupEl);

            }
        });
};


function getForecast(lat, lon, units) {

    weatherContainerEl.classList.remove('hidden');
    resultContainerEl.classList.add('hidden');

    var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=' + units + '&appid=' + apiKey;

    // Create a container for the forecast items
    var listForecastGroupEl = document.createElement('div');
    listForecastGroupEl.classList.add('list-forecast-group');

    fetch(forecastUrl)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }

            return response.json();
        })
        .then(function (forecastData) {

            listForecastGroupEl.textContent = '';

            if (forecastData.length === 0) {
                listForecastGroupEl.textContent = 'No results found';
            } else {
                fiveDayForecastContainerEl.innerHTML = '<h3>5-Day Forecast:<h3>';

                for (var i = 0; i < forecastData.list.length; i += 8) {

                    var dayForecast = forecastData.list[i];

                    var dayContainer = document.createElement('div');
                    dayContainer.classList.add('forecast-day');

                    // Forecast date (MM/DD/YYYY).
                    var standardDayForecast = new Date(dayForecast.dt * 1000).toLocaleString('en-US', dateOptions);

                    // Forecast weather conditions/icons.
                    var forecastWeatherConditions = dayForecast.weather[0];

                    var forecastWeatherIcon = forecastWeatherConditions.icon;
                    var forecastIconUrl = 'http://openweathermap.org/img/w/' + forecastWeatherIcon + '.png';

                    // Get the appropriate unit label (kelvins / °C / °F).
                    var tempUnitLabel = getUnitLabel(units);

                    // Get the appropriate unit label (m/s or mph).
                    var windSpeedUnitLabel = getWindSpeedUnitLabel(units);

                    // Forecast humidity (%).
                    var forecastHumidity = dayForecast.main.humidity;

                    dayContainer.innerHTML = `
                        <p>${standardDayForecast}</p>
                        <img src="${forecastIconUrl}" alt="Weather Icon">
                        <p>Temp: ${dayForecast.main.temp.toFixed(1)} ${tempUnitLabel}</p>
                        <p>Wind: ${dayForecast.wind.speed.toFixed(2)} ${windSpeedUnitLabel}</p>
                        <p>Humidity: ${forecastHumidity.toFixed(0)}%</p>
                    `;

                    // Append the day container to the forecast container
                    listForecastGroupEl.appendChild(dayContainer);
                }

                fiveDayForecastContainerEl.appendChild(listForecastGroupEl);
            }
        });

};


function handleSearchFormSubmit(event) {
    event.preventDefault();

    var searchInputVal = document.querySelector('#search-input').value;
    var unitsInputVal = document.querySelector('#units-input').value;

    if (!searchInputVal) {
        alert('Please enter a city');
        return;
    }

    searchApi(searchInputVal, unitsInputVal);

};

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
