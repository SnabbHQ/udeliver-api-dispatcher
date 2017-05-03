import * as Joi from 'joi';
import Regex from '../utils/Regex';

export default {
  // POST /api/customers
  createCustomer: {
    body: {
      email: Joi.string().email().required(),
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      mobileNumber: Joi.string().regex(Regex.MobilePhoneRegex).required(),
    },
  },

  // UPDATE /api/customers/:customerId
  updateCustomer: {
    body: {
      email: Joi.string().email().required(),
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      mobileNumber: Joi.string().regex(Regex.MobilePhoneRegex).required(),
    },
    params: {
      customerId: Joi.string().hex().required(),
    },
  },
};

