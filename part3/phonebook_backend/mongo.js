// mongo.js
import mongoose from 'mongoose'

// Get command-line arguments
const args = process.argv

if (args.length < 3) {
  console.log('Please provide the password as an argument')
  process.exit(1)
}

const password = args[2]

// Replace <db_password> with your password using encodeURIComponent
const url = `mongodb://shabana:${encodeURIComponent(password)}@ac-vuxmtvv-shard-00-00.3drfpz3.mongodb.net:27017,ac-vuxmtvv-shard-00-01.3drfpz3.mongodb.net:27017,ac-vuxmtvv-shard-00-02.3drfpz3.mongodb.net:27017/phonebookApp?ssl=true&replicaSet=atlas-633u03-shard-0&authSource=admin&appName=Cluster0`

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message)
  })

// Schema and model
const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

// Logic based on command-line arguments
if (args.length === 3) {
  // Only password → list all entries
  Person.find({}).then(persons => {
    console.log('phonebook:')
    persons.forEach(p => {
      console.log(`${p.name} ${p.number}`)
    })
    mongoose.connection.close()
  }).catch(err => {
    console.error('Error reading from MongoDB:', err.message)
    mongoose.connection.close()
  })
} else if (args.length === 5) {
  // password + name + number → add entry
  const name = args[3]
  const number = args[4]

  const person = new Person({ name, number })
  person.save().then(savedPerson => {
    console.log(`added ${savedPerson.name} number ${savedPerson.number} to phonebook`)
    mongoose.connection.close()
  }).catch(err => {
    console.error('Error saving to MongoDB:', err.message)
    mongoose.connection.close()
  })
} else {
  console.log('Invalid number of arguments')
  process.exit(1)
}