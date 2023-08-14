document.addEventListener("DOMContentLoaded", () => {
    const cityInput=document.querySelector('#searchBar');
    const searchButton= document.querySelector('#searchBtn');
    const weatherCardsDiv= document.querySelector('.dayForecast');

    const APIkey='4d697593455ee5751089d0a14f15ecff'



    const weatherCard = (weatherItem) => {
        const dateParts = weatherItem.dt_txt.split(" ")[0].split("-");
        const month = dateParts[1];
        const day = dateParts[2];
        
        return `<div id="day">
            <h1 id="dayOne">${month}/${day}</h1>
            <img id="weatherIcon1" src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather" width="100px"/>
            <h2 id="day1Temperature">${(weatherItem.main.temp - 273.15).toFixed(0)}°C</h2>
            <h4>Humidity: ${weatherItem.main.humidity}%</h4>
        </div>`;
    };

    const getWeatherDetails = (cityName, lat, lon) => {
        const weather_api = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&lat=${lat}&lon=${lon}&appid=${APIkey}`;

        fetch(weather_api)
            .then(res => res.json())
            .then(data => {
                const uniqueDays = [];

                const fiveDays = data.list.filter(forecast => {
                    const forecastDate = new Date(forecast.dt_txt).getDate();
                    if (!uniqueDays.includes(forecastDate)) {
                        if (uniqueDays.length >= 5) {
                            return false;
                        }
                        return uniqueDays.push(forecastDate);
                    }
                });

                cityInput.value = "";
                weatherCardsDiv.innerHTML = "";

                fiveDays.forEach(weatherItem => {
                    weatherCardsDiv.insertAdjacentHTML('beforeend', weatherCard(weatherItem));
                });
            })
            .catch(() => {
                alert('An error occurred while fetching weather data.');
            });
    }

    const getCoordinates = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    getWeatherDetails('', latitude, longitude); // Empty string as city name for default
                },
                (error) => {
                    fetchWeatherByCity('Vancouver');
                    alert('Error getting geolocation: ' + error.message);
                }
            );
        } else {
            fetchWeatherByCity('Vancouver');
            alert('Geolocation is not available in this browser.');
        }
    }

    getCoordinates();

    searchButton.addEventListener('click', () => {
        const cityName = cityInput.value.trim();
        if (cityName) {
            fetchWeatherByCity(cityName);
        }
    });

    const fetchWeatherByCity = (cityName) => {
        const GEOCODING_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIkey}`;

        fetch(GEOCODING_API_URL)
            .then(res => res.json())
            .then(data => {
                if (!data.coord) {
                    alert(`${cityName} cannot be found!`);
                    return;
                }
                const { lat, lon } = data.coord;
                getWeatherDetails(cityName, lat, lon);
            })
            .catch(() => {
                alert('An error occurred while fetching weather data.');
            });
    }
    });
    