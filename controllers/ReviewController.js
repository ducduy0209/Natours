const Review = require('../models/reviewModel')
const HandlerFactory = require('./HandlerFactory')
// const catchAsync = require('../utils/catchAsync')
// const AppError = require('../utils/appError')

class ReviewController {
  setTourUserIds = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId
    if (!req.body.user) req.body.user = req.user._id

    next()
  }

  getAllReviews = HandlerFactory.getAll(Review)

  getReview = HandlerFactory.getOne(Review)

  createReview = HandlerFactory.createOne(Review)

  updateReview = HandlerFactory.updateOne(Review)

  deleteReview = HandlerFactory.deleteOne(Review)
}

module.exports = new ReviewController()
