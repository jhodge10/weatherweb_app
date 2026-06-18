const API_KEY = "9dc256a0e330401720cb56140d6ea921";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const currentWeatherDiv =
    document.getElementById("currentWeather");

const forecastDiv =
    document.getElementById("forecast");

const loading =
    document.getElementById("loading");

const error =
    document.getElementById("error");

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        getWeather();
    }

});

function showLoading(message) {
    loading.textContent = message;
}

function clearScreen() {
    error.textContent = "";
    currentWeatherDiv.innerHTML = "";
    forecastDiv.innerHTML = "";
}

async function getWeather() {

    clearScreen();

    const city = cityInput.value.trim();

    try {

        if (!city) {
            throw new Error("Please enter a city.");
        }

        showLoading("Loading weather forecast...");

        const currentResponse =
            await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`
            );

        if (!currentResponse.ok) {
            throw new Error("City not found.");
        }

        const currentData =
            await currentResponse.json();

        const forecastResponse =
            await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=imperial`
            );

        if (!forecastResponse.ok) {
            throw new Error("Unable to retrieve forecast data.");
        }

        const forecastData =
            await forecastResponse.json();

        displayCurrentWeather(currentData);

        displayForecast(forecastData);

        showLoading("");

    } catch (err) {

        showLoading("");

        handleError(err);
    }
}

function displayCurrentWeather(data) {

    const icon =
        data.weather[0].icon;

    currentWeatherDiv.innerHTML = `
        <div class="weather-card">

            <h2>${data.name}</h2>

            <img
                src="https://openweathermap.org/img/wn/${icon}@2x.png"
                alt="Weather Icon"
                class="weather-icon"
            >

            <p>
                Temperature: ${data.main.temp}°F
            </p>

            <p>
                Weather: ${data.weather[0].description}
            </p>

            <p>
                Humidity: ${data.main.humidity}%
            </p>

            <p>
                Wind: ${data.wind.speed} mph
            </p>

        </div>
    `;
}

function displayForecast(data) {

    forecastDiv.innerHTML =
        "<h2>5-Day Forecast</h2><div class='forecast-container'></div>";

    const forecastContainer =
        document.querySelector(".forecast-container");

    const filteredForecast =
        data.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        );

    const simplifiedForecast =
        filteredForecast.map(day => ({
            date: day.dt_txt,
            temp: day.main.temp,
            description: day.weather[0].description
        }));

    renderForecastRecursive(
        simplifiedForecast,
        0,
        forecastContainer
    );
}

function renderForecastRecursive(
    forecastArray,
    index,
    container
) {

    if (index >= forecastArray.length) {
        return;
    }

    const day =
        forecastArray[index];

    container.innerHTML += `
        <div class="forecast-card">

            <h3>
                ${dayjs(day.date).format("MMM D")}
            </h3>

            <p>
                ${day.temp}°F
            </p>

            <p>
                ${day.description}
            </p>

        </div>
    `;

    renderForecastRecursive(
        forecastArray,
        index + 1,
        container
    );
}

function handleError(errorObj) {

    error.textContent =
        errorObj.message;
}