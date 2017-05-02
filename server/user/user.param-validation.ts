import * as Joi from 'joi';

export default {
  // POST /api/users
  createUser: {
    body: {
      email: Joi.string().email().required(),
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      mobileNumber: Joi.string().regex(/^(\+?)(?:[0-9] ?){6,14}[0-9]$/).required(),
    },
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      email: Joi.string().email().required(),
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      mobileNumber: Joi.string().regex(/^(\+?)(?:[0-9] ?){6,14}[0-9]$/).required(),
    },
    params: {
      userId: Joi.string().hex().required(),
    },
  },
};

