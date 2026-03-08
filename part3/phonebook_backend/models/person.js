import mongoose from 'mongoose'

const password = process.argv[2]

const url = `mongodb://shabana:${encodeURIComponent(password)}@ac-vuxmtvv-shard-00-00.3drfpz3.mongodb.net:27017,ac-vuxmtvv-shard-00-01.3drfpz3.mongodb.net:27017,ac-vuxmtvv-shard-00-02.3drfpz3.mongodb.net:27017/phonebookApp?ssl=true&replicaSet=atlas-633u03-shard-0&authSource=admin&appName=Cluster0`

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export default mongoose.model('Person', personSchema)