const express = require('express');
const orderHeaderController = require('../controllers/orderHeaderController');
const authController = require('../controllers/authController');

const router = express.Router();
router.use(authController.protect);
router
  .route('/')
  .post(orderHeaderController.createOrder)
  .get(
    orderHeaderController.setFilterToUserId,
    orderHeaderController.getAllOrders,
  );
router
  .route('/validate-session/:orderId')
  .get(orderHeaderController.validateStripeSession);
router.route('/cancel-order').patch(orderHeaderController.cancelOrder);
router.route('/start-processing').patch(orderHeaderController.startProcessing);
router.route('/ship-order').patch(orderHeaderController.shipOrder);
//   .delete(orderHeaderController.deleteCart)
//   .patch(orderHeaderController.updateCart);

router.route('/:orderId').get(orderHeaderController.getStripeSession);

module.exports = router;
