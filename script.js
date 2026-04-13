const API_KEY = '96d674dd28b014ce1aad7367969978f0';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const form = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const cardsContainer = document.getElementById('cards');
const unitToggle = document.getElementById('unit-toggle');
const errorMsg = document.getElementById('error-msg');

let isCelsius = true;
let citiesData = [];

const STORAGE_KEY = 'weatherCities';

const saveCities = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(citiesData));
};

const loadCities = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

const showError = (message) => {
  errorMsg.textContent = message;
  errorMsg.classList.add('visible');
  setTimeout(() => {
    errorMsg.classList.remove('visible');
  }, 3000);
};

const toFahrenheit = (celsius) => Math.round(celsius * 9 / 5 + 32);
const getTemp = (tempC) => isCelsius ? Math.round(tempC) : toFahrenheit(tempC);
const getUnit = () => isCelsius ? '°C' : '°F';

const createCard = (weather, index) => {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.index = index;

  const temp = getTemp(weather.main.temp);
  const condition = weather.weather[0];
  const iconUrl = `https://openweathermap.org/img/wn/${condition.icon}@4x.png`;
  const description = condition.description.toUpperCase();

  card.innerHTML = `
    <button class="card-delete" title="Удалить">&times;</button>
    <div class="card-header">
      <div>
        <h2 class="card-title">${weather.name}</h2>
      </div>
      <span class="card-country">${weather.sys.country}</span>
    </div>
    <p class="temperature" data-temp-c="${weather.main.temp}">${temp}<span>${getUnit()}</span></p>
    <div class="weather-icon">
      <img src="${iconUrl}" alt="${condition.description}" />
    </div>
    <p class="description">${description}</p>
  `;

  card.querySelector('.card-delete').addEventListener('click', () => {
    card.classList.add('card-removing');
    card.addEventListener('animationend', () => {
      const currentIndex = parseInt(card.dataset.index, 10);
      citiesData.splice(currentIndex, 1);
      saveCities();
      card.remove();
      document.querySelectorAll('.card').forEach((c, i) => {
        c.dataset.index = i;
      });
    }, { once: true });
  });

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

const renderAllCards = () => {
  cardsContainer.innerHTML = '';
  citiesData.forEach((weather, index) => {
    cardsContainer.appendChild(createCard(weather, index));
  });
};

const updateTemperatures = () => {
  document.querySelectorAll('.temperature').forEach((el) => {
    const tempC = parseFloat(el.dataset.tempC);
    if (!isNaN(tempC)) {
      el.innerHTML = `${getTemp(tempC)}<span>${getUnit()}</span>`;
    }
  });
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

unitToggle.addEventListener('click', () => {
  isCelsius = !isCelsius;
  unitToggle.textContent = isCelsius ? '°C / °F' : '°F / °C';
  updateTemperatures();
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (!city) {
    cityInput.focus();
    return;
  }

  try {
    const weather = await fetchWeather(city);
    
    // Проверка на дубликат
    const isDuplicate = citiesData.some(
      (c) => c.id === weather.id || c.name.toLowerCase() === weather.name.toLowerCase()
    );
    if (isDuplicate) {
      showError(`${weather.name} уже добавлен`);
      cityInput.value = '';
      return;
    }

    citiesData.push(weather);
    saveCities();
    renderAllCards();
    cityInput.value = '';
  } catch (error) {
    showError(error.message);
  }
});


citiesData = loadCities();
renderAllCards();
