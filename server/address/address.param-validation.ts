import * as Joi from 'joi';
import Regex from '../utils/Regex';

// Simple address joi validation to encapsulate address validation everywhere
export const AddressValidation = {
  apartmentNumber: Joi.string().optional(),
  city: Joi.string().required(),
  countryCode: Joi.string().required(),
  number: Joi.string().required(),
  postalCode: Joi.string().required(),
  state: Joi.string().optional(),
  street: Joi.string().required(),
};

