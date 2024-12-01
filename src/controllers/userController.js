const sharp = require('sharp');
const multer = require('multer');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../appError');
const handlerFactory = require('./handlerFactory');

const storage = multer.memoryStorage();
exports.fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else cb(new AppError('Please upload only images', 400));
};
const upload = multer({
  storage: storage,
  fileFilter: this.fileFilter,
});
exports.uploadUserPhoto = upload.single('photo');
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  // console.log(req.file);
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`${__dirname}/../public/img/users/${req.file.filename}`, (err) => {
      if (err) {
        return next(new AppError('Error processing the image', 500));
      }
    });

  next();
});
exports.getAllUsers = handlerFactory.getAll(User);

exports.getUserById = handlerFactory.getAll(User);

exports.deleteUser = handlerFactory.deleteOne(User);
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    throw new AppError(
      'This route is not for password updates. Please use /updateMyPassword.',
      400,
    );
  const filteredBody = { email: req.body.email, name: req.body.name };
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route will not be defined, please use signup instead',
  });
};
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateUser = handlerFactory.updateOne(User);
