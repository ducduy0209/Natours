const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION!')
  console.log(err.name, err.message)
  process.exit(1)
})

const app = require('./app')

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)

const connectDB = async () => {
  await mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  console.log('DB connection successfully!')
}

connectDB()

const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`)
})

process.on('unhandledRejection', err => {
  console.log('UNHANDLE REJECTION!')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})

process.on('SIGTERM', () => {
  console.log('✋ SIGTERM RECEIVED!. Shutting down gracefully.')
  server.close(() => {
    console.log('🧨 Process terminated.')
  })
})
