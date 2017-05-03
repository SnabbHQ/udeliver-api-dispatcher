import * as Joi from 'joi';
import Regex from '../utils/Regex';

export default {
  // POST /api/users
  createUser: {
    body: {
      email: Joi.string().email().required(),
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      mobileNumber: Joi.string().regex(Regex.MobilePhoneRegex).required(),
    },
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      email: Joi.string().email().required(),
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      mobileNumber: Joi.string().regex(Regex.MobilePhoneRegex).required(),
    },
    params: {
      userId: Joi.string().hex().required(),
    },
  },
};

