import * as Joi from 'joi';

export default {
  // POST /api/teams
  createTeam: {
    body: {
      name: Joi.string().required(),
      description: Joi.string().optional(),
    }
  },

  // UPDATE /api/teams/:teamsId
  updateTeam: {
    body: {
      name: Joi.string().required(),
      description: Joi.string().optional(),
    },
    params: {
      teamId: Joi.string().hex().required()
    }
  },
};
