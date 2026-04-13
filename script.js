const API_KEY = '96d674dd28b014ce1aad7367969978f0';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const form = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const cardsContainer = document.getElementById('cards');

const createCard = (weather) => {
  const card = document.createElement('article');
  card.className = 'card';

  const temp = Math.round(weather.main.temp);
  const condition = weather.weather[0];
  const iconUrl = `https://openweathermap.org/img/wn/${condition.icon}@4x.png`;
  const description = condition.description.toUpperCase();

  card.innerHTML = `
    <div class="card-header">
      <div>
        <h2 class="card-title">${weather.name}</h2>
      </div>
      <span class="card-country">${weather.sys.country}</span>
    </div>
    <p class="temperature">${temp}<span>°C</span></p>
    <div class="weather-icon">
      <img src="${iconUrl}" alt="${condition.description}" />
    </div>
    <p class="description">${description}</p>
  `;

  return card;
};

const createErrorCard = (message) => {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <div class="card-header">
      <h2 class="card-title">Ошибка</h2>
    </div>
    <p class="description">${message}</p>
  `;
  return card;
};

const updateCards = (items) => {
  items.forEach((item) => cardsContainer.appendChild(item));
};

const fetchWeather = async (city) => {
  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    throw new Error('API ключ не задан. Вставь свой ключ в script.js.');
  }

  const response = await fetch(`${API_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}&lang=ru`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = response.status === 401
      ? 'Неверный API ключ OpenWeatherMap. Проверь ключ или получи новый.'
      : data.message || 'Не удалось получить данные о погоде';
    throw new Error(message);
  }

  return data;
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (!city) {
    cityInput.focus();
    return;
  }

  const loadingCard = createErrorCard('Загрузка...');
  loadingCard.querySelector('.description').classList.remove('description');
  cardsContainer.appendChild(loadingCard);

  try {
    const weather = await fetchWeather(city);
    loadingCard.remove();
    updateCards([createCard(weather)]);
  } catch (error) {
    loadingCard.remove();
    updateCards([createErrorCard(error.message)]);
  }
});
