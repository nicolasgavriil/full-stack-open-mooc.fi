const CountryList = ({countries}) => {
    if (countries.length === 0) return null;

    return(
        <div>
            {countries.map((c) => <p key={c.cca3}>{c.name.common}</p>)}
        </div>
    )
}

export default CountryList;