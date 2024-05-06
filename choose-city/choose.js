document.addEventListener("DOMContentLoaded", function () {
    const citySelect = document.getElementById("city-select");
    const weatherDataElement = document.getElementById("weather-data");
    const loader = document.getElementById("loader");
    const showWeatherBtn = document.getElementById("show-weather-btn");

    async function fetchWeather(latitude, longitude) {
        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);

            if (!response.ok) {
                throw new Error("Произошла ошибка при выполнении запроса: " + response.status);
            }

            const data = await response.json();

            const temperature = data.current_weather.temperature;
            const windspeed = data.current_weather.windspeed;
            const weathercode = data.current_weather.weathercode;

            return {
                temperature: temperature,
                windspeed: windspeed,
                weathercode: weathercode
            };
        } catch (error) {
            console.error("Произошла ошибка:", error);
            return {};
        }
    }
    async function fetchData() {
        try {
            const response = await fetch("/cities/cities.json");
            if (!response.ok) {
                throw new Error("Произошла ошибка при выполнении запроса: " + response.status);
            }

            const data = await response.json();
            console.log("Полученные данные:", data);
            return data;
        } catch (error) {
            console.error("Произошла ошибка:", error);
            return [];
        }
    }

    function decodeWeatherCode(weathercode) {
        switch (weathercode) {
            case 0:
                return "Ясное небо ☀️";
            case (1, 2, 3):
                return "В основном ясно, частично облачно и пасмурно 🌥️";
            case (45, 48):
                return "Туман и инеющий туман 🌫️";
            case (51, 53, 55):
                return "Морось: слабая, умеренная и сильная интенсивность 🌦️";
            case (56, 57):
                return "Замерзающая морось: слабая и сильная интенсивность";
            case (61, 63, 65):
                return "Дождь: легкая, умеренная и сильная интенсивность 🌧️";
            case (66, 67):
                return "Ледяной дождь: легкая и сильная интенсивность 🌧️";
            case (71, 73, 75):
                return "Снегопад: легкая, умеренная и сильная интенсивность 🌨️";
            case 77:
                return "Снежинки ❄️";
            case (80, 81, 82):
                return "Ливень: слабый, умеренный и сильный ☔";
            case (85, 86):
                return "Снегопад: слабый и сильный";
            case 95:
                return "Гроза: слабая или умеренная ⛈️";
            case (96, 99):
                return "Гроза с мелким и крупным градом ⛈️";
            default:
                return "Неизвестный код погоды";
        }
    }

    async function showWeather() {
        const selectedCityName = citySelect.value;
        if (!selectedCityName) {
            weatherDataElement.innerHTML = "<p>Выберите город</p>";
            return;
        }

        const cities = await fetchData();
        const selectedCity = cities.find(city => city.city === selectedCityName);
        if (selectedCity) {
            renderWeatherCard(selectedCity);
        } else {
            weatherDataElement.innerHTML = "<p>Город не найден</p>";
        }
    }


    showWeatherBtn.addEventListener("click", showWeather);


    async function renderWeatherCard(cityData) {
        console.log("Отображаем данные для города:", cityData);
        const loader = document.getElementById("loader");
        loader.style.display = "block";

        try {
            const weatherData = await fetchWeather(cityData.latitude, cityData.longitude);
            const city = cityData.city;
            const temperature = weatherData.temperature;
            const windspeed = weatherData.windspeed;
            const weathercode = weatherData.weathercode;
            const weatherDescription = decodeWeatherCode(weathercode);

            setTimeout(() => {
                loader.style.display = "none";
                weatherDataElement.style.display = "flex";
                weatherDataElement.innerHTML = `<h2 class="city">${city}</h2>`;
                if (temperature !== undefined) {
                    weatherDataElement.innerHTML += `<p class="temperature">Температура: ${temperature} °C</p>`;
                }
                if (windspeed !== undefined) {
                    weatherDataElement.innerHTML += `<p class="windspeed">Скорость ветра: ${windspeed} км/ч</p>`;
                }
                if (weatherDescription !== undefined) {
                    weatherDataElement.innerHTML += `<p class="weather-description">Описание погоды: </p>`;
                    weatherDataElement.innerHTML += `<p class="weather-description">${weatherDescription}</p>`;
                }
            }, 150);
        } catch (error) {
            console.error("Произошла ошибка:", error);
            loader.style.display = "none";
        }
    }

    async function populateCitySelect() {
        const cities = await fetchData();
        for (const city of cities) {
            const option = document.createElement("option");
            option.value = city.city;
            option.textContent = city.city;
            citySelect.appendChild(option);
        }
    }

    populateCitySelect();
});