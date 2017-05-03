import { NextFunction, Request, Response } from 'express';
import webSocket from '../config/websocket';
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
 * @property {string} req.body.color - The color of the vehicle (if any) of the agent.
 * @property {string} req.body.email - The email of agent.
 * @property {string} req.body.firstName - The first name of agent.
 * @property {string} req.body.lastName - The last name of agent.
 * @property {string} req.body.licensePlate - The license plate of the agent (if any).
 * @property {string} req.body.mobileNumber - The mobileNumber of agent.
 * @property {string} req.body.transportDesc - The transport description (Year, model) of agent.
 * @property {string} req.body.transportType - The transport type of agent.
 * @returns {Worker}
 */
function create(req: IWorkerRequest, res: Response, next: NextFunction) {
  const worker = new Worker({
    color: req.body.color,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    licensePlate: req.body.licensePlate,
    location: req.body.location,
    mobileNumber: req.body.mobileNumber,
    transportDesc: req.body.transportDesc,
    transportType: req.body.transportType,
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
 * @property {string} req.body.color - The color of the vehicle (if any) of the agent.
 * @property {string} req.body.email - The email of agent.
 * @property {string} req.body.firstName - The first name of agent.
 * @property {string} req.body.lastName - The last name of agent.
 * @property {string} req.body.licensePlate - The license plate of the agent (if any).
 * @property {string} req.body.mobileNumber - The mobileNumber of agent.
 * @property {string} req.body.transportDesc - The transport description (Year, model) of agent.
 * @property {string} req.body.transportType - The transport type of agent.
 * @returns {Worker}
 */
function update(req: IWorkerRequest, res: Response, next: NextFunction) {
  const worker = req.worker;
  worker.color = req.body.color;
  worker.email = req.body.email;
  worker.firstName = req.body.firstName;
  worker.lastName = req.body.lastName;
  worker.licensePlate = req.body.licensePlate;
  worker.location = req.body.location;
  worker.mobileNumber = req.body.mobileNumber;
  worker.transportDesc = req.body.transportDesc;
  worker.transportType = req.body.transportType;

  worker.save()
  .then(savedWorker => res.json(savedWorker))
  .then(() => webSocket.trigger('worker_location_channel', 'location-update', { location: worker.location }))
  .catch(e => next(e));
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
