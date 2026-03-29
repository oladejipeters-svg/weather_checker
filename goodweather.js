const input = document.querySelector("#city");
const form = document.querySelector("#weatherForm");
const cityName = document.querySelector("#cityName");
const temperature = document.querySelector("#temperature");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#windSpeed");
const icon = document.querySelector("#icon");
const errorMsg = document.querySelector("#errorMsg");
const localT = document.querySelector("#localT");
const weatherCondition = document.querySelector("#weatherCondition");

// const networkVar = "good";

function clearInput() {
  input.value = "";
}

function updateBackground(condition) {
  const body = document.body;
  const c = condition.toLowerCase();
  let imageUrl = "";

  if (c === "clear" || c === "sunny") {
    imageUrl = "url('images/clearsunny.png')";
  } else if (c === "partly cloudy") {
    imageUrl = "url('images/partlyCloudy.png')";
  } else if (c === "cloudy" || c === "overcast") {
    imageUrl = "url('images/cloudy.png')";
  } else if (c === "rain" || c === "rainy") {
    imageUrl = "url('images/rainy.png')";
  } else if (c === "snow" || c === "light snow") {
    imageUrl = "url('images/snowy.png')";
  } else if (c === "thunderstorm") {
    imageUrl = "url('images/thunderstorm.png')";
  } else if (c === "fog" || c === "mist") {
    imageUrl = "url('images/fog.png')";
  } else {
    imageUrl = "url('images/myDefault.png')";
  }

  body.style.backgroundImage = imageUrl;
  body.style.backgroundSize = "cover";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundPosition = "center";
}

async function handler(req, res) {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  const apiKey = process.env.WEATHER_API_KEY;

  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`,
    );

    const data = await response.json();

    // Display data
    cityName.textContent = `${data.location.name}, ${data.location.country}`;
    localT.textContent = `Local Time:  ${data.location.localtime}`;
    temperature.textContent = `Temperature: ${data.current.temp_c}°C`;
    humidity.textContent = `Humidity: ${data.current.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.current.wind_kph} kph`;

    // FIXED: icon URL must include https://
    icon.src = `https:${data.current.condition.icon}`;
    weatherCondition.textContent = `Weather Condition is - ${data.current.condition.text}`;

    updateBackground(data.current.condition.text);

    errorMsg.textContent = ""; // clear error
    clearInput();

    console.log(data);
  } catch (error) {
    console.log(error);
    errorMsg.textContent = "Network error. Try again.";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  form.addEventListener("submit", submitHandler);
});
