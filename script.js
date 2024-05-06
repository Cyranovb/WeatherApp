async function loadWeather() {
    
        const response = await fetch("https://get.geojs.io/v1/ip/geo.json");
        
        const data = await response.json();
        const latitude = data.latitude;
        const longitude = data.longitude;
        const city = data.city;
        const country = data.country;
        return {
            latitude: latitude,
            longitude: longitude,
            city: city,
            country: country
        };
    } 


async function weatherRes(latitude, longitude) {
    
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);

        const data = await response.json();

        const temperature = data.current_weather.temperature;
        const windspeed = data.current_weather.windspeed;
        const weathercode = data.current_weather.weathercode;

        return {
            temperature: temperature,
            windspeed: windspeed,
            weathercode: weathercode
        };
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

loadWeather()
    .then(data => {
        const latitude = data.latitude;
        const longitude = data.longitude;
        const city = data.city;
        const country = data.country;
        weatherRes(latitude, longitude)
            .then(data => {
                const temperature =data.temperature;
                const windspeed = data.windspeed;
                const weathercode =data.weathercode;
                const weatherDescription = decodeWeatherCode(weathercode);
                setTimeout(() => {
                    document.getElementById("loader").style.display = "none";
                    const weatherDataElement = document.getElementById("weather-data");
                    weatherDataElement.style.display = "flex";
                    weatherDataElement.innerHTML = `<h2 class="city">${city ? city + ', ' : ''}${country}</h2>`;
                    if (temperature !== undefined) {
                        weatherDataElement.innerHTML += `<p class="temperature">Температура: ${temperature} °C</p>`;
                    }
                    if (windspeed !== undefined) {
                        weatherDataElement.innerHTML += `<p class="windspeed">Скорость ветра: ${windspeed} км/ч</p>`;
                    }
                    if (weatherDescription !== undefined) {
                        weatherDataElement.innerHTML += `<p class="weather-description">Описание погоды: </p>`;
                        weatherDataElement.innerHTML += `<p class="weather-description"> ${weatherDescription}</p>`;
                    }
                }, 1500);
            });
    });