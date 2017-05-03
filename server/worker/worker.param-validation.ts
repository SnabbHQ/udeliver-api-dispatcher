import * as Joi from 'joi';

export default {
  // POST /api/workers
  createWorker: {
    body: {
      email: Joi.string().email().required(),
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      mobileNumber: Joi.string().regex(/^(\+?)(?:[0-9] ?){6,14}[0-9]$/).required(),
    },
  },

  // UPDATE /api/workers/:workerId
  updateWorker: {
    body: {
      email: Joi.string().email().required(),
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      mobileNumber: Joi.string().regex(/^(\+?)(?:[0-9] ?){6,14}[0-9]$/).required(),
    },
    params: {
      workerId: Joi.string().hex().required(),
    },
  },
};

