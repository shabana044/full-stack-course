import { useState, useEffect } from 'react'
import personService from './services/persons'

function App() {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(data => setPersons(data))
      .catch(err => console.log(err))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const personObj = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObj)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {

        console.log(error.response.data.error)

        setErrorMessage(error.response.data.error)

        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)

      })
  }

  const handleDelete = (id) => {
    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
  }

  return (
    <div>

      <h2>Phonebook</h2>

      {errorMessage && (
        <div style={{ color: 'red' }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={addPerson}>
        <div>
          name:
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>

        <div>
          number:
          <input
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          />
        </div>

        <button type="submit">Add</button>
      </form>

      <h2>Numbers</h2>

      <ul>
        {persons.map(person => (
          <li key={person.id}>
            {person.name} {person.number}
            <button onClick={() => handleDelete(person.id)}>Delete</button>
          </li>
        ))}
      </ul>

    </div>
  )
}

export default App