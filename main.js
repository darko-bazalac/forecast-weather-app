const searchBtn = document.querySelector(".submit-btn");
const form = document.querySelector("form");
const mainContainer = document.getElementById("main-container");
const error = document.querySelector(".error-msg");
let city = "Kraljevo";
getData(city);

searchBtn.addEventListener("click", fetchWeather);
form.addEventListener("submit", fetchWeather);

async function getData(city) {
  try {
    const resp = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=4045f7b026733291f6fe104d28c865c9&units=metric`,
      { mode: "cors" },
    );
    error.style.display = "none";
    const data = await resp.json();
    const newData = processData(data);
    console.log(newData, data);
    displayData(newData);
    form.reset();
  } catch (err) {
    error.style.display = "block";
    if (error.classList.contains("fade-in")) {
      error.style.display = "none";
      error.classList.remove("fade-in2");
      error.offsetWidth;
      error.classList.add("fade-in");
      error.style.display = "block";
    } else {
      error.classList.add("fade-in");
    }
  }
}

function fetchWeather(e) {
  e.preventDefault();
  const input = document.querySelector('input[type="text"]');
  const userLocation = input.value;
  getData(userLocation);
}

function processData(data) {
  const myData = {
    condition: data.weather[0].description,
    feelsLike: data.main.feels_like,
    wind: data.wind.speed,
    humidity: data.main.humidity,
    mainWeather: data.weather[0].main,
  };
  return myData;
}

function displayData(data) {
  mainContainer.style.backgroundImage = `url("images/${data.mainWeather}.jpg")`;
}
