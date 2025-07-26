const locationInput = document.getElementById("locationInput")
const cityName = document.getElementById("cityName")
const weatherDeg = document.getElementById("weatherDeg")
const weatherIcon = document.querySelectorAll("#weatherIcon")
const Weathercondition = document.querySelectorAll("#Weathercondition")
const weatherDay = document.getElementById("weatherDay")
const weatherDate = document.getElementById("weatherDate")
const secondweatherDay = document.getElementById("secondweatherDay")
const thirdweatherDay = document.getElementById("thirdweatherDay")
const minWeatherDeg = document.querySelectorAll(".minWeatherDeg")
const maxWeatherDeg = document.querySelectorAll(".maxWeatherDeg")


let city;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            let data = await (await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)).json()
            city = data.address.city || data.address.town || data.address.village || "لم يتم العثور على المدينة";
            // console.log(response.address);
            getWeather(city)
        }, error => {
            console.log(error);

        })
    }
}
getLocation()

async function getWeather(city) {
    let data = await (await fetch(`http://api.weatherapi.com/v1/forecast.json?key=d3009501cfbc4064b78131238252607&q=${city}&days=3`)).json()
    cityName.innerText = data.location.name;
    weatherDeg.innerHTML = data.current.temp_c + "<sup>o</sup>C";

    weatherIcon[0].src = data.current.condition.icon;
    weatherIcon[1].src = data.forecast.forecastday[1].day.condition.icon;
    weatherIcon[2].src = data.forecast.forecastday[2].day.condition.icon;

    Weathercondition[0].innerText = data.current.condition.text
    Weathercondition[1].innerText = data.forecast.forecastday[1].day.condition.text
    Weathercondition[2].innerText = data.forecast.forecastday[2].day.condition.text

    const firstForecastDate = data.forecast.forecastday[0].date;
    weatherDate.innerHTML = data.forecast.forecastday[0].date;
    const dayName = getDayName(firstForecastDate);
    weatherDay.innerText = dayName;

    const secondForecastDate = data.forecast.forecastday[1].date;
    const secondDayName = getDayName(secondForecastDate);
    secondweatherDay.innerText = secondDayName;

    const thirdForecastDate = data.forecast.forecastday[2].date;
    const thirdDayName = getDayName(thirdForecastDate);
    thirdweatherDay.innerText = thirdDayName;

    maxWeatherDeg[0].innerHTML = data.forecast.forecastday[1].day.maxtemp_c + "<sup>o</sup>C"
    maxWeatherDeg[1].innerHTML = data.forecast.forecastday[2].day.maxtemp_c + "<sup>o</sup>C"

    minWeatherDeg[0].innerHTML = data.forecast.forecastday[1].day.mintemp_c + "<sup>o</sup>C"
    minWeatherDeg[1].innerHTML = data.forecast.forecastday[2].day.mintemp_c + "<sup>o</sup>C"
}


    locationInput.addEventListener("input", async function (e) {
    const citySearchValue = e.target.value.trim();

    if (citySearchValue.length >= 3) {
        try {
            await getWeather(citySearchValue); 
        } catch (err) {
            console.error( err);
        }
    }
});

function getDayName(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long' };
    return date.toLocaleDateString('en-US', options);

}
