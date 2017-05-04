import * as Joi from 'joi';
import Regex from '../utils/Regex';

export default {
  // POST /api/contacts
  createContact: {
    body: {
      companyName: Joi.string().optional(),
      email: Joi.string().email().optional(),
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      mobileNumber: Joi.string().regex(Regex.MobilePhoneRegex).optional(),
    },
  },

  // UPDATE /api/contacts/:contactId
  updateContact: {
    body: {
      companyName: Joi.string().optional(),
      email: Joi.string().email().optional(),
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      mobileNumber: Joi.string().regex(Regex.MobilePhoneRegex).optional(),
    },
    params: {
      contactId: Joi.string().hex().required(),
    },
  },
};

