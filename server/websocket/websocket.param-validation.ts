import * as Joi from 'joi';

export default {

  // POST /api/pusher/auth
  auth: {
    body: {
      channel_name: Joi.string().required(),
      socket_id: Joi.string().required(),
    },
  },

  // POST /api/pusher/onDuty
  onDuty: {
    body: {
      events: Joi.array().items({
        channel: Joi.string().required(),
        name: Joi.string().required().valid('channel_vacated', 'channel_occupied'),
      }),
      time_ms: Joi.number().optional(),
    },
  },
};
