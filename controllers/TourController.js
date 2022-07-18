const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync')
const HandlerFactory = require('./HandlerFactory')
// const AppError = require('../utils/appError')
class TourController {
  aliasTours = (req, res, next) => {
    req.query.limit = 5
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty,duration'
    next()
  }

  getAllTours = HandlerFactory.getAll(Tour)

  getTour = HandlerFactory.getOne(Tour, { path: 'reviews' })

  createTour = HandlerFactory.createOne(Tour)

  updateTour = HandlerFactory.updateOne(Tour)

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
