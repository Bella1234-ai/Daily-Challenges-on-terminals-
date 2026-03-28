/**
 * MINIMAL WEATHER APP
 * * Demonstrates:
 * - Fetching from a real API
 * - Error handling with try/catch
 * - Updating DOM with data
 * - Loading/error states
 */

// Get DOM elements
const form = document.getElementById('searchForm');
const input = document.getElementById('cityInput');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const weather = document.getElementById('weather');

// API configuration
// Sign up at https://openweathermap.org/api for free API key
// Replace with your own key
//weather
const API_KEY = '2e1c702e69d2cd1f7f5ee75c07081b63'; // get your own API
const API_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// Form submit handler
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = input.value.trim();

    if (!city) return;

    await fetchWeather(city);
    input.value = '';
});

// Main fetch function
async function fetchWeather(city) {
    // Show loading, hide others
    loading.classList.remove('hidden');
    error.classList.add('hidden');
    weather.classList.add('hidden');

    try {
        // Build URL with query parameters
        const url = `${API_URL}?q=${city}&units=metric&appid=${API_KEY}`;

        // Fetch from API
        const response = await fetch(url);

        // Check if request was successful
        if (!response.ok) {
            throw new Error(
                response.status === 404
                    ? 'City not found'
                    : `Error: ${response.status}`
            );
        }

        // Parse JSON response
        const data = await response.json();

        // Update DOM with data
        displayWeather(data);

    } catch (err) {
        // Show error message
        error.textContent = err.message;
        error.classList.remove('hidden');
    } finally {
        // Always hide loading
        loading.classList.add('hidden');
    }
}

// Display weather data in DOM
function displayWeather(data) {
    document.getElementById('cityName').textContent = 
        `${data.name}, ${data.sys.country}`;

    document.getElementById('temp').textContent = 
        `${Math.round(data.main.temp)}°C`;

    document.getElementById('description').textContent = 
        data.weather[0].description.charAt(0).toUpperCase() + 
        data.weather[0].description.slice(1);

    document.getElementById('details').textContent = 
        `Feels like ${Math.round(data.main.feels_like)}°C • ` +
        `Humidity ${data.main.humidity}% • ` +
        `Wind ${Math.round(data.wind.speed)} m/s`;

    weather.classList.remove('hidden');
}
// 1. Update the API_URL at the top
// 2. Update the fetchWeather function's URL building
// Change the existing fetchWeather function inside the try block:

async function fetchWeather(city) {
    loading.classList.remove('hidden');
    error.classList.add('hidden');
    weather.classList.add('hidden');
    document.getElementById('forecast').classList.add('hidden');

    try {
        const url = `${API_URL}?q=${city}&units=metric&appid=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(response.status === 404 ? 'City not found' : 'API Error');
        }

        const data = await response.json();
        
        // Display Current Weather (using the first item in the list)
        displayWeather(data.list[0], data.city);

        // Display 5-Day Forecast
        displayForecast(data.list);

    } catch (err) {
        error.textContent = err.message;
        error.classList.remove('hidden');
    } finally {
        loading.classList.add('hidden');
    }
}

// 3. Add the displayForecast function
function displayForecast(list) {
    const forecastCards = document.getElementById('forecastCards');
    forecastCards.innerHTML = ''; // Clear previous results

    // The API gives data every 3 hours. 
    // We filter to get one entry per day (e.g., the 12:00:00 mark)
    const dailyData = list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyData.forEach(item => {
        const date = new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'short' });
        const temp = Math.round(item.main.temp);
        const desc = item.weather[0].main;

        const card = `
            <div class="forecast-card">
                <p class="forecast-date">${date}</p>
                <p class="forecast-temp">${temp}°C</p>
                <p>${desc}</p>
            </div>
        `;
        forecastCards.innerHTML += card;
    });

    document.getElementById('forecast').classList.remove('hidden');
}

// 4. Slightly adjust displayWeather to handle the new data format
function displayWeather(current, cityInfo) {
    document.getElementById('cityName').textContent = `${cityInfo.name}, ${cityInfo.country}`;
    document.getElementById('temp').textContent = `${Math.round(current.main.temp)}°C`;
    document.getElementById('description').textContent = current.weather[0].description;
    
    document.getElementById('details').textContent = 
        `Humidity ${current.main.humidity}% • Wind ${Math.round(current.wind.speed)} m/s`;

    weather.classList.remove('hidden');
}