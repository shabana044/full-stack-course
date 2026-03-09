import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'
import Person from './models/person.js'

const app = express()

// MongoDB connection
const url = 'mongodb://shabana:Shabaa123@ac-vuxmtvv-shard-00-00.3drfpz3.mongodb.net:27017,ac-vuxmtvv-shard-00-01.3drfpz3.mongodb.net:27017,ac-vuxmtvv-shard-00-02.3drfpz3.mongodb.net:27017/phonebookApp?ssl=true&replicaSet=atlas-633u03-shard-0&authSource=admin&retryWrites=true&w=majority'

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// middleware
app.use(cors())
app.use(express.json())

morgan.token('body', (req) =>
  req.method === 'POST' ? JSON.stringify(req.body) : ''
)

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// GET all persons
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(error => next(error))
})

// GET one person
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) res.json(person)
      else res.status(404).end()
    })
    .catch(error => next(error))
})

// ADD person
app.post('/api/persons', (req, res, next) => {

  const { name, number } = req.body

  const person = new Person({ name, number })

  person.save()
    .then(savedPerson => res.json(savedPerson))
    .catch(error => next(error))

})

// DELETE
app.delete('/api/persons/:id', (req, res, next) => {

  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error))

})

// UPDATE
app.put('/api/persons/:id', (req, res, next) => {

  const { name, number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  )
    .then(updatedPerson => res.json(updatedPerson))
    .catch(error => next(error))

})

// unknown endpoint
app.use((req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
})

// error handler
app.use((error, req, res, next) => {

  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})