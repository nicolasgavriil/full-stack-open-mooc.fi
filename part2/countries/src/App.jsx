import { useState, useEffect } from 'react';
import countryService from "./services/countries.js";
import weatherService from "./services/weather.js";
import Notification from './components/Notification.jsx';
import CountryList from './components/CountryList.jsx';
import CountryData from './components/CountryData.jsx';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await countryService.getAll();
        setCountries(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchCountries();
  }, [])
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleShowCountry = (country) => {
    setSearchQuery(country.name.common);
  }

  const normalizedQuery = searchQuery.toLowerCase().trim()

  const matchingCountries =
    normalizedQuery.length === 0
      ? []
      : countries.filter((c) =>
          c.name.common.toLowerCase().includes(normalizedQuery)
        )

  let notification = null;
  let countriesToList = [];
  const countryToShow =
    matchingCountries.length === 1 ? matchingCountries[0] : null;

  if (normalizedQuery.length === 0) {
    notification = null
  } else if (matchingCountries.length === 0) {
    notification = { message: 'No matches found', type: 'warning' }
  } else if (matchingCountries.length > 10) {
    notification = {
      message: 'Too many matches, specify the search filter',
      type: 'warning',
    }
  } else if (matchingCountries.length > 1) {
    countriesToList = matchingCountries
  }

  useEffect(() => {
    if (!countryToShow) {
      return;
    }
    const fetchWeatherData = async () => {
      try {
        const response = await weatherService.getCurrentWeather(countryToShow);
        const weather = response.data;
        const iconUrl = `https://openweathermap.org/payload/api/media/file/${weather.weather[0].icon}.png`;
        setWeatherData({ weather, iconUrl });

      } catch (err) {
        console.error(err);
        setWeatherData(null)
      }
    }

    fetchWeatherData();
  }, [countryToShow])

  return(
    <div>
      Search for countries: <input value={searchQuery} onChange={handleSearchChange} />
      <Notification notification={notification} />
      <CountryList countries={countriesToList} onShowCountry={handleShowCountry} />
      <CountryData country={countryToShow} weatherData={weatherData} />
    </div>
  )
}

export default App
