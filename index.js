// current section
const apiKey = '4d697593455ee5751089d0a14f15ecff';
const temperatureType = "metric"
let selectedCity = "Fukuoka"


// document.addEventListener("DOMContentLoaded", () => {
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
            selectedCity = data.name
            console.log(data.name)
            showFiveDaysWeather();
            threeHourRange();
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
        showFiveDaysWeather();
        threeHourRange();
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
// });



// // 5 days section 


let weatherIcons = document.getElementsByClassName("weatherIcons");
let theDay = 0;


//calling 3hrs function bny addeventlistener
const day1 = document.getElementById("day1")
day1.addEventListener("click", () => {
    theDay = 1;
    selectedCity = document.getElementById("currentWeatherCity").innerHTML
    threeHourRange();
})

const day2 = document.getElementById("day2")
day2.addEventListener("click", () => {
    theDay = 2;
    selectedCity = document.getElementById("currentWeatherCity").innerHTML
    threeHourRange();
})

const day3 = document.getElementById("day3")
day3.addEventListener("click", () => {
    theDay = 3;
    selectedCity = document.getElementById("currentWeatherCity").innerHTML
    threeHourRange();
})

const day4 = document.getElementById("day4")
day4.addEventListener("click", () => {
    theDay = 4;
    selectedCity = document.getElementById("currentWeatherCity").innerHTML
    threeHourRange();
})

const day5 = document.getElementById("day5")
day5.addEventListener("click", () => {
    theDay = 5;
    selectedCity = document.getElementById("currentWeatherCity").innerHTML
    threeHourRange();
})


function showFiveDaysWeather() {
    const request = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&units=${temperatureType}&appid=${apiKey}`

    console.log("a")
    fetch(request)
    .then(
        function(response) {
            if(response.status !== 200){
                return;
            }
            response.json().then(function(fiveDaysWeather) {
                console.log(fiveDaysWeather);


                // get currentDate
                let currentDate = new Date();

                
                // for the if statement to specific the date, the time and weather infos
                let day = 1;


                // get all the weather info
                fiveDaysWeather["list"].forEach( eachWeatherInfo=> {
                    // console.log(eachWeatherInfo);
                

                    // convert unix-time to date
                    let date = new Date(eachWeatherInfo["dt"] * 1000);  


                    // show the next 5 days' weather              
                    if(date.getDate() === currentDate.getDate() + day) {
                        // just getting time at the same time everyday
                        if(date.getHours() >=6 && date.getHours() <=9) {


                            // show days for the next 5 days
                            if(date.getDay() === 0){
                                let showDay = "Sun"
                                document.getElementById(`showDay${day}`).innerHTML= showDay + " " + toMonthText(date.getMonth()) + date.getDate()     
                                console.log("a")
                            } else if(date.getDay()=== 1){
                                let showDay = "Mon"
                                document.getElementById(`showDay${day}`).innerHTML= showDay + " " + toMonthText(date.getMonth()) + date.getDate() 
                                console.log("b")
                            } else if(date.getDay() === 2){
                                let showDay = "Tue"
                                document.getElementById(`showDay${day}`).innerHTML= showDay + " " + toMonthText(date.getMonth()) + date.getDate() 
                                console.log("c")
                            } else if(date.getDay() === 3){
                                let showDay = "Wed"
                                document.getElementById(`showDay${day}`).innerHTML= showDay + " " + toMonthText(date.getMonth()) + date.getDate() 
                                console.log("d")
                            } else if(date.getDay() === 4){
                                let showDay = "Thu"
                                document.getElementById(`showDay${day}`).innerHTML= showDay + " " + toMonthText(date.getMonth()) + date.getDate() 
                                console.log("e")
                            } else if(date.getDay() === 5){
                                let showDay = "Fri"
                                document.getElementById(`showDay${day}`).innerHTML= showDay + " " + toMonthText(date.getMonth()) + date.getDate() 
                            } else if(date.getDay() === 6){
                                let showDay = "Sat"
                                document.getElementById(`showDay${day}`).innerHTML= showDay + " " + toMonthText(date.getMonth()) + date.getDate() 
                            }
                            
                            // get the month and the day for the next 5days
                            // document.getElementById(`monthOn${day}Day`).innerHTML= toMonthText(date.getMonth()) + date.getDate()
                            
                            // document.getElementById(`day${day}-temp`).innerHTML= eachWeatherInfo["weather"][0]["main"]
                            weatherIcons[day-1].src = "https://openweathermap.org/img/wn/" + eachWeatherInfo["weather"][0]["icon"] + "@4x.png";

                            let temp = Math.floor(eachWeatherInfo["main"]["temp"])
                            console.log(temp)
                            document.getElementById(`day${day}-temp`).innerHTML= temp + "℃"
                            
                            day = day +1; 
                        }
                    }
                })
            })
        }
    ).catch((error) => {
        console.log("Fetch Error: " + error)
    })
}

// showFiveDaysWeather()

function toMonthText(month) {
    switch(month) {
        case 0:
            return "Jan."
        case 1:
            return "Fab."
        case 2:
            return "Mar."
        case 3:
            return "Apr."
        case 4:
            return "May."
        case 5:
            return "Jun."
        case 6:
            return "Jul."
        case 7:
            return "Aug."
        case 8:
            return "Sep."
        case 9:
            return "Oct."
        case 10:
            return "Nov."
        case 11:
            return "Dec."
    }
}



// // 3 hrs section
// const APIkey = "3b2df1883208190d986bcd1b1e48eff4"
const tempertureType = "metric"


const weatherIcon = document.getElementsByClassName("weatherIcon");
// console.log(weatherIcon)

function threeHourRange() {
    const request = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=${apiKey}&units=${tempertureType}`
    fetch(request)
    .then (
        function(response) {
            response.json().then(function(data) {


                // 8 data * 5 days
                const weatherList = data.list
                console.log(weatherList)


                // to show 3 hours range's weather of the next 5 days, compare it with selected date. 
                const currentDate = new Date();
                const selectedDay = currentDate.getDate() + theDay
                // console.log(currentDate)
                // console.log(currentDate.getDate())


                let index = 0;
                weatherList.forEach(weather => {
                    // console.log(weather)

                    // 3 hours range *40
                    const date = new Date(weather.dt*1000)
                    // console.log(date)


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

// threeHourRange()

