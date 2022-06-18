const express = require('express')
const TourController = require('../controllers/TourController')
const AuthController = require('../controllers/AuthController')
const router = express.Router()

// router.param('id', TourController.checkID)

router
  .route('/top-5-cheap')
  .get(TourController.aliasTours, TourController.getAllTours)

router.route('/tour-stats').get(TourController.getTourStats)

router.route('/monthly-plan/:year').get(TourController.getMonthlyPlan)

router
  .route('/')
  .get(AuthController.protect, TourController.getAllTours)
  .post(TourController.createTour)
router
  .route('/:id')
  .get(TourController.getTour)
  .patch(TourController.updateTour)
  .delete(
    AuthController.protect,
    AuthController.restrictTo('admin', 'lead-guide'),
    TourController.deleteTour
  )

module.exports = router
