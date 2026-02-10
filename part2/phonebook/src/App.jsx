import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notification, setNotification] = useState(null)

  // Fetch all persons
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  // Add or update person
  const addPerson = (event) => {
    event.preventDefault()

    const existing = persons.find(p => p.name === newName)

    // If person already exists → update number
    if (existing) {
      if (window.confirm(
        `${newName} is already added to phonebook. Replace the old number?`
      )) {

        const updatedPerson = { ...existing, number: newNumber }

        personService
          .update(existing.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(
              persons.map(p => p.id !== existing.id ? p : returnedPerson)
            )

            setNotification(`Updated number for ${updatedPerson.name}`)
            setTimeout(() => setNotification(null), 3000)

            setNewName('')
            setNewNumber('')
          })

      }
      return
    }

    // Otherwise add new person
    const newPerson = { name: newName, number: newNumber }

    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))

        setNotification(`Added ${newPerson.name}`)
        setTimeout(() => setNotification(null), 3000)

        setNewName('')
        setNewNumber('')
      })
  }

  // Delete person
  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      {/* Success Message */}
      <Notification message={notification} />

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

        <button type="submit">add</button>
      </form>

      <h2>Numbers</h2>

      {persons.map(person => (
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person.id, person.name)}>
            delete
          </button>
        </p>
      ))}
    </div>
  )
}

export default App
