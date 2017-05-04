import { Document, Model, model, Schema } from 'mongoose';
import APIResponse from '../utils/APIResponse';
import Regex from '../utils/Regex';

export interface ILocation extends Document {
  address: string;
  address2?: string;
  city: string;
  country: string;
  createdAt: Date;
  latitude?: number;
  longitude?: number;
  postalCode: string;
  state?: string;
}

export interface IList {
  limit: number;
  skip: number;
}

export interface ILocationModel {
  get(id: string): Promise<ILocation>;
  list(param: IList): Promise<ILocation[]>;
}

/**
 * Location Schema
 */
const schema = new Schema({
  address: {
    required: true,
    type: String,
  },
  address2: {
    required: false,
    type: String,
  },
  city: {
    required: true,
    type: String,
  },
  country: {
    required: true,
    type: String,
  },
  createdAt: {
    default: Date.now,
    type: Date,
  },
  latitude: {
    required: false,
    type: Number,
  },
  longitude: {
    required: false,
    type: Number,
  },
  postalCode: {
    required: true,
    type: String,
  },
  state: {
    required: false,
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
    return this.findById(id).exec().then(location => {
      if (location) {
        return location;
      }
      const err = APIResponse.locationNotFound();
      return Promise.reject(err);
    });
  },

  /**
   * List locations in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of locations to be skipped.
   * @param {number} limit - Limit number of locations to be returned.
   * @returns {Promise<Location[]>}
   */
  list({
    skip = 0,
    limit = 50,
  } = {}) {
    return this.find().sort({ createdAt: -1 }).skip(+skip).limit(+limit)
    .exec();
  },
};

export type LocationModel = Model<ILocation> & ILocationModel;
export const Location: LocationModel = model<ILocation>('Location', schema) as LocationModel;
