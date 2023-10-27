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
            if (response.ok) {
                response.json()
                    .then(function (coords) {
                        console.log(coords);
                        var lat = coords[0].lat;
                        var lon = coords[0].lon;
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
                    .then(function (data) {
                        console.log(data);

                        // City name.
                        var name = data.city.name;

                        console.log(name);

                        // Date.
                        var dateFormat = data.list[0].dt_txt;
                        var date = new Date(dateFormat);

                        console.log(date);

                        // Weather conditions.
                        var weatherConditions = data.list[0].weather[0];

                        console.log(weatherConditions);

                        // Temperature (Kelvin).
                        var tempKelvin = data.list[0].main.temp;
                        // Temperature (Fahrenheit).
                        var tempFahrenheit = (tempKelvin - 273.15) * 9/5 + 32;
                        // Temperature (Celsius).
                        var tempCelsius = tempKelvin - 273.15;

                        console.log(tempKelvin);
                        console.log(tempFahrenheit);
                        console.log(tempCelsius);

                        // Humidity.
                        var humidity = data.list[0].main.humidity;

                        console.log(humidity);

                        // Wind speed. 
                        var windSpeed = data.list[0].wind.speed;

                        console.log(windSpeed);


                        displayForecast();
                    });
            }
        });

};


var displayWeather = function (repos, searchTerm) {
    if (repos.length === 0) {
      forecastContainerEl.textContent = 'No results found';
      return;
    }
  
    repoSearchTerm.textContent = searchTerm;
  
    for (var i = 0; i < repos.length; i++) {
      var repoName = repos[i].owner.login + '/' + repos[i].name;
  
      var repoEl = document.createElement('a');
      repoEl.classList = 'list-item flex-row justify-space-between align-center';
      repoEl.setAttribute('href', './single-repo.html?repo=' + repoName);
  
      var titleEl = document.createElement('span');
      titleEl.textContent = repoName;
  
      repoEl.appendChild(titleEl);
  
      var statusEl = document.createElement('span');
      statusEl.classList = 'flex-row align-center';
  
      if (repos[i].open_issues_count > 0) {
        statusEl.innerHTML =
          "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
      } else {
        statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
      }
  
      repoEl.appendChild(statusEl);
  
      repoContainerEl.appendChild(repoEl);
    }
  };

cityFormEl.addEventListener('submit', formSubmitHandler);
