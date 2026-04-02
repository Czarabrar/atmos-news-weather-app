import { WEATHER_API_KEY } from '../contants/Config';

/**
 * Fetch current weather data from OpenWeatherMap.
 */
export const fetchWeather = async (lat, lon, unit) => {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${WEATHER_API_KEY}`,
    );
    return await res.json();
};

/**
 * Fetch 5-day forecast from OpenWeatherMap.
 */
export const fetchFiveDayForecast = async (lat, lon, unit) => {
    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${WEATHER_API_KEY}`,
    );
    const data = await res.json();

    const daily = {};
    data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!daily[date] && item.dt_txt.includes('12:00:00')) {
            daily[date] = item;
        }
    });

    return Object.values(daily).slice(0, 5);
};
