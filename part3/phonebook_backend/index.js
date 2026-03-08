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
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)


// Serve React build
app.use(express.static(path.join(__dirname, 'build')))


// GET all persons
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
    .catch(error => next(error))
})


// GET one person
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})


// DELETE person
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})


// ADD person
app.post('/api/persons', (req, res, next) => {

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
    .catch(error => next(error))
})


// UPDATE person
app.put('/api/persons/:id', (req, res, next) => {

  const { name, number } = req.body

  const person = {
    name,
    number
  }

  Person.findByIdAndUpdate(
    req.params.id,
    person,
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  )
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})


// INFO route
app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
      `)
    })
    .catch(error => next(error))
})


// Unknown endpoint middleware
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


// Error handler middleware
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


// React Router fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})