# Simple Weather App

Простое приложение на Vanilla JavaScript для поиска погоды по городу.

## Как запустить

1. Установи ключ OpenWeatherMap.
   - Зарегистрируйся на https://openweathermap.org/.
   - Скопируй API Key.
   - В `script.js` замени `API_KEY` на свой ключ.
3. Запусти простой сервер, желательно на Ubuntu WSL:
   ```bash
   python3 -m http.server 8000
   ```
4. Открой в браузере:
   ```bash
   explorer.exe http://localhost:8000
   ```

## Как использовать

- Введи название города в строку поиска на русском или на английском.
- Нажми `SUBMIT`.
- Появится карточка с температурой и описанием погоды.

## Файлы

- `index.html` — разметка страницы
- `styles.css` — стили дизайна
- `script.js` — JavaScript-логика

![Maintainability](https://api.codeclimate.com/v1/badges/edebbcca-b786-4074-bfaf-17ddc9dc5a44/maintainability)
