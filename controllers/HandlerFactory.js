const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

class HandlerFactory {
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
