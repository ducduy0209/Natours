const Review = require('../models/reviewModel')
const Booking = require('../models/bookingModel')
const catchAsync = require('../utils/catchAsync')
const HandlerFactory = require('./HandlerFactory')
const AppError = require('../utils/appError')
// const catchAsync = require('../utils/catchAsync')
// const AppError = require('../utils/appError')

class ReviewController {
  setTourUserIds = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId
    if (!req.body.user) req.body.user = req.user._id

    next()
  }

  restrictToReview = catchAsync(async (req, res, next) => {
    const tourId = req.params.tourId || req.body.tour
    const userId = req.user._id

    const query = await Booking.findOne({ user: userId, tour: tourId })
    if (!query) {
      return next(new AppError('You must book to review this tour!', 403))
    }
    next()
  })

  getAllReviews = HandlerFactory.getAll(Review)

  getReview = HandlerFactory.getOne(Review)

  createReview = HandlerFactory.createOne(Review)

  updateReview = HandlerFactory.updateOne(Review)

  deleteReview = HandlerFactory.deleteOne(Review)
}

module.exports = new ReviewController()
