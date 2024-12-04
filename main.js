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


const weatherBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';


async function getWeather(location) {
  try {
    const response = await fetch(
      `${weatherBaseUrl}?q=${location}&units=metric&appid=${weatherApiKey}`
    );
    const data = await response.json();

    if (data.cod !== 200) {
      alert('Location not found!');
      return;
    }

    
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

    
  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert('An error occurred while fetching the weather data');
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const location = locationInput.value.trim();

  if (location) {
    loading.classList.remove('hidden');
    weatherInfo.classList.add('hidden');
    getWeather(location);
  }
});