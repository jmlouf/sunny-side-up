# SunnySideUp

## Description

This code is for a weather forecast web application that allows users to search for a city and view the current weather conditions as well as a 5-day forecast.

Key functions:

- searchApi makes a call to the OpenWeatherMap API to get location data for the user's search query
- printResults displays the search results and adds a click handler to get weather data and save search history
- getCurrentWeather and getForecast make API calls to get weather data and display it on the page
- saveButtonToHistory clones the search button and saves to local storage
- Event listeners on the search form submit to call the searchApi
- searchForm contains the city search input and units dropdown
- resultContainer displays the search results
- weatherContainer displays the current and 5-day forecast
- searchHistory shows previously searched cities

The code gets location coordinates from the user's city search, uses that to call the weather API, displays the current and forecast data, and saves search history to localStorage to allow quick access to previously viewed cities.

## Usage

This code generates a simple weather forecast web application.

To use it:

1. Enter a city name and preferred units.
2. Click the Get Forecast button to view current conditions and a 5-day forecast.
3. Click on the preferred city in the results section.
4. Icons, temperatures, wind, and humidity data are shown for the searched city.
5. Previously searched cities will be saved and can be clicked to quickly view forecasts again.

Additional weather data could be displayed by making further API calls.

## Screenshots

The following image demonstrates the web application's appearance and functionality:

![Alt text](./assets/images/mockup-1.png)
![Alt text](./assets/images/mockup-2.png)
![Alt text](./assets/images/mockup-3.png)

## Deployment Link

https://jmlouf.github.io/sunny-side-up/

## Credits

This project was created for educational purposes as part of the KU Coding Bootcamp curriculum.

The following resources were utilized:

- KU Coding Bootcamp Spot - Provided project requirements and guidelines.
- W3Schools - General reference for HTML, CSS and JavaScript.
- MDN Web Docs - Referenced for CSS styling and JavaScript documentation.
- Stack Overflow - Referenced for general JavaScript documentation.
- GeeksForGeeks - Referenced for general JavaScript documentation.

## License

Please refer to the LICENSE in the repository.