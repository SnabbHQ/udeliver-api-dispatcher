import * as Joi from 'joi';
import { AddressValidation } from '../address/address.param-validation';
import { TaskType } from './task.model';

export default {
  // POST /api/tasks
  createTask: {
    body: {
      address: Joi.object().keys(AddressValidation).required(),
      comments: Joi.string().optional(),
      type: Joi.string().required().valid(TaskType.Pickup, TaskType.Dropoff),
    },
  },

  // UPDATE /api/tasks/:taskId
  updateTask: {
    body: {
      address: Joi.object().keys(AddressValidation).required(),
      comments: Joi.string().optional(),
      type: Joi.string().required().valid(TaskType.Pickup, TaskType.Dropoff),
    },
    params: {
      taskId: Joi.string().hex().required(),
    },
  },
};

