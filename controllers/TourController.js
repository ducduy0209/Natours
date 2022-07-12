const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const HandlerFactory = require('./HandlerFactory')
class TourController {
  aliasTours = (req, res, next) => {
    req.query.limit = 5
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty,duration'
    next()
  }

  getAllTours = catchAsync(async (req, res, next) => {
    // Execute query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
    const tours = await features.query

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    })
  })

  getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id).populate('reviews')

    if (!tour) {
      return next(new AppError('No tour found with that ID'))
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  })

  createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  })

  updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if (!tour) {
      return next(new AppError('No tour found with that ID'))
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  })

  deleteTour = HandlerFactory.deleteOne(Tour)

  getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTous: { $sum: 1 },
          avgRating: { $avg: '$ratingsAverage' },
          numRatings: { $sum: '$ratingsQuantity' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgRating: -1 }
      }
    ])
    res.status(200).json({
      status: 'success',
      data: stats
    })
  })

  getMonthlyPlan = catchAsync(async (req, res, next) => {
    const { year } = req.params

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTours: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: {
          numTours: -1
        }
      },
      {
        $limit: 6
      }
    ])

    res.status(200).json({
      status: 'success',
      data: plan
    })
  })
}

module.exports = new TourController()
