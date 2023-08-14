const apiKey = "3b2df1883208190d986bcd1b1e48eff4"
const defaultCity = "Vancouver"
const tempertureType = "metric"
const request = `https://api.openweathermap.org/data/2.5/forecast?q=${defaultCity}&appid=${apiKey}&units=${tempertureType}`


const weatherIcon = document.getElementsByClassName("weatherIcon");
// console.log(weatherIcon)

threeHourRange() {
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
    )}

// threeHourRange()