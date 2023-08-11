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
            document.querySelector('#currentWeatherTemp').innerHTML = 'Temperature: ' + data.main.temp.toFixed(1) + "°C";
            document.querySelector('#currentWeatherHumidity').innerHTML = 'Humidity: ' + data.main.humidity + '%';
            document.querySelector('#currentWeatherFeel').innerHTML = 'Feels Like: ' + data.main.feels_like.toFixed(1) + '°C';
            document.querySelector('#currentWeatherIcon').src = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    }
    
    async function checkWeatherByPlace(place) {
        try {
            const cityName = place.formatted_address;
            const response = await fetch(`${apiUrl}&q=${cityName}&appid=${apiKey}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
    
            console.log(data);
    
            document.querySelector('#currentWeatherCity').innerHTML = data.name;
            document.querySelector('#currentWeatherTemp').innerHTML = 'Temperature: ' + data.main.temp.toFixed(1) + "°C";
            document.querySelector('#currentWeatherHumidity').innerHTML = 'Humidity: ' + data.main.humidity + '%';
            document.querySelector('#currentWeatherFeel').innerHTML = 'Feels Like: ' + data.main.feels_like.toFixed(1) + '°C';
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