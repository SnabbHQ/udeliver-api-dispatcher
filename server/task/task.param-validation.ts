import * as Joi from 'joi';
import { TaskType } from './task.model';

export default {
  // POST /api/tasks
  createTask: {
    body: {
      comments: Joi.string().optional(),
      type: Joi.string().required().valid(TaskType.Pickup, TaskType.Dropoff),
    },
  },

  // UPDATE /api/tasks/:taskId
  updateTask: {
    body: {
      comments: Joi.string().optional(),
      type: Joi.string().required().valid(TaskType.Pickup, TaskType.Dropoff),
    },
    params: {
      taskId: Joi.string().hex().required(),
    },
  },
};

