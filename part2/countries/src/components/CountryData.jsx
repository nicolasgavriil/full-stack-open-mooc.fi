const CountryData = ({country}) => {
    if (!country) return null;

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
        </div>
    )
}

export default CountryData;