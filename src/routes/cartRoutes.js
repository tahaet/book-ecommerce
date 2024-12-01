const express = require('express');
const cartHeaderController = require('../controllers/cartHeaderController');
const authController = require('../controllers/authController');
const Roles = require('../utils/roles');

const router = express.Router();
router.use(authController.protect);
router
  .route('/my-cart')
  .get(cartHeaderController.getMyCart)
  .post(cartHeaderController.addToMyCart)
  .patch(cartHeaderController.removeFromMyCart)
  .delete(cartHeaderController.clearMyCart);
router.use(authController.restrictTo(Roles.ADMIN, Roles.EMPLOYEE));
router
  .route('/')
  .get(cartHeaderController.getAllCarts)
  .post(cartHeaderController.createCart);

router
  .route('/:id')
  .get(cartHeaderController.getCart)
  .delete(cartHeaderController.deleteCart)
  .patch(cartHeaderController.updateCart);

module.exports = router;
