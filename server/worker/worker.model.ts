import { ObjectId } from '@types/bson';
import { Document, Model, model, Schema } from 'mongoose';
import { ILocation, Location } from '../location/location.model';
import APIResponse from '../utils/APIResponse';
import Regex from '../utils/Regex';

export type TransportType =
  'bicycle'
| 'car'
| 'foot'
| 'motorcycle'
| 'scooter'
| 'truck';

export const TransportType = {
  Bicycle: 'bicycle' as TransportType,
  Car: 'car' as TransportType,
  Foot: 'foot' as TransportType,
  Motorcycle: 'motorycycle' as TransportType,
  Scooter: 'scooter' as TransportType,
  Truck: 'truck' as TransportType,
};

export interface IWorker extends Document {
  createdAt: Date;
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  transportType: string;
  transportDesc: string;
  licensePlate: string;
  location?: ILocation;
  color: string;
}

export interface IList {
  limit?: number;
  skip?: number;
}

export interface IWorkerModel {
  findAll(ids: string[]): Promise<IWorker[]>;
  get(id: string): Promise<IWorker>;
  list(param: IList): Promise<IWorker[]>;
}

/**
 * Worker Schema
 */
const schema = new Schema({
  color: {
    required: false,
    type: String,
  },
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
  licensePlate: {
    required: false,
    type: String,
  },
  location: {
    required: false,
    type: Location,
  },
  mobileNumber: {
    match: [ Regex.MobilePhoneRegex, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.'],
    required: true,
    type: String,
  },
  transportDesc: {
    required: false,
    type: String,
  },
  transportType: {
    enum: [
      TransportType.Bicycle,
      TransportType.Car,
      TransportType.Foot,
      TransportType.Motorcycle,
      TransportType.Scooter,
      TransportType.Truck,
    ],
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
