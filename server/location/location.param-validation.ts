import * as Joi from 'joi';
import Regex from '../utils/Regex';

// Simple location joi validation to encapsulate location validation everywhere
export const LocationValidation = {
  latitude: Joi.number().default(0.0),
  longitude: Joi.number().default(0.0),
};

