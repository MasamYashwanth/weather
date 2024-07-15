document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('location-input');
    const searchBtn = document.getElementById('searchBtn');
    const weatherImg = document.querySelector('.weather-img');
    const tempDisplay = document.querySelector('.temperature');
    const descDisplay = document.querySelector('.description');
    const humidityDisplay = document.getElementById('humidity');
    const windDisplay = document.getElementById('wind-speed');
    const citySuggestions = document.getElementById('city-suggestions');

    const weatherImages = {
        Clouds: '/Assets/overcast.jpg',
        Rain: '/Assets/rainy.jpg',
        Drizzle: '/Assets/light-rain.jpg',
        Thunderstorm: '/Assets/thunder.jpg',
        Snow: '/Assets/snow.jpg',
        Mist: '/Assets/mist.jpg',
        Smoke: '/Assets/smoke.jpg',
        Dust: '/Assets/dusty.jpg',
        Fog: '/Assets/foggy.jpg',
        "overcast clouds": '/Assets/overcast clouds.jpg'
    };

    async function fetchWeather(city) {
        const apiKey = "a28dfd03df7b357eb414680698d0ddfc";
        const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        const response = await fetch(endpoint);
        return response.json();
    }

    async function fetchCitySuggestions(query) {
        const endpoint = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}`;
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY',
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        });
        return response.json();
    }

    function showWeather(data) {
        const tempCelsius = (data.main.temp - 273.15).toFixed(1);
        tempDisplay.innerHTML = `${tempCelsius}<sup>°C</sup>`;
        descDisplay.innerHTML = data.weather[0].description.toUpperCase();
        humidityDisplay.innerHTML = `${data.main.humidity}%`;
        windDisplay.innerHTML = `${data.wind.speed} km/h`;

        const condition = data.weather[0].main;
        weatherImg.src = weatherImages[condition] || '/Assets/default-weather.jpg';
    }

    async function getWeather(city) {
        try {
            const weatherData = await fetchWeather(city);
            showWeather(weatherData);
        } catch (error) {
            console.error('Weather fetch error:', error);
        }
    }

    async function updateCitySuggestions(query) {
        try {
            const data = await fetchCitySuggestions(query);
            citySuggestions.innerHTML = '';
            data.data.forEach(city => {
                const option = document.createElement('option');
                option.value = city.name;
                citySuggestions.appendChild(option);
            });
        } catch (error) {
            console.error('City suggestions fetch error:', error);
        }
    }

    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
        }
    });

    cityInput.addEventListener('input', () => {
        const query = cityInput.value.trim();
        if (query.length > 0) {
            updateCitySuggestions(query);
        }
    });
});
