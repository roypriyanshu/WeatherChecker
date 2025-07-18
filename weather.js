const apiKey = '4da51062dc1e757bd4c93df1762141e0';
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

document.getElementById('searchBtn').addEventListener('click', getWeather);
document.getElementById('cityInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') getWeather();
});

function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  if (!city) {
    showError('Please enter a city name');
    return;
  }

  const url = `${baseUrl}?q=${city}&units=metric&appid=${apiKey}`;
  
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(data => {
      displayWeather(data);
      document.getElementById('errorMessage').style.display = 'none';
    })
    .catch(error => {
      showError(error.message || 'Failed to fetch weather data');
    });
}

function displayWeather(data) {
  // Main info
  document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById('currentTemp').textContent = Math.round(data.main.temp);
  document.getElementById('weatherDesc').textContent = data.weather[0].description;
  
  // Set weather icon
  const icon = getWeatherIcon(data.weather[0].main);
  document.getElementById('weatherIcon').className = `weather-icon ${icon}`;
  
  // Date
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
  
  // Stats
  document.getElementById('windSpeed').textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
  document.getElementById('humidity').textContent = `${data.main.humidity}%`;
  document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
  document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
  
  // Sun times
  document.getElementById('sunrise').textContent = formatTime(data.sys.sunrise);
  document.getElementById('sunset').textContent = formatTime(data.sys.sunset);
}

function getWeatherIcon(weatherCondition) {
  const icons = {
    'Clear': 'fas fa-sun',
    'Clouds': 'fas fa-cloud',
    'Rain': 'fas fa-cloud-rain',
    'Snow': 'fas fa-snowflake',
    'Thunderstorm': 'fas fa-bolt',
    'Drizzle': 'fas fa-cloud-rain',
    'Mist': 'fas fa-smog',
    'Smoke': 'fas fa-smog',
    'Haze': 'fas fa-smog',
    'Fog': 'fas fa-smog'
  };
  return icons[weatherCondition] || 'fas fa-cloud';
}

function formatTime(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function showError(message) {
  const errorElement = document.getElementById('errorMessage');
  errorElement.textContent = message;
  errorElement.style.display = 'block';
}