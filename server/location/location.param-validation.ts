import * as Joi from 'joi';
import Regex from '../utils/Regex';

export default {
  // POST /api/locations
  createLocation: {
    body: {
      address: Joi.string().required(),
      address2: Joi.string().optional(),
      city: Joi.string().required(),
      country: Joi.string().required(),
      latitude: Joi.number().optional(),
      longitude: Joi.number().optional(),
      postalCode: Joi.string().required(),
      state: Joi.string().optional(),
    },
  },

  // UPDATE /api/locations/:locationId
  updateLocation: {
    body: {
      address: Joi.string().required(),
      address2: Joi.string().optional(),
      city: Joi.string().required(),
      country: Joi.string().required(),
      latitude: Joi.number().optional(),
      longitude: Joi.number().optional(),
      postalCode: Joi.string().required(),
      state: Joi.string().optional(),
    },
    params: {
      locationId: Joi.string().hex().required(),
    },
  },
};

