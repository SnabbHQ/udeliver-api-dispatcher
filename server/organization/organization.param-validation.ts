import * as Joi from 'joi';

export default {
  // POST /api/organizations
  createOrganization: {
    body: {
      email: Joi.string().email().required(),
      name: Joi.string().required(),
    },
  },

  // UPDATE /api/organizations/:organizationId
  updateOrganization: {
    body: {
      email: Joi.string().email().required(),
      name: Joi.string().required(),
    },
    params: {
      organizationId: Joi.string().hex().required()
    },
  },
};
