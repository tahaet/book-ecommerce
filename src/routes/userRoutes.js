const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const Roles = require('../utils/roles');
// import multer from 'multer';
const router = express.Router();
// const upload = multer({ dest: `${__dirname}/../public/img/users` });

router.get('/logout', authController.logout);
router.post('/signup', authController.signUp);
router.get('/confirmEmail/:token', authController.confirmEmail);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post(
  '/activateAccountRequest',
  //authController.excludeActiveFilter,
  authController.reactivateUserRequest,
);
router.patch('/resetPassword/:token', authController.resetPassword);
router.post('/activateAccount/:token', authController.activateAccount);
router.patch(
  '/changePassword',
  authController.protect,
  authController.updatePassword,
);
router.use(authController.protect);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);
router.delete('/deleteMe', userController.deleteMe);
router.get('/me', userController.getMe, userController.getUserById);

router.use(authController.restrictTo(Roles.ADMIN));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUserById)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
