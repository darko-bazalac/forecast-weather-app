const searchInput = document.querySelector("input");
const searchBtn = document.querySelector(".submit-btn");
const form = document.querySelector("form");
const mainContainer = document.getElementById("main-container");
let city = "Kraljevo";
getData(city);

searchBtn.addEventListener("click", e => {
  e.preventDefault();
  fetchWeather();
});

form.addEventListener("submit", e => {
  e.preventDefault();
  fetchWeather();
});

async function getData(city) {
  const resp = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=4045f7b026733291f6fe104d28c865c9&units=metric`,
    { mode: "cors" },
  );
  const data = await resp.json();
  const newData = processData(data);
  mainContainer.style.backgroundImage = `url("images/${newData.mainWeather}.jpg")`;
  console.log(newData, data);
  // displayData(newData);
  form.reset();
}

function fetchWeather() {
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
