const express = require('express')
const BookingController = require('../controllers/BookingController')
const AuthController = require('../controllers/AuthController')

const router = express.Router({ mergeParams: true })

router.use(AuthController.protect)

router.get('/checkout-session/:tourId', BookingController.getCheckoutSession)

router.use(AuthController.restrictTo('admin', 'lead-guide'))

router
  .route('/')
  .get(BookingController.getAllBookings)
  .post(BookingController.setTourUserIds, BookingController.createBooking)

router
  .route('/:id')
  .get(BookingController.getBooking)
  .patch(BookingController.updateBooking)
  .delete(BookingController.deleteBooking)
module.exports = router
