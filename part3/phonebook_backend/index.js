import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import Person from './models/person.js'

const app = express()

// Needed for ES modules to get __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Morgan token to log POST body
morgan.token('body', (req) =>
  req.method === 'POST' ? JSON.stringify(req.body) : ''
)

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Serve React build
app.use(express.static(path.join(__dirname, 'build')))


// GET all persons
app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
    .catch(error => {
      console.error(error)
      res.status(500).json({ error: 'failed to fetch persons' })
    })
})


// GET one person
app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.error(error)
      res.status(400).json({ error: 'malformatted id' })
    })
})


// DELETE person
app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => {
      console.error(error)
      res.status(400).json({ error: 'malformatted id' })
    })
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

  const person = new Person({
    name,
    number
  })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => {
      console.error(error)
      res.status(500).json({ error: 'failed to save person' })
    })
})


// INFO route
app.get('/info', (req, res) => {
  Person.find({})
    .then(persons => {
      res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
      `)
    })
})


// IMPORTANT FOR REACT ROUTING
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})