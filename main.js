import './style.css';

const form = document.getElementById('weather-form');
const locationInput = document.getElementById('location');
const weatherInfo = document.getElementById('weather-info');
const loading = document.getElementById('loading');
const cityName = document.getElementById('city-name');
const tempElement = document.getElementById('temp');
const conditionElement = document.getElementById('condition');
const humidityElement = document.getElementById('humidity');
const weatherGif = document.getElementById('weather-gif');

const weatherApiKey = 'df593b7fb74e80356d67edf1c8c500b6';
const giphyApiKey = 'uSwWtXE0lKyJ11sSLozRNf2uStLFc2kN';
const weatherBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const weatherOneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall';

async function getWeather(location) {
  try {
    const response = await fetch(
      `${weatherBaseUrl}?q=${location}&appid=${weatherApiKey}`
    );
    const data = await response.json();

    if (data.cod !== 200) {
      alert('Location not found!');
      return;
    }

    const { lat, lon } = data.coord;

    // Fetch additional data using One Call API
    const oneCallResponse = await fetch(
      `${weatherOneCallUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${weatherApiKey}`
    );
    const oneCallData = await oneCallResponse.json();

    const temperature = data.main.temp;
    const condition = data.weather[0].description;
    const humidity = data.main.humidity;
    const city = data.name;

    cityName.textContent = city;
    tempElement.textContent = `${temperature}°C`;
    conditionElement.textContent = condition;
    humidityElement.textContent = `${humidity}%`;

    loading.classList.add('hidden');
    weatherInfo.classList.remove('hidden');

    // Display hourly and daily forecasts
    displayHourlyForecast(oneCallData.hourly);
    displayDailyForecast(oneCallData.daily);

    // Display GIF for current condition
    displayWeatherGif(condition);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert('An error occurred while fetching the weather data');
  }
}

function displayHourlyForecast(hourlyData) {
  const hourlyContainer = document.getElementById('hourly-container');
  hourlyContainer.innerHTML = '';

  hourlyData.slice(0, 6).forEach((hour) => {
    const time = new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  document.getElementById('hourly-forecast').classList.remove('hidden');
}

function displayDailyForecast(dailyData) {
  const dailyContainer = document.getElementById('daily-container');
  dailyContainer.innerHTML = '';

  dailyData.slice(0, 5).forEach((day) => {
    const date = new Date(day.dt * 1000).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
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

  document.getElementById('daily-forecast').classList.remove('hidden');
}

async function displayWeatherGif(condition) {
  try {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${condition}&limit=1`
    );
    const data = await response.json();

    if (data.data.length > 0) {
      const gifUrl = data.data[0].images.fixed_height.url;
      weatherGif.innerHTML = `<img src="${gifUrl}" alt="${condition} gif" />`;
    } else {
      weatherGif.innerHTML = `<p>No GIF available for "${condition}"</p>`;
    }
  } catch (error) {
    console.error('Error fetching GIF:', error);
    weatherGif.innerHTML = `<p>Error loading GIF</p>`;
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const location = locationInput.value.trim();

  if (location) {
    loading.classList.remove('hidden');
    weatherInfo.classList.add('hidden');
    document.getElementById('hourly-forecast').classList.add('hidden');
    document.getElementById('daily-forecast').classList.add('hidden');
    getWeather(location);
  }
});
