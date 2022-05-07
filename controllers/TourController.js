const Tour = require('../models/tourModel')
class TourController {
  getAllTours = async (req, res) => {
    try {
      // 1A) filter
      const queryObj = { ...req.query }
      const excludedFields = ['page', 'sort', 'limit', 'fields']
      excludedFields.forEach(el => delete queryObj[`${el}`])
      // 1B) Advanced filter
      let queryStr = JSON.stringify(queryObj)
      queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, match => `$${match}`)

      let query = Tour.find(JSON.parse(queryStr))

      if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        console.log(sortBy)
        query = query.sort(sortBy)
      } else {
        query = query.sort('-createdAt')
      }

      const tours = await query

      res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
          tours
        }
      })
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      })
    }
  }

  getTour = async (req, res) => {
    try {
      const tour = await Tour.findById(req.params.id)

      res.status(200).json({
        status: 'success',
        data: {
          tour
        }
      })
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      })
    }
  }

  createTour = async (req, res) => {
    try {
      const newTour = await Tour.create(req.body)

      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      })
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: 'Invalid data sent!'
      })
    }
  }

  updateTour = async (req, res) => {
    try {
      const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      })
      res.status(200).json({
        status: 'success',
        data: {
          tour
        }
      })
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      })
    }
  }

  deleteTour = async (req, res) => {
    try {
      await Tour.findByIdAndDelete(req.params.id)
      res.status(204).json({
        status: 'success',
        data: null
      })
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      })
    }
  }
}

module.exports = new TourController()
