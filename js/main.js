let api_key = "dcd2aa9ecafdd527cf526d27be89fb9f";
const current_weather_card = document.querySelectorAll(
  ".weather_left .card"
)[0];
const fiveday_card = document.querySelector(".day_forcast");

// funtion get weather now
const get_weather_detalis = (name, lat, lon, country, state) => {
  // api forcast
  let forcast_api = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
  //   api weather now
  let weather_api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
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
                  src="http://openweathermap.org/img/wn/${
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
    });
  // fetch next 5 days
  fetch(forcast_api)
    .then((res) => res.json())
    .then((data) => {
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
                    src="http://openweathermap.org/img/wn/${
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
  city_box.value = "";
  if (!city_name) return;
  let gecoding_api = `http://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=1&appid=${api_key}`;
  fetch(gecoding_api)
    .then((res) => res.json())
    .then((data) => {
      let { name, lat, lon, country, state } = data[0];
      get_weather_detalis(name, lat, lon, country, state);
    });
};
search_btn.addEventListener("click", get_city);
