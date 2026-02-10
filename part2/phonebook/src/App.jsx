import { useState, useEffect } from "react";
import personService from "./services/persons";

const Notification = ({ message }) => {
  if (message === null) return null;

  const style = {
    color: message.type === "success" ? "green" : "red",
    background: "#eee",
    fontSize: 20,
    border: `3px solid ${message.type === "success" ? "green" : "red"}`,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return <div style={style}>{message.text}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const addPerson = (event) => {
    event.preventDefault();

    const existing = persons.find((p) => p.name === newName);

    if (existing) {
      if (
        window.confirm(
          `${existing.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const updated = { ...existing, number: newNumber };

        personService
          .update(existing.id, updated)
          .then((returnedPerson) => {
            setPersons(
              persons.map((p) => (p.id !== existing.id ? p : returnedPerson))
            );
            showMessage(`Updated ${returnedPerson.name}`, "success");
          })
          .catch((error) => {
            showMessage(
              `Information of ${existing.name} has already been removed from server`,
              "error"
            );
            setPersons(persons.filter((p) => p.id !== existing.id));
          });
      }
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber,
    };

    personService.create(personObject).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      showMessage(`Added ${returnedPerson.name}`, "success");
      setNewName("");
      setNewNumber("");
    });
  };

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
          showMessage(`Deleted ${name}`, "success");
        })
        .catch(() => {
          showMessage(
            `Information of ${name} has already been removed from server`,
            "error"
          );
          setPersons(persons.filter((p) => p.id !== id));
        });
    }
  };

  const personsToShow =
    filter === ""
      ? persons
      : persons.filter((p) =>
          p.name.toLowerCase().includes(filter.toLowerCase())
        );

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} />

      <div>
        filter shown with:{" "}
        <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>

      <h3>Add a new</h3>
      <form onSubmit={addPerson}>
        <div>
          name:{" "}
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div>
          number:{" "}
          <input
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>

      <h3>Numbers</h3>
      {personsToShow.map((person) => (
        <p key={person.id}>
          {person.name} {person.number}{" "}
          <button onClick={() => deletePerson(person.id, person.name)}>
            delete
          </button>
        </p>
      ))}
    </div>
  );
};

export default App;
