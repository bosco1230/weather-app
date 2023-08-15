// current section
document.addEventListener("DOMContentLoaded", () => {
    const apiKey = '4d697593455ee5751089d0a14f15ecff';
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric';
    const cityInput = document.querySelector('#searchBar');
    const searchButton = document.querySelector('#searchBtn');
    const starIcon = document.querySelector('#star1');
    const favoriteCitiesSelect = document.querySelector('.favoriteCities');
    
    const autocomplete = new google.maps.places.Autocomplete(cityInput, {
        types: ['(cities)']
    });
    
    async function checkWeatherByCity(city) {
        try {
            const response = await fetch(`${apiUrl}&q=${city}&appid=${apiKey}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
    
            console.log(data);
    
            document.querySelector('#currentWeatherCity').innerHTML = data.name;
            document.querySelector('#currentWeatherTemp').innerHTML = 'Temperature: ' + data.main.temp.toFixed(0) + "°C";
            document.querySelector('#currentWeatherHumidity').innerHTML = 'Humidity: ' + data.main.humidity + '%';
            document.querySelector('#currentWeatherFeel').innerHTML = 'Feels Like: ' + data.main.feels_like.toFixed(0) + '°C';
            document.querySelector('#currentWeatherIcon').src = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    }
    
    function getCoordinates() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherByCoordinates(latitude, longitude);
                },
                (error) => {
                    console.error('Error getting geolocation:', error);
                    checkWeatherByCity('Vancouver');
                }
            );
        } else {
            console.log('Geolocation is not available in this browser.');
            checkWeatherByCity('Vancouver');
        }
    }
    
    function fetchWeatherByCoordinates(latitude, longitude) {
        fetch(`${apiUrl}&lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
            .then(res => res.json())
            .then(data => {
                const cityName = data.name;
                checkWeatherByCity(cityName);
            })
            .catch(error => {
                console.error('Error fetching weather by coordinates:', error);
            });
    }
    
    function searchWeather() {
        const cityName = cityInput.value.trim();
        if (cityName) {
            checkWeatherByCity(cityName);
        }
    }
    
    searchButton.addEventListener('click', searchWeather);
    
    cityInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const place = autocomplete.getPlace();
            if (place.geometry) {
                checkWeatherByPlace(place);
            } else {
                searchWeather(); 
            }
        }
    });
     
    getCoordinates();
    
    starIcon.addEventListener('click', () => {
        starIcon.classList.toggle('fa-regular');
        starIcon.classList.toggle('fa-solid');
        
        const isFavorite = starIcon.classList.contains('fa-solid');
        localStorage.setItem('isFavorite', isFavorite);
    
        const cityName = document.querySelector('#currentWeatherCity').innerHTML;
        let savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    
        if (isFavorite) {
            if (!savedCities.includes(cityName)) {
                savedCities.push(cityName);
            }
        } else {
            const index = savedCities.indexOf(cityName);
            if (index !== -1) {
                savedCities.splice(index, 1);
            }
        }
    
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
        populateFavoriteCities(); // Update the list of favorite cities
    });
    
    favoriteCitiesSelect.addEventListener('change', () => {
        const selectedCity = favoriteCitiesSelect.value;
        checkWeatherByCity(selectedCity);
        updateStarIcon(selectedCity); // Update the star icon based on saved status
    });
    
    // Function to update the star icon based on saved status
    function updateStarIcon(cityName) {
        const savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
        const isFavorite = savedCities.includes(cityName);
    
        if (isFavorite) {
            starIcon.classList.add('fa-solid');
            starIcon.classList.remove('fa-regular');
        } else {
            starIcon.classList.remove('fa-solid');
            starIcon.classList.add('fa-regular');
        }
    
        localStorage.setItem('isFavorite', isFavorite);
    }
    
    function populateFavoriteCities() {
        favoriteCitiesSelect.innerHTML = ''; // Clear existing options
    
        // Retrieve saved cities from local storage
        const savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    
        // Create option elements for each saved city
        savedCities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            favoriteCitiesSelect.appendChild(option);
            
        });
    }
    populateFavoriteCities();
});



// 5 days section 
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
            <h3 id="day1Temperature">Feels Like:${(weatherItem.main.feels_like-273.15).toFixed(0)}°C</h3>
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


// 3 hrs section
const APIkey = "3b2df1883208190d986bcd1b1e48eff4"
const defaultCity = "Vancouver"
const tempertureType = "metric"
const request = `https://api.openweathermap.org/data/2.5/forecast?q=${defaultCity}&appid=${APIkey}&units=${tempertureType}`


const weatherIcon = document.getElementsByClassName("weatherIcon");
// console.log(weatherIcon)

function threeHourRange() {
    fetch(request)
    .then (
        function(response) {
            response.json().then(function(data) {


                // 8 data * 5 days
                const weatherList = data.list
                // console.log(weatherList)


                // to show 3 hours range's weather of the next 5 days, compare it with selected date. 
                const currentDate = new Date();
                const selectedDay = currentDate.getDate() + 1 /* theDay */
                // console.log(currentDate)
                // console.log(currentDate.getDate())


                let index = 0;
                weatherList.forEach(weather => {
                    // console.log(weather)

                    // 3 hours range *40
                    const date = new Date(weather.dt*1000)
                    console.log(date)


                    if(date.getDate() === selectedDay) {
                        const weatherIcon = document.querySelectorAll(".weatherIcon")
                        weatherIcon[index].src = "https://openweathermap.org/img/wn/" + weather["weather"][0]["icon"] + "@4x.png";

                        const threeHrsTemp = document.querySelectorAll(".threeHrsTemp")
                        const temp = Math.floor(weather["main"]["temp"])
                        threeHrsTemp[index].innerHTML = temp+"℃"

                        index += 1;
                        console.log(date.getDate(), weather["main"]["temp"])
                    }
                })
            })
        }
    )

}

threeHourRange()

