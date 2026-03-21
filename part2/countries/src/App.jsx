import { useState, useEffect } from 'react';
import countryService from "./services/countries.js";
import Notification from './components/Notification.jsx';
import CountryList from './components/CountryList.jsx';
import CountryData from './components/CountryData.jsx';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState([]);

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

  let notification = null
  let countriesToList = []
  let countryToShow = null

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
  } else {
    countryToShow = matchingCountries[0]
  }

  return(
    <div>
      Search for countries: <input value={searchQuery} onChange={handleSearchChange} />
      <Notification notification={notification} />
      <CountryList countries={countriesToList} onShowCountry={handleShowCountry} />
      <CountryData country={countryToShow} />
    </div>
  )
}

export default App
