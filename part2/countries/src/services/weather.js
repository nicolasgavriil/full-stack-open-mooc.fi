import axios from "axios";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

const getCurrentWeather = (country) => {
  const lat = country.latlng[0];
  const lon = country.latlng[1];
  const units = "metric";
  return axios.get(
    `${baseUrl}?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`,
  );
};

export default { getCurrentWeather };
