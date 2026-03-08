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


// Phone number validation pattern
const phoneRegex = /^\d{2,3}-\d+$/

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minLength: [3, 'Name must be at least 3 characters long']
  },
  number: {
    type: String,
    required: [true, 'Number is required'],
    validate: {
      validator: function(v) {
        return phoneRegex.test(v)
      },
      message: props => `${props.value} is not a valid phone number format (e.g. 12-123456)`
    }
  }
})


// Transform _id → id
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export default mongoose.model('Person', personSchema)