import { Document, Model, model, Schema } from 'mongoose';
import APIResponse from '../utils/APIResponse';

export interface IWorker extends Document {
  createdAt: Date;
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
}

export interface IList {
  limit: number;
  skip: number;
}

export interface IWorkerModel {
  get(id: string): Promise<IWorker>;
  list(param: IList): Promise<IWorker[]>;
}

/**
 * Worker Schema
 */
const schema = new Schema({
  createdAt: {
    default: Date.now,
    type: Date,
  },
  email: {
    index: { unique: true },
    required: true,
    type: String,
  },
  firstName: {
    required: false,
    type: String,
  },
  lastName: {
    required: false,
    type: String,
  },
  mobileNumber: {
    match: [/^(\+?)(?:[0-9] ?){6,14}[0-9]$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.'],
    required: true,
    type: String,
  },
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Statics
 */
schema.statics = {

  get(id) {
    return this.findById(id).exec().then(worker => {
      if (worker) {
        return worker;
      }
      const err = APIResponse.workerNotFound();
      return Promise.reject(err);
    });
  },

  /**
   * List workers in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of workers to be skipped.
   * @param {number} limit - Limit number of workers to be returned.
   * @returns {Promise<Worker[]>}
   */
  list({
    skip = 0,
    limit = 50,
  } = {}) {
    return this.find().sort({ createdAt: -1 }).skip(+skip).limit(+limit)
    .exec();
  },
};

export type WorkerModel = Model<IWorker> & IWorkerModel;
export const Worker: WorkerModel = model<IWorker>('Worker', schema) as WorkerModel;
