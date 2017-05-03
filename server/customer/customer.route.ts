import * as express from 'express';
import * as validate from 'express-validation';
import customerCtrl from './customer.controller';
import paramValidation from './customer.param-validation';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/customers - Get list of customers */
  .get(customerCtrl.list)

  /** POST /api/customers - Create new customer */
  .post(validate(paramValidation.createCustomer), customerCtrl.create);

router.route('/:customerId')
  /** GET /api/customers/:customerId - Get customer */
  .get(customerCtrl.get)

  /** PUT /api/customers/:customerId - Update customer */
  .put(validate(paramValidation.updateCustomer), customerCtrl.update)

  /** DELETE /api/customers/:customerId - Delete customer */
  .delete(customerCtrl.remove);

/** Load customer when API with customerId route parameter is hit */
router.param('customerId', customerCtrl.load);

export default router;
