import { Document, Model, model, Schema } from 'mongoose';
import APIResponse from '../utils/APIResponse';
import Regex from '../utils/Regex';

export interface IAddress extends Document {
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

export interface IAddressModel {
  get(id: string): Promise<IAddress>;
  list(param: IList): Promise<IAddress[]>;
}

/**
 * Address Schema
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
    return this.findById(id).exec().then(address => {
      if (address) {
        return address;
      }
      const err = APIResponse.addressNotFound();
      return Promise.reject(err);
    });
  },

  /**
   * List addresss in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of addresss to be skipped.
   * @param {number} limit - Limit number of addresss to be returned.
   * @returns {Promise<Address[]>}
   */
  list({
    skip = 0,
    limit = 50,
  } = {}) {
    return this.find().sort({ createdAt: -1 }).skip(+skip).limit(+limit)
    .exec();
  },
};

export type AddressModel = Model<IAddress> & IAddressModel;
export const Address: AddressModel = model<IAddress>('Address', schema) as AddressModel;
