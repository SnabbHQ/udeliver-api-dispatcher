import { Document, Model, model, Schema } from 'mongoose';
import APIResponse from '../utils/APIResponse';
import Regex from '../utils/Regex';

export interface ICustomer extends Document {
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

export interface ICustomerModel {
  get(id: string): Promise<ICustomer>;
  list(param: IList): Promise<ICustomer[]>;
}

/**
 * Customer Schema
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
    match: [ Regex.MobilePhoneRegex, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.'],
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
    return this.findById(id).exec().then(customer => {
      if (customer) {
        return customer;
      }
      const err = APIResponse.customerNotFound();
      return Promise.reject(err);
    });
  },

  /**
   * List customers in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of customers to be skipped.
   * @param {number} limit - Limit number of customers to be returned.
   * @returns {Promise<Customer[]>}
   */
  list({
    skip = 0,
    limit = 50,
  } = {}) {
    return this.find().sort({ createdAt: -1 }).skip(+skip).limit(+limit)
    .exec();
  },
};

export type CustomerModel = Model<ICustomer> & ICustomerModel;
export const Customer: CustomerModel = model<ICustomer>('Customer', schema) as CustomerModel;
