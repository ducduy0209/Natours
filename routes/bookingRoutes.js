const express = require('express')
const BookingController = require('../controllers/BookingController')
const AuthController = require('../controllers/AuthController')

const router = express.Router()

router.get(
  '/checkout-session/:tourId',
  AuthController.protect,
  BookingController.getCheckoutSession
)

module.exports = router
