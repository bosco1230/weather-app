document.addEventListener("DOMContentLoaded", () => {
const cityInput=document.querySelector('#searchBar');
const searchButton= document.querySelector('#searchBtn');
const APIkey='4d697593455ee5751089d0a14f15ecff'
const getWeatherDetails=(cityName,lat,lon)=>{
    const weather_api=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`

    fetch(weather_api).then(res=>res.json()).then(data=>{
        console.log(data)
    }).catch(()=>{
        alert('An error')
    })
}

const getCoordinates=()=>{
    const cityName=cityInput.value.trim();
    if(!cityName)return;
    const GEOCODING_API_URL=`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${APIkey}`;

    fetch(GEOCODING_API_URL).then(res=>res.json()).then(data=>{
        if(!data.length) return alert(`${cityName} cannot be found!`)
        const{name,lat,lon}=data[0];
    getWeatherDetails(name,lat,lon);
    }).catch(()=>{
        alert('An error')
    })
}

searchButton.addEventListener('click',getCoordinates);
});