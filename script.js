const API_KEY = "2062aefa030cf6c8d567521a0f98ef60";

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

        showLoading("Loading weather...");

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

    currentWeatherDiv.innerHTML = `
        <div class="weather-card">
            <h2>${data.name}</h2>

            <p>
                Temperature:
                ${data.main.temp}°F
            </p>

            <p>
                Weather:
                ${data.weather[0].description}
            </p>

            <p>
                Humidity:
                ${data.main.humidity}%
            </p>

            <p>
                Wind:
                ${data.wind.speed} mph
            </p>
        </div>
    `;
}

function displayForecast(data) {

    forecastDiv.innerHTML =
        "<h2>5-Day Forecast</h2>";

    const filteredForecast =
        data.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        );

    renderForecastRecursive(
        filteredForecast,
        0
    );
}

function renderForecastRecursive(
    forecastArray,
    index
) {

    if (index >= forecastArray.length) {
        return;
    }

    const day =
        forecastArray[index];

    forecastDiv.innerHTML += `
        <div class="forecast-card">

            <h3>
                ${dayjs(day.dt_txt)
                    .format("MMM D")}
            </h3>

            <p>
                Temp:
                ${day.main.temp}°F
            </p>

            <p>
                ${day.weather[0].description}
            </p>

        </div>
    `;

    renderForecastRecursive(
        forecastArray,
        index + 1
    );
}

function handleError(errorObj) {

    error.textContent =
        errorObj.message;
}