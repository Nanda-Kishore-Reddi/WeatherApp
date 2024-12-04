import './style.css';

const form = document.getElementById('weather-form');
const locationInput = document.getElementById('location');
const weatherInfo = document.getElementById('weather-info');
const loading = document.getElementById('loading');
const cityName = document.getElementById('city-name');
const tempElement = document.getElementById('temp');
const conditionElement = document.getElementById('condition');
const humidityElement = document.getElementById('humidity');

// Containers for hourly and daily forecasts
const hourlyContainer = document.getElementById('hourly-container');
const dailyContainer = document.getElementById('daily-container');

const weatherApiKey = 'df593b7fb74e80356d67edf1c8c500b6';
const weatherBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall';

async function getWeather(location) {
  try {
    console.log(`${weatherBaseUrl}?q=${location}&units=metric&appid=${weatherApiKey}`)
    // Get latitude and longitude for the location
    const response = await fetch(
      `${weatherBaseUrl}?q=${location}&units=metric&appid=${weatherApiKey}`
    );
    const data = await response.json();

    if (data.cod !== 200) {
      alert('Location not found!');
      return;
    }

    const { lat, lon } = data.coord;
    console.log(data.coord)
    const temperature = data.main.temp;
    const condition = data.weather[0].description;
    const humidity = data.main.humidity;
    const city = data.name;

    cityName.textContent = city;
    tempElement.textContent = `${temperature}°C`;
    conditionElement.textContent = condition;
    humidityElement.textContent = `${humidity}%`;

    // Fetch hourly and daily forecasts
    // await fetchForecasts(lat, lon);

    loading.classList.add('hidden');
    weatherInfo.classList.remove('hidden');
  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert('An error occurred while fetching the weather data');
  }
}

function displayHourlyForecast(hourlyData) {
  hourlyContainer.innerHTML = ''; // Clear previous data
  hourlyData.slice(0, 6).forEach((hour) => {
    const time = new Date(hour.dt * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const temp = `${hour.temp}°C`;
    const condition = hour.weather[0].description;

    hourlyContainer.innerHTML += `
      <div class="forecast-item">
        <p>${time}</p>
        <p>${temp}</p>
        <p>${condition}</p>
      </div>
    `;
  });
}

function displayDailyForecast(dailyData) {
  dailyContainer.innerHTML = ''; // Clear previous data
  dailyData.slice(0, 5).forEach((day) => {
    const date = new Date(day.dt * 1000).toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    const temp = `${day.temp.day}°C`;
    const condition = day.weather[0].description;

    dailyContainer.innerHTML += `
      <div class="forecast-item">
        <p>${date}</p>
        <p>${temp}</p>
        <p>${condition}</p>
      </div>
    `;
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const location = locationInput.value.trim();

  if (location) {
    loading.classList.remove('hidden');
    weatherInfo.classList.add('hidden');
    hourlyContainer.innerHTML = ''; // Reset hourly forecast
    dailyContainer.innerHTML = ''; // Reset daily forecast
    getWeather(location);
  }
});
