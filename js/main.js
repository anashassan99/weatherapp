let api_key = "dcd2aa9ecafdd527cf526d27be89fb9f";
const current_weather_card = document.querySelectorAll(
  ".weather_left .card"
)[0];
const fiveday_card = document.querySelector(".day_forcast");
const aqi_card = document.querySelectorAll(".highlights .card")[0];
const sunrise_card = document.querySelectorAll(".highlights .card")[1];
const humidity_value = document.getElementById("humidity_box");
const pressure_value = document.getElementById("pressure_box");
const visibility_value = document.getElementById("visibility_box");
const wind_value = document.getElementById("wind_box");
const feels_value = document.getElementById("feels_box");
const hourly_forcast_value = document.querySelector(".hourly_forcast");
const aqi_list = ["Good", "Fair", "Moderate", "poor", "very poor"];
// funtion get weather now
const get_weather_detalis = (name, lat, lon, country, state) => {
  // api forcast
  let forcast_api = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
  //   api weather now
  let weather_api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
  //   weather polution
  let polution_api = `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
  (days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]),
    (months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]);
  // fetch polution
  fetch(polution_api)
    .then((res) => res.json())
    .then((data) => {
      let { co, no, no2, so2, o3, pm2_5, pm10, nh3 } = data.list[0].components;
      aqi_card.innerHTML = `
                    <div class="card_head">
                            <p>Air Quality Index</p>
                            <p class="air_index qs${data.list[0].main.aqi}">${
        aqi_list[data.list[0].main.aqi - 1]
      }</p>
              </div>
              <div class="air_indices">
                <i class="fa-solid fa-wind fa-3x"></i>
                <div class="item">
                  <p>PM.2</p>
                  <h2>${pm2_5}</h2>
                </div>
                <div class="item">
                  <p>PM.10</p>
                  <h2>${pm10}</h2>
                </div>
                <div class="item">
                  <p>SO2</p>
                  <h2>${so2}</h2>
                </div>
                <div class="item">
                  <p>CO</p>
                  <h2>${co}</h2>
                </div>
                  <div class="item">
                  <p>NO</p>
                  <h2>${no}</h2>
                </div>
                <div class="item">
                  <p>NO2</p>
                  <h2>${no2}</h2>
                </div>
                <div class="item">
                  <p>NH3</p>
                  <h2>${nh3}</h2>
                </div>
                <div class="item">
                  <p>O3</p>
                  <h2>${o3}</h2>
                </div>
              </div>`;
    });
  // fetch weather now
  fetch(weather_api)
    .then((res) => res.json())
    .then((data) => {
      let date = new Date();
      current_weather_card.innerHTML = `
              <div class="current_weather">
              <div class="detalils">
                <p>now</p>
                <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                <p>${data.weather[0].description}</p>
              </div>
              <div class="weather_icon">
                <img
                  src="https://openweathermap.org/img/wn/${
                    data.weather[0].icon
                  }@2x.png"
                  alt="weather_icon"
                />
              </div>
            </div>
            <hr />
            <div class="card_footer">
                <p><i class="fa-regular fa-calendar"></i> ${
                  days[date.getDay()]
                }, ${date.getDate()}, ${
        months[date.getMonth()]
      } ${date.getFullYear()}</p>
              <p><i class="fa-solid fa-location-dot"></i> ${name} ${country}</p>
            </div>`;
      let { sunrise, sunset } = data.sys,
        { timezone, visibility } = data,
        { humidity, pressure, feels_like } = data.main,
        { speed } = data.wind;
      sunrise_time = moment
        .utc(sunrise, "X")
        .add(timezone, "seconds")
        .format("hh:mm A");
      sunset_time = moment
        .utc(sunset, "X")
        .add(timezone, "seconds")
        .format("hh:mm A");
      sunrise_card.innerHTML = ` 
       <div class="card_head">
                <p>Sunrise & Sunset</p>
              </div>
              <div class="sunrise_sunset">
                <div class="item">
                  <div class="icon">
                    <i class="fa-light fa-sunrise fa-4x"></i>
                  </div>
                  <div>
                    <p>Sunrise</p>
                    <h2>${sunrise_time}</h2>
                  </div>
                </div>
                <div class="item">
                  <div class="icon">
                    <i class="fa-light fa-sunset fa-4x"></i>
                  </div>
                  <div>
                    <p>sunset</p>
                    <h2>${sunset_time}</h2>
                  </div>
                </div>
              </div>`;
      humidity_value.innerHTML = `${humidity}%`;
      pressure_value.innerHTML = `${pressure}hPa`;
      visibility_value.innerHTML = `${visibility / 1000}km`;
      wind_value.innerHTML = `${speed}m/s`;
      feels_value.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;
    });
  // fetch next 5 days
  fetch(forcast_api)
    .then((res) => res.json())
    .then((data) => {
      let hourly_forcast = data.list;
      hourly_forcast_value.innerHTML = "";
      for (let i = 0; i <= 7; i++) {
        let hrforcast_date = new Date(hourly_forcast[0].dt_txt);
        let hr = hrforcast_date.getHours();
        let a = "PM";
        if (hr < 12) a = "AM";
        if (hr == 0) hr = 12;
        if (hr > 12) hr = hr - 12;
        hourly_forcast_value.innerHTML += `
         <div class="card">
              <p>${hr} ${a}</p>
              <img
                src="https://openweathermap.org/img/wn/${
                  hourly_forcast[i].weather[0].icon
                }.png"
                alt="forcast"
              />
              <p>${(hourly_forcast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
            </div>`;
      }
      let uniq_force_days = [];
      let five_days_force = data.list.filter((forcast) => {
        let force_date = new Date(forcast.dt_txt).getDate();
        if (!uniq_force_days.includes(force_date)) {
          return uniq_force_days.push(force_date);
        }
      });
      fiveday_card.innerHTML = "";
      for (let i = 0; i < five_days_force.length; i++) {
        let date = new Date(five_days_force[i].dt_txt);
        fiveday_card.innerHTML += `
         <div class="forcast_item">
                <div class="icon_wrapper">
                  <img
                    src="https://openweathermap.org/img/wn/${
                      five_days_force[i].weather[0].icon
                    }.png"
                    alt="weather_icon"
                  />
                  <span>${(five_days_force[i].main.temp - 273.15).toFixed(
                    2
                  )}&deg;C</span>
                </div>
                <p>${date.getDate()} ${months[date.getMonth()]} </p>
                <p>${days[date.getDay()]}</p>
              </div>`;
      }
    });
};
// search based on name city
const get_city = () => {
  let city_name = city_box.value.trim();
  if (!city_name) {
    city_name = "Cairo";
  }
  city_box.value = "";
  let gecoding_api = `https://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=1&appid=${api_key}`;
  fetch(gecoding_api)
    .then((res) => res.json())
    .then((data) => {
      let { name, lat, lon, country, state } = data[0];
      get_weather_detalis(name, lat, lon, country, state);
    });
};
const get_location = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    let { latitude, longitude } = position.coords;
    let revers_url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;
    fetch(revers_url)
      .then((res) => res.json())
      .then((data) => {
        let { name, country, state } = data[0];
        get_weather_detalis(name, latitude, longitude, country, state);
      });
  });
};
search_btn.addEventListener("click", get_city);
location_btn.addEventListener("click", get_location);
city_box.addEventListener("keyup", (e) => e.key === "Enter" && get_city());
window.addEventListener("load", get_city);
