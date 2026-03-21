const CountryList = ({countries, onShowCountry}) => {
    if (countries.length === 0) return null;

    return(
        <div>
            {countries.map((c) => <p key={c.cca3}>{c.name.common} <button type="button" onClick={() => onShowCountry(c)}>Show</button> </p>)}
        </div>
    )
}

export default CountryList;