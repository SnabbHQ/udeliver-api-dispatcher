import { NextFunction, Request, Response } from 'express';
import APIResponse from '../utils/APIResponse';
import { IWorker, Worker } from './worker.model';

import logger from '../config/winston';

interface IWorkerRequest extends Request {
  worker: IWorker;
}

/**
 * Load worker and append to req.
 */
function load(req: IWorkerRequest, res: Response, next: NextFunction, id: string) {
  Worker.get(id).then(worker => {
    req.worker = worker;
    return next();
  }).catch(e => next(e));
}

/**
 * Get worker
 * @returns {Worker}
 */
function get(req, res) {
  return res.json(req.worker);
}

/**
 * Create new worker
 * @property {string} req.body.email - The email of worker.
 * @property {string} req.body.firstName - The first name of worker.
 * @property {string} req.body.lastName - The last name of worker.
 * @property {string} req.body.mobileNumber - The mobileNumber of worker.
 * @returns {Worker}
 */
function create(req: IWorkerRequest, res: Response, next: NextFunction) {
  const worker = new Worker({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mobileNumber: req.body.mobileNumber,
  });

  worker.save()
  .then(savedWorker => res.json(savedWorker))
  .catch(err => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate worker
        const apiError = APIResponse.workerAlreadyExists();
        next(apiError);
      }

      next(err);
    }
  });
}

/**
 * Update existing worker
 * @property {string} req.body.email - The email of worker.
 * @property {string} req.body.firstName - The first name of worker.
 * @property {string} req.body.lastName - The last name of worker.
 * @property {string} req.body.mobileNumber - The mobileNumber of worker.
 * @returns {Worker}
 */
function update(req: IWorkerRequest, res: Response, next: NextFunction) {
  const worker = req.worker;
  worker.email = req.body.email;
  worker.firstName = req.body.firstName;
  worker.lastName = req.body.lastName;
  worker.mobileNumber = req.body.mobileNumber;

  worker.save().then(savedWorker => res.json(savedWorker)).catch(e => next(e));
}

/**
 * Get worker list.
 * @property {number} req.query.skip - Number of workers to be skipped.
 * @property {number} req.query.limit - Limit number of workers to be returned.
 * @returns {Worker[]}
 */
function list(req: IWorkerRequest, res: Response, next: NextFunction) {
  const {
    limit = 50,
    skip = 0,
  } = req.query;
  Worker.list({ limit, skip }).then(workers => res.json(workers)).catch(e => next(e));
}

/**
 * Delete worker.
 * @returns {Worker}
 */
function remove(req: IWorkerRequest, res: Response, next: NextFunction) {
  const worker = req.worker;
  worker.remove()
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
