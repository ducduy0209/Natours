const express = require('express')
const morgan = require('morgan')
const path = require('path')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

const app = express()

const globalErrorHandler = require('./controllers/ErrorController')
const AppError = require('./utils/appError')

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

// 1) GLOBAL MIDDLEWARES
// Set secure HTTP header
app.use(helmet())

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Body parse, reading date from body into req.body
app.use(express.json({ limit: '10kb' }))

// Data sanitization against NoSQL from query injection
app.use(mongoSanitize())

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'price'
    ]
  })
)

// Data sanitization against XSS
app.use(xss())

// Serving static files
app.use(express.static(path.join(__dirname, 'public')))

// Limit requests from same API
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP! Please try again in an hour.'
})

app.use('/api', limiter)

// Test middlewares
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

// 3) ROUTES
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404))
})

app.use(globalErrorHandler)

module.exports = app
