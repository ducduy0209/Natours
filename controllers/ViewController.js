const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync')

class ViewController {
  getOverview = catchAsync(async (req, res, next) => {
    // 1) Get all tours from collection
    const tours = await Tour.find()
    // 2) Build template
    // 3) Render that template using tour data from 1)

    res.status(200).render('overview', {
      title: 'All tours',
      tours
    })
  })

  getTour = catchAsync(async (req, res, next) => {
    // 1) Get the data, for the requested tour(including reviews and guides)
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
      path: 'reviews',
      fields: 'rating review user'
    })

    // 2) Build template

    // 3) Render that template using data from 1)
    res.status(200).render('tour', {
      title: tour.name,
      tour
    })
  })
}

module.exports = new ViewController()
