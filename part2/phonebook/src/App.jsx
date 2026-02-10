import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 

  const [newName, setNewName] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()        // prevent page refresh

    const newPerson = { name: newName }

    setPersons(persons.concat(newPerson)) // add name to list
    setNewName('') // clear input box
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <form onSubmit={handleSubmit}>
        <div>
          name: 
          <input 
            value={newName} 
            onChange={handleNameChange} 
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      {/* Debug line (optional) */}
      {/* <div>debug: {newName}</div> */}

      <h2>Numbers</h2>

      {persons.map(person => 
        <p key={person.name}>{person.name}</p>
      )}
    </div>
  )
}

export default App

