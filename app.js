require('dotenv').config()
require('express-async-errors')
const cors = require('cors')

const express = require('express')
const app = express()

// Database
const connectDB = require('./db/connect')

// Auth
const authenticateUser = require('./middleware/authentication')

app.use(cors())

const fileUpload = require('express-fileupload')

// Cloudinary must use V2
const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// Routes
const authRouter = require('./routes/authRoutes')
const travelRouter = require('./routes/travelRoutes')

app.use(cors())
app.use(express.json())
app.use(fileUpload({ useTempFiles: true }))

// Routes
app.get('/', (req, res) => res.send('<h1> Travel App Backend </h1>'))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/travels', authenticateUser, travelRouter)

// middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3001

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)

    app.listen(port, () =>
      console.log(`Server is listening on port: ${port}...`)
    )
  } catch (err) {
    console.log(err)
  }
}

start()
