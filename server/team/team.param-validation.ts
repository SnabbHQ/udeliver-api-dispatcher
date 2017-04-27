import * as Joi from 'joi';

export default {
  // POST /api/teams
  createTeam: {
    body: {
      description: Joi.string().optional(),
      name: Joi.string().required(),
    },
  },

  // UPDATE /api/teams/:teamsId
  updateTeam: {
    body: {
      description: Joi.string().optional(),
      name: Joi.string().required(),
    },
    params: {
      teamId: Joi.string().hex().required(),
    },
  },
};
