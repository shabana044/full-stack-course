import { useState, useEffect } from "react"
import countriesService from "./services/countries"

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState("")
  const [selected, setSelected] = useState(null)

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
        onChange={(e) => {
          setFilter(e.target.value)
          setSelected(null)  // reset when typing
        }}
      />

      {filter && filtered.length > 10 && (
        <p>Too many matches, specify another filter.</p>
      )}

      {filtered.length > 1 && filtered.length <= 10 && (
        <ul>
          {filtered.map(c => (
            <li key={c.name.common}>
              {c.name.common}
              <button onClick={() => setSelected(c)}>show</button>
            </li>
          ))}
        </ul>
      )}

      {filtered.length === 1 && (
        <CountryDetail country={filtered[0]} />
      )}

      {selected && (
        <CountryDetail country={selected} />
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
        {Object.values(country.languages || {}).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img 
        src={country.flags.png}
        alt="flag"
        width="150"
      />
    </div>
  )
}

export default App
