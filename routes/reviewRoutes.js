const express = require('express')
const ReviewController = require('../controllers/ReviewController')
const AuthController = require('../controllers/AuthController')

const router = express.Router({ mergeParams: true })

router.use(AuthController.protect)

router
  .route('/')
  .get(ReviewController.getAllReviews)
  .post(
    AuthController.restrictTo('user'),
    ReviewController.setTourUserIds,
    ReviewController.createReview
  )

router
  .route('/:id')
  .get(ReviewController.getReview)
  .delete(
    AuthController.restrictTo('user', 'admin'),
    ReviewController.deleteReview
  )
  .patch(
    AuthController.restrictTo('user', 'admin'),
    ReviewController.updateReview
  )

module.exports = router
