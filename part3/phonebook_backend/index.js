import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

const app = express()

// Morgan token to log POST body
morgan.token('body', (req) =>
  req.method === 'POST' ? JSON.stringify(req.body) : ''
)

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Initial data
let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

// GET all persons
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// GET one person
app.get('/api/persons/:id', (req, res) => {
  const person = persons.find(p => p.id === req.params.id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

// DELETE person
app.delete('/api/persons/:id', (req, res) => {
  persons = persons.filter(p => p.id !== req.params.id)
  res.status(204).end()
})

// ADD person
app.post('/api/persons', (req, res) => {

  const { name, number } = req.body

  if (!name) {
    return res.status(400).json({ error: 'name missing' })
  }

  if (!number) {
    return res.status(400).json({ error: 'number missing' })
  }

  if (persons.find(p => p.name === name)) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  const person = {
    id: Math.floor(Math.random() * 10000000).toString(),
    name,
    number
  }

  persons = persons.concat(person)

  res.json(person)
})

// INFO route
app.get('/info', (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `)
})

/* IMPORTANT FIX FOR RENDER */
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})