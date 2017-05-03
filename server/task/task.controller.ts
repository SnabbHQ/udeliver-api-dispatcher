import { NextFunction, Request, Response } from 'express';
import webSocket from '../config/websocket';
import APIResponse from '../utils/APIResponse';
import { ITask, Task } from './task.model';

import logger from '../config/winston';

interface ITaskRequest extends Request {
  task: ITask;
}

/**
 * Load task and append to req.
 */
function load(req: ITaskRequest, res: Response, next: NextFunction, id: string) {
  Task.get(id).then(task => {
    req.task = task;
    return next();
  }).catch(e => next(e));
}

/**
 * Get task
 * @returns {Task}
 */
function get(req, res) {
  return res.json(req.task);
}

/**
 * Create new Task
 * @property {string} req.body.comments - Extra comments for the Task.
 * @property {string} req.body.type - Define either if it is a pickup or a dropoff.
 * @returns {Task}
 */
function create(req: ITaskRequest, res: Response, next: NextFunction) {
  const task = new Task({
    comments: req.body.comments,
    type: req.body.type,
  });

  task.save()
  .then(savedTask => { res.json(savedTask); return savedTask; })
  .then(savedTask => webSocket.trigger('tasks', 'new-task', { task: savedTask }))
  .catch(e => next(e));
}

/**
 * Update existing Task
 * @property {string} req.body.comments - Extra comments for the Task.
 * @property {string} req.body.type - Define either if it is a pickup or a dropoff.
 * @returns {Task}
 */
function update(req: ITaskRequest, res: Response, next: NextFunction) {
  const task = req.task;
  task.comments = req.body.comments;
  task.type = req.body.type;

  task.save()
  .then(savedTask => res.json(savedTask))
  .catch(e => next(e));
}

/**
 * Get task list.
 * @property {number} req.query.skip - Number of tasks to be skipped.
 * @property {number} req.query.limit - Limit number of tasks to be returned.
 * @returns {Task[]}
 */
function list(req: ITaskRequest, res: Response, next: NextFunction) {
  const {
    limit = 50,
    skip = 0,
  } = req.query;
  Task.list({ limit, skip }).then(tasks => res.json(tasks)).catch(e => next(e));
}

/**
 * Delete task.
 * @returns {Task}
 */
function remove(req: ITaskRequest, res: Response, next: NextFunction) {
  const task = req.task;
  task.remove()
  .then(() => res.send('OK'))
  .catch(e => next(e));
}

export default {
  load,
  get,
  create,
  update,
  list,
  remove,
};
