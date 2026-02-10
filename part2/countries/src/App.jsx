import { useState, useEffect } from "react"
import countriesService from "./services/countries"

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState("")

  useEffect(() => {
    countriesService.getAll().then(data => {
      setCountries(data)
    })
  }, [])

  const filtered = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h1>Find Countries</h1>

      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {filter && filtered.length > 10 && (
        <p>Too many matches, specify another filter.</p>
      )}

      {filtered.length > 1 && filtered.length <= 10 && (
        <ul>
          {filtered.map(c => (
            <li key={c.name.common}>{c.name.common}</li>
          ))}
        </ul>
      )}

      {filtered.length === 1 && (
        <CountryDetail country={filtered[0]} />
      )}
    </div>
  )
}

const CountryDetail = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p><b>Capital:</b> {country.capital}</p>
      <p><b>Area:</b> {country.area}</p>

      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt="flag"
        width="150"
        style={{ border: "1px solid black" }}
      />
    </div>
  )
}

export default App
