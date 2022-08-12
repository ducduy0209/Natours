const multer = require('multer')
// const sharp = require('sharp')
const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync')
const HandlerFactory = require('./HandlerFactory')
const AppError = require('../utils/appError')

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(
      new AppError('Not an image file. Please upload only images.', 400),
      false
    )
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})
class TourController {
  uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
  ])

  resizeTourImages = (req, res, next) => {
    console.log(req.files)
    next()
  }

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

  getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params
    const [lat, lng] = latlng.split(',')
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1

    if (!lat || !lng)
      return next(
        new AppError(
          'Please provide latitude and longitude in format lat, lng.',
          400
        )
      )

    const tours = await Tour.find({
      startLocation: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius]
        }
      }
    })

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        data: tours
      }
    })
  })

  getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params
    const [lat, lng] = latlng.split(',')

    if (!lat || !lng)
      return next(
        new AppError(
          'Please provide latitude and longitude in format lat, lng.',
          400
        )
      )

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001

    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [lng * 1, lat * 1]
          },
          distanceField: 'distance',
          distanceMultiplier: multiplier
        }
      },
      {
        $project: {
          distance: 1,
          name: 1
        }
      }
    ])

    res.status(200).json({
      status: 'success',
      data: {
        data: distances
      }
    })
  })
}

module.exports = new TourController()
