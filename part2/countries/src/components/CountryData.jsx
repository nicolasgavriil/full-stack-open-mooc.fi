const CountryData = ({country, weatherData}) => {
    if (!country || !weatherData) return null;
    
    return(
        <div>
            <h1> {country.name.common} </h1>
            <p>Capital {country.capital} </p>
            <p>Area {country.area} </p>
            <h2>Languages </h2>
            <ul>
                {Object.entries(country.languages).map(([code, lang]) => <li key={code}>{lang} </li>)}
            </ul>
            <img src={country.flags.png} />
            <h2>Weather in {country.capital} </h2>
            <p>Temperature {weatherData.weather.main.temp} Celsius </p>
            <br />
            <img src={weatherData.iconUrl} />
            <p>Wind {weatherData.weather.wind.speed} m/s </p>
        </div>
    )
}

export default CountryData;