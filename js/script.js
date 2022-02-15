// DOM Elements
const time = document.querySelector("#time"),
  greeting = document.querySelector("#greeting"),
  name = document.querySelector("#name"),
  focus = document.querySelector("#focus"),
  switchButton = document.querySelector(".switch-button"),
  chechbox = document.querySelector(".switch-button-checkbox"),
  label12h = document.querySelector(".switch-button-label"),
  label24h = window.getComputedStyle(
    document.querySelector(".switch-button"),
    ":before"
  ),
  temperatureDescription = document.querySelector(".temperature-description"),
  temperatureDegree = document.querySelector(".temperature-degree"),
  locationTimeZone = document.querySelector(".location-timezone"),
  temperatureDescription_1 = document.querySelector(
    ".temperature-description-big"
  ),
  temperatureDegree_1 = document.querySelector(".temperature-degree-big"),
  locationTimeZone_1 = document.querySelector(".location-timezone-big");

// Options
let showAmPm = true;
let timeType; //= true; // true = 24 hours, false = 12 hours
let timeZone;
let feelsLike;
let wind;
let airHumidity;
let pressure;

// Show the time
function showTime() {
  let today = new Date(),
    hour = today.getHours(),
    min = today.getMinutes(),
    sec = today.getSeconds();

  // Set AM or PM
  const amPm = hour >= 12 ? "PM" : "AM"; // hour по дефолту 0-23ч

  if (timeType == false) {
    // 12hr Format
    showAmPm = false;
  } else {
    hour = hour % 12 || 12;
  }

  // Output time
  time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(
    sec
  )} ${showAmPm ? amPm : ""}`;

  setTimeout(showTime, 1000);
}

// Add zeros
function addZero(n) {
  return (parseInt(n, 10) < 10 ? "0" : "") + n; // (n, 10) где 10 - сиситема исчесления (десятичная)
}

// Set background and greeting
function setBackGroundGreeting() {
  let today = new Date(),
    hour = today.getHours();

  if (hour > 3 && hour < 12) {
    // Morning
    document.body.style.background = "url(../img/morning.jpg) no-repeat";
    greeting.textContent = "Good Morning";
  } else if (hour < 16) {
    // Afternoon
    document.body.style.background = "url(../img/day.jpg) no-repeat top/100%";
    greeting.textContent = "Good Afternoon";
  } else if (hour < 20) {
    // Evening
    document.body.style.background =
      "url(../img/evening.jpg) no-repeat top/100%";
    greeting.textContent = "Good Evening";
  } else {
    document.body.style.background = "url(../img/night.jpg) no-repeat top/100%";
    greeting.textContent = "Good Evening";
    document.body.style.color = "white";
  }

  setTimeout(setBackGroundGreeting, 1000 * 60 * 60);
}

// Get Name
function getName() {
  if (localStorage.getItem("name") === null) {
    // sessionStorage
    name.textContent = `[Enter Name]`;
  } else {
    name.textContent = localStorage.getItem("name");
  }
}

// Set Name
function setName(e) {
  if (e.type === "keypress") {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      localStorage.setItem("name", e.target.innerText);
      name.blur();
    }
  } else {
    localStorage.setItem("name", e.target.innerText);
  }
}

// Get focus
function getFocus() {
  if (localStorage.getItem("focus") === null) {
    // sessionStorage
    focus.textContent = `[Enter focus]`;
  } else {
    focus.textContent = localStorage.getItem("focus");
  }
}

// Set focus
function setFocus(e) {
  if (e.type === "keypress") {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      localStorage.setItem("focus", e.target.innerText);
      focus.blur();
    }
  } else {
    localStorage.setItem("focus", e.target.innerText);
  }
}

function getTimeType() {
  if (localStorage.getItem("timeType") === null) {
    timeType = false;
  } else {
    timeType = localStorage.getItem("timeType");
    chechbox.checked = timeType === "true" ? true : false;
  }
}

name.addEventListener("keypress", setName);
name.addEventListener("blur", setName);
focus.addEventListener("keypress", setFocus);
focus.addEventListener("blur", setFocus);
switchButton.addEventListener("click", setTime);
switchButton.addEventListener("click", (e) =>
  localStorage.setItem("timeType", e.target.checked)
);

showTime();
setBackGroundGreeting();
getName();
getFocus();
getTimeType();
setTime();
setWeather();

function setTime() {
  setTimeout(function () {
    if (chechbox.checked) {
      console.log("checked");
      label12h.style.color = "rgb(146, 146, 146)";
      switchButton.style.color = "black";
      showAmPm = false;
      timeType = false;
    } else {
      console.log("none");
      label12h.style.color = "black";
      switchButton.style.color = "rgb(146, 146, 146)";
      showAmPm = true;
      timeType = true;
    }
    showTime();
  }, 0);
}

// window.addEventListener("load", setWeather);

function setWeather() {
  // weatherapi.com
  let long; // высота
  let lat; // широта
  let lang; // language

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      long = position.coords.longitude;
      lat = position.coords.latitude;
      lang = "en"; //ru
      const api = `http://api.weatherapi.com/v1/current.json?key=b76b0a3174694eddb11162855221402&q=${lat},${long}&aqi=no&lang=${lang}`;

      fetch(api)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          const {
            temp_c,
            condition,
            feelslike_c,
            wind_kph,
            humidity,
            pressure_mb,
          } = data.current;
          const { tz_id } = data.location;
          // Set DOM elements from API
          temperatureDegree.textContent = temp_c;
          // condition.text = "qqqqq qqq rtk,g rllvl qqq qqqq qqq";
          temperatureDescription.textContent = condition.text;
          locationTimeZone.textContent = tz_id.slice(tz_id.indexOf("/") + 1);
          timeZone = tz_id;
          console.log(timeZone);
          // Set Icon
          document.querySelector(".icon").src = condition.icon;
          ///////////////////////////
          feelsLike = feelslike_c;
          wind = wind_kph;
          airHumidity = humidity;
          pressure = Math.round(pressure_mb / 1.3332239);

          /////////////////////////////
          if (condition.text.length > 10) {
            temperatureDescription.style.textAlign = "right";
          }
          if (condition.text.length > 25) {
            temperatureDescription.style.width = "100px";
            document.querySelector(".degree-section").style.width = "100px";
          }
          if (locationTimeZone.textContent.length > 7) {
            temperatureDescription.style.paddingTop = "4px";
            locationTimeZone.style.width = "auto";
            locationTimeZone.style.maxWidth = "200px";
          }
          ////////////////////////////
        });
    });
  }

  setTimeout(setWeather, 1000 * 60 * 60 * 3);
}

function setWeatherBig() {
  temperatureDegree_1.textContent = temperatureDegree.textContent;
  temperatureDescription_1.textContent = temperatureDescription.textContent;
  locationTimeZone_1.textContent = timeZone.replace("/", ", ");
  document.querySelector(".icon-big").src = document.querySelector(".icon").src;
  document.querySelector(".feels-like").textContent = feelsLike;
  document.querySelector(".wind").textContent = wind;
  document.querySelector(".humidity").textContent = airHumidity;
  document.querySelector(".pressure").textContent = pressure;
}

document.querySelector(".weather").addEventListener("click", () => {
  setWeatherBig();
  document.querySelector(".weather").style.display = "none";
  document.querySelector("#weather-big").style.display = "block";
  document.querySelector("#weather-big").style.width = "30%";
  document.querySelector("#weather-big").style.height = "27%";
  const hiddenArr = [...document.querySelectorAll(".hidden")];
  hiddenArr.forEach((el) => (el.style.display = "block"));
  const hiddenFlexArr = [...document.querySelectorAll(".hidden-flex")];
  hiddenFlexArr.forEach((el) => (el.style.display = "flex"));

  // console.log((document.querySelectorAll(".hidden").style.display = "block"));
  // document.querySelectorAll(".hidden").style.opacity = "1";
});
document.querySelector("#weather-big").addEventListener("click", () => {
  document.querySelector("#weather-big").style.display = "none";
  document.querySelector(".weather").style.display = "block";
  // document.querySelectorAll(".hidden").style.display = "none";
  // document.querySelectorAll(".hidden").style.display = "none";
});

// wait();
