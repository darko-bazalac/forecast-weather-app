const searchBtn = document.querySelector(".submit-btn");
const form = document.querySelector("form");
const mainContainer = document.getElementById("main-container");
const errorMsg = document.querySelector(".error-msg");
let regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const toggleSwitch = document.querySelector("[switch]");
let city = "Kraljevo";
getData(city, "metric");

searchBtn.addEventListener("click", fetchWeather);
form.addEventListener("submit", fetchWeather);
// celsiusBtn.addEventListener("click", () => {
//   getData(city, "imperial");
// });

// Fetching API
async function getData(city, units) {
  try {
    const resp = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=4045f7b026733291f6fe104d28c865c9&units=${units}`,
      { mode: "cors" },
    );
    const data = await resp.json();
    const newData = processData(data);
    console.log(newData, data);
    errorMsg.style.display = "none";
    displayData(newData);
    form.reset();
  } catch (err) {
    errorMsg.style.display = "block";
    if (errorMsg.classList.contains("fade-in")) {
      errorMsg.style.display = "none";
      errorMsg.classList.remove("fade-in2");
      errorMsg.offsetWidth;
      errorMsg.classList.add("fade-in");
      errorMsg.style.display = "block";
    } else {
      errorMsg.classList.add("fade-in");
    }
  }
}

// Collecting user input
function fetchWeather(e) {
  e.preventDefault();
  const input = document.querySelector('input[type="text"]');
  const userLocation = input.value;
  city = userLocation;
  getData(userLocation, "metric");
}

// Processing collected data
function processData(data) {
  const myData = {
    city: data.name,
    country: data.sys.country,
    condition: data.weather[0].description.toUpperCase(),
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    wind: Math.round(data.wind.speed * (18 / 5)),
    humidity: data.main.humidity,
    mainWeather: data.weather[0].main,
    timezone: data.timezone,
  };
  return myData;
}
// Displaying data on page
function displayData(data) {
  mainContainer.style.backgroundImage = `url("images/${data.mainWeather}.jpg")`;

  const dateAndTime = data.timezone;

  const datePreview = (document.querySelector(".date").innerHTML =
    getLocalTime(dateAndTime));

  const cityName = (document.querySelector(".location").innerHTML = `${
    data.city
  }, ${regionNames.of(data.country)}`);

  const temp = (document.querySelector(".temp").innerHTML = `${data.temp}`);

  const condition = (document.querySelector(
    ".condition",
  ).innerHTML = `${data.condition}`);

  const tempFeeling = (document.querySelector(
    ".feels-like",
  ).innerHTML = `FEELS LIKE: ${data.feelsLike}`);

  const humidity = (document.querySelector(
    ".humidity",
  ).innerHTML = `HUMIDITY: ${data.humidity}`);

  const wind = (document.querySelector(
    ".wind",
  ).innerHTML = `WIND: ${data.wind} km/h`);
}

/*Get local time function */
function getLocalTime(data) {
  let date = new Date();
  let time = date.getTime();
  let localOffset = date.getTimezoneOffset() * 60000;
  let utc = time + localOffset;
  let localTime = utc + 1000 * data;
  let localTimeDate = new Date(localTime);
  return localTimeDate.toLocaleString();
}
