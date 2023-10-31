var localTimeEl = document.querySelector('#local-time');
var searchFormEl = document.querySelector('#search-form');

var timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
};

function updateTime() {

    var now = new Date();
    var localTime = now.toLocaleString('en-US', timeOptions);

    localTimeEl.textContent = localTime;

};

// Initialize local, updated time.
updateTime();
setInterval(updateTime, 1000);

function handleSearchFormSubmit(event) {
    event.preventDefault();

    var searchInputVal = document.querySelector('#search-input').value;
    var unitsInputVal = document.querySelector('#units-input').value;

    console.log(searchInputVal);
    console.log(unitsInputVal);

    if (!searchInputVal) {
        alert('Please enter a city');
        return;
    }

    var queryString = './search-results.html?q=' + encodeURIComponent(searchInputVal) + '&units=' + unitsInputVal;

    location.assign(queryString);

};


searchFormEl.addEventListener('submit', handleSearchFormSubmit);
