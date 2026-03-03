import express from 'express';
const app = express();

// ⭐ Needed for POST requests
app.use(express.json());

let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
  const count = persons.length;
  const date = new Date();
  res.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${date}</p>
  `);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find(p => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  persons = persons.filter(p => p.id !== id);
  res.status(204).end();
});

// ⭐ Exercise 3.6 — POST with validation
app.post('/api/persons', (req, res) => {
  const body = req.body;

  // ❌ Missing name
  if (!body.name) {
    return res.status(400).json({ error: 'name missing' });
  }

  // ❌ Missing number
  if (!body.number) {
    return res.status(400).json({ error: 'number missing' });
  }

  // ❌ Name must be unique
  const nameExists = persons.find(p => p.name === body.name);
  if (nameExists) {
    return res.status(400).json({ error: 'name must be unique' });
  }

  // ✔ Create new person
  const person = {
    id: Math.floor(Math.random() * 10000000).toString(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});