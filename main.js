const searchInput = document.querySelector("input");
const searchBtn = document.querySelector(".submit-btn");
const form = document.querySelector("form");

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
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=4045f7b026733291f6fe104d28c865c9&units=metric",
    { mode: "cors" },
  );
  const data = await resp.json();
  console.log(data);
  form.reset();
}

function fetchWeather() {
  const input = document.querySelector('input[type="text"]');
  const userLocation = input.value;
  getData(userLocation);
}
