const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

class HandlerFactory {
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
      if (req.body.role) {
        delete req.body.role
      }
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
