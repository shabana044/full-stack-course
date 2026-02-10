import { useState, useEffect } from 'react';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  // 1. Fetch all persons from JSON Server
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons));
  }, []);

  // 2. Add or update person
  const addPerson = (event) => {
    event.preventDefault();

    const existing = persons.find(p => p.name === newName);

    if (existing) {
      if (window.confirm(`${newName} is already added to phonebook. Replace the old number?`)) {
        const updatedPerson = { ...existing, number: newNumber };

        personService
          .update(existing.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existing.id ? p : returnedPerson));
            setNewName('');
            setNewNumber('');
          });
      }
      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber
    };

    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNewName('');
        setNewNumber('');
      });
  };

  // 3. DELETE feature (2.14)
  const handleDelete = (id, name) => {
    const confirmDelete = window.confirm(`Delete ${name}?`);

    if (confirmDelete) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>

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
  );
};

export default App;


