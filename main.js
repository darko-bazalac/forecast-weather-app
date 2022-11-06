const searchBtn = document.querySelector(".submit-btn");
const form = document.querySelector("form");
const mainContainer = document.getElementById("main-container");
const errorMsg = document.querySelector(".error-msg");
const toggleSwitch = document.querySelector("[switch]");
const temp = document.querySelector(".temp");
const tempFeeling = document.querySelector(".feels-like");
const wind = document.querySelector(".wind");
const datePreview = document.querySelector(".date");
const cityName = document.querySelector(".location");
const condition = document.querySelector(".condition");
const humidity = document.querySelector(".humidity");
let regionNames = new Intl.DisplayNames(["en"], { type: "region" });

let city = "Kraljevo";
let unit = "metric";
getData(city, unit);

searchBtn.addEventListener("click", fetchWeather);
form.addEventListener("submit", fetchWeather);

// Fetch API
async function getData(city, units) {
  try {
    const resp = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=4045f7b026733291f6fe104d28c865c9&units=${units}`,
      { mode: "cors" },
    );
    const data = await resp.json();
    const newData = processData(data);

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
  getData(userLocation, unit);
}

// Processing collected data
function processData(data) {
  const myData = {
    city: data.name,
    country: data.sys.country,
    condition: data.weather[0].description.toUpperCase(),
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    wind:
      unit === "metric"
        ? Math.round(data.wind.speed * (18 / 5))
        : Math.round(data.wind.speed),
    humidity: data.main.humidity,
    mainWeather: data.weather[0].main.toLowerCase(),
    timezone: data.timezone,
  };
  return myData;
}
// Displaying data on page
function displayData(data) {
  mainContainer.style.backgroundImage = `url("./images/${data.mainWeather}.jpg")`;
  let metricOrImp = unit === "metric" ? "&degC" : "&degF";
  let windMph = unit === "metric" ? "km/h" : "mph";

  const dateAndTime = data.timezone;

  datePreview.innerHTML = getLocalTime(dateAndTime);

  cityName.innerHTML = `${data.city}, ${regionNames.of(data.country)}`;

  temp.innerHTML = `${data.temp}${metricOrImp}`;

  condition.innerHTML = `${data.condition}`;

  tempFeeling.innerHTML = `Feels like: ${data.feelsLike}${metricOrImp}`;

  humidity.innerHTML = `Humidity: ${data.humidity}`;

  wind.innerHTML = `Wind: ${data.wind}${windMph}`;

  // Temp switch
  let tempValue = data.temp;
  let tempFeelValue = data.feelsLike;
  toggleSwitch.addEventListener("change", () => {
    if (toggleSwitch.checked) {
      unit = "imperial";
      tempValue = toFahrenheit(tempValue);
      tempFeelValue = toFahrenheit(tempFeelValue);
      temp.innerHTML = `${tempValue + "&degF"}`;
      tempFeeling.innerHTML = `${"Feels like: "}${tempFeelValue + "&degF"}`;
      wind.innerHTML = `Wind: ${Math.round(data.wind * 0.6)} mph`;
    } else {
      tempValue = toCelsius(tempValue);
      tempFeelValue = toCelsius(tempFeelValue);
      temp.innerHTML = `${tempValue + "&degC"}`;
      tempFeeling.innerHTML = `${"Feels like: "}${tempFeelValue + "&degC"}`;
      wind.innerHTML = `Wind: ${data.wind} km/h`;
      unit = "metric";
    }
  });
}

// Temp convert
function toFahrenheit(temp) {
  return Math.round(temp * 1.8 + 32);
}
function toCelsius(temp) {
  return Math.round((temp - 32) * (5 / 9));
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
