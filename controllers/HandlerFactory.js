const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const APIFeatures = require('../utils/apiFeatures')

class HandlerFactory {
  getAll = Model =>
    catchAsync(async (req, res, next) => {
      // To access NESTED route (hack)
      let filter = {}
      if (req.params.tourId) filter = { tour: req.params.tourId }
      // Execute query
      const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
      const doc = await features.query

      res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
          data: doc
        }
      })
    })

  getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
      let query = Model.findById(req.params.id)
      if (popOptions) query = Model.findById(req.params.id).populate(popOptions)
      const doc = await query

      if (!doc) {
        return next(new AppError('No document found with that ID'))
      }

      res.status(200).json({
        status: 'success',
        data: {
          data: doc
        }
      })
    })

  createOne = Model =>
    catchAsync(async (req, res, next) => {
      const newDoc = await Model.create(req.body)

      res.status(201).json({
        status: 'success',
        data: {
          data: newDoc
        }
      })
    })

  updateOne = Model =>
    catchAsync(async (req, res, next) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      })

      if (!doc) {
        return next(new AppError('No document found with that ID'))
      }

      res.status(200).json({
        status: 'success',
        data: {
          data: doc
        }
      })
    })

  deleteOne = Model =>
    catchAsync(async (req, res, next) => {
      const doc = await Model.findByIdAndDelete(req.params.id)

      if (!doc) {
        return next(new AppError('No document found with that ID'))
      }

      res.status(204).json({
        status: 'success',
        data: null
      })
    })
}

module.exports = new HandlerFactory()
