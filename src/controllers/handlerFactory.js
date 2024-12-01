const AppError = require('../appError');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const model = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        [Model.modelName.toLowerCase()]: model,
      },
    });
  });
exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const model = await Model.findById(req.params.id);
    if (!model)
      return next(
        new AppError(
          `There is no document associated with this id ${req.params.id}`,
        ),
        404,
      );
    res.status(200).json({
      status: 'success',
      data: {
        [Model.modelName.toLowerCase()]: model,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const filter = {};

    const result = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .filter();

    const models = await result.query;

    res.status(200).json({
      status: 'success',
      results: models.length,
      data: {
        [`${Model.modelName.toLowerCase()}s`]: models,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const model = await Model.findByIdAndDelete(req.params.id);

    if (!model) {
      return next(
        new AppError(
          `There is no document associated with this id ${req.params.id}`,
          404,
        ),
      );
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const model = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!model) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        [Model.modelName.toLowerCase()]: model,
      },
    });
  });
