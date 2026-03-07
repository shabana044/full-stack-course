import { useState, useEffect } from 'react'
import personService from './services/persons'

function App() {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(data => setPersons(data))
      .catch(err => console.error('Error fetching persons:', err))
  }, [])

  const addPerson = (e) => {
    e.preventDefault()

    const personObj = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObj)
      .then(added => {
        setPersons(persons.concat(added))
        setNewName('')
        setNewNumber('')
      })
      .catch(err => alert(err.response.data.error))
  }

  const handleDelete = (id) => {
    personService
      .remove(id)
      .then(() => setPersons(persons.filter(p => p.id !== id)))
      .catch(err => console.error('Delete failed:', err))
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <form onSubmit={addPerson}>
        <input value={newName} onChange={e => setNewName(e.target.value)} />
        <input value={newNumber} onChange={e => setNewNumber(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      <ul>
        {persons.map(p => (
          <li key={p.id}>
            {p.name} {p.number}
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App