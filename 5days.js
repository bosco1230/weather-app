document.addEventListener("DOMContentLoaded", () => {
    const cityInput=document.querySelector('#searchBar');
    const searchButton= document.querySelector('#searchBtn');
    const weatherCardsDiv= document.querySelector('.dayForecast');

    const APIkey='4d697593455ee5751089d0a14f15ecff'



    const  weatherCard=(weatherItem)=>{
        return `<div id="day1">
            <h1 id="dayOne">${weatherItem.dt_txt.split(" ")[0]}</h1>
            <img id="weatherIcon1" src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather" />
            <h2 id="day1Temperature">${(weatherItem.main.temp-273.15).toFixed(1)}°C</h2>
            <h4>Humidity:${weatherItem.main.humidity}%</h4>
      </div>`;
    }

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
    /*document.addEventListener("DOMContentLoaded", () => {
const apikey = "4d697593455ee5751089d0a14f15ecff";
const apiurl =
    "http://api.openweathermap.org/data/2.5/forecast?units=metric";
const Image1 = document.querySelector("#weatherIcon1");
const Image2 = document.querySelector("#weatherIcon2");
const Image3 = document.querySelector("#weatherIcon3");
const Image4 = document.querySelector("#weatherIcon4");
const Image5 = document.querySelector("#weatherIcon5");

async function fiveDaysForecast(city) {
    const result = await fetch(
        apiurl + `&q=${city}` + `&appid=${apikey}`
    );
    let data = await result.json();

    console.log(data);

    document.querySelector("#day1Temperature").innerHTML =
        Math.round(data.list[7].main.temp) + "°C";
    document.querySelector("#day2Temperature").innerHTML =
        Math.round(data.list[15].main.temp) + "°C";
    document.querySelector("#day3Temperature").innerHTML =
        Math.round(data.list[23].main.temp) + "°C";
    document.querySelector("#day4Temperature").innerHTML =
        Math.round(data.list[31].main.temp) + "°C";
    document.querySelector("#day5Temperature").innerHTML =
        Math.round(data.list[39].main.temp) + "°C";

    if (data.list[7].weather[0].main == "Clouds") {
       Image1.src = "images/cloud.png";
    } else if (data.list[7].weather[0].main == "Clear") {
       Image1.src = "images/clear.png";
    } else if (data.list[7].weather[0].main == "Rain") {
        Image1.src = "images/raining.png";
    } else if (data.list[7].weather[0].main == "Snowing") {
        Image1.src = "images/snowing.png";
    }

    if (data.list[15].weather[0].main == "Clouds") {
        Image2.src = "images/cloud.png";
    } else if (data.list[15].weather[0].main == "Clear") {
        Image2.src = "images/clear.png";
    } else if (data.list[15].weather[0].main == "Rain") {
        Image2.src = "images/raining.png";
    } else if (data.list[15].weather[0].main == "Snowing") {
        Image2.src = "images/snowing.png";
    }

    if (data.list[23].weather[0].main == "Clouds") {
        Image3.src = "images/cloud.png";
    } else if (data.list[23].weather[0].main == "Clear") {
        Image3.src = "images/clear.png";
    } else if (data.list[23].weather[0].main == "Rain") {
        Image3.src = "images/raining.png";
    } else if (data.list[23].weather[0].main == "Snowing") {
        Image3.src = "images/snowing.png";
    }

    if (data.list[31].weather[0].main == "Clouds") {
       Image4.src = "images/cloud.png";
    } else if (data.list[31].weather[0].main == "Clear") {
        Image4.src = "images/clear.png";
    } else if (data.list[31].weather[0].main == "Rain") {
        Image4.src = "images/raining.png";
    } else if (data.list[31].weather[0].main == "Snowing") {
       Image4.src = "images/snowing.png";
    }

    if (data.list[39].weather[0].main == "Clouds") {
        Image5.src = "images/cloud.png";
    } else if (data.list[39].weather[0].main == "Clear") {
        Image5.src = "images/clear.png";
    } else if (data.list[39].weather[0].main == "Rain") {
        Image5.src = "images/raining.png";
    } else if (data.list[39].weather[0].main == "Snowing") {
        Image5.src = "images/snowing.png";
    }

    const currentDay = new Date();
    const weekday = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];

    console.log(currentDay.getDay());

    function date(day) {
        if (day + currentDay.getDay() > 6) {
            return day + currentDay.getDay() - 7;
        } else {
            return day + currentDay.getDay();
        }
    }

    for (let i = 0; i < 5; i++) {
        document.getElementById("day" + (i + 1)).innerHTML = weekday[date(i)];
    }
}

fiveDaysForecast("vancouver");

searchBtn.addEventListener("click", () => {
    fiveDaysForecast(searchBar.value);
});
});*/
