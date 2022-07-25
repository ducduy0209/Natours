const express = require('express')
const TourController = require('../controllers/TourController')
const AuthController = require('../controllers/AuthController')
const reviewRouter = require('../routes/reviewRoutes')

const router = express.Router()

router.use('/:tourId/reviews', reviewRouter)

router
  .route('/top-5-cheap')
  .get(TourController.aliasTours, TourController.getAllTours)

router.route('/tour-stats').get(TourController.getTourStats)

router
  .route('/monthly-plan/:year')
  .get(
    AuthController.protect,
    AuthController.restrictTo('admin', 'lead-guide'),
    TourController.getMonthlyPlan
  )

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(TourController.getToursWithin)

router.route('/distances/:latlng/unit/:unit').get(TourController.getDistances)

router
  .route('/')
  .get(TourController.getAllTours)
  .post(
    AuthController.protect,
    AuthController.restrictTo('admin', 'lead-guide'),
    TourController.createTour
  )
router
  .route('/:id')
  .get(TourController.getTour)
  .patch(
    AuthController.protect,
    AuthController.restrictTo('admin', 'lead-guide'),
    TourController.updateTour
  )
  .delete(
    AuthController.protect,
    AuthController.restrictTo('admin', 'lead-guide'),
    TourController.deleteTour
  )

module.exports = router
