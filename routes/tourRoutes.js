const express = require('express')
const TourController = require('../controllers/TourController')
const router = express.Router()

// router.param('id', TourController.checkID)

router
  .route('/')
  .get(TourController.getAllTours)
  .post(TourController.createTour)
router
  .route('/:id')
  .get(TourController.getTour)
  .patch(TourController.updateTour)
  .delete(TourController.deleteTour)

module.exports = router
