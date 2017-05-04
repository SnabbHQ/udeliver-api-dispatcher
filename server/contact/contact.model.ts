import { Document, Model, model, Schema } from 'mongoose';
import APIResponse from '../utils/APIResponse';
import Regex from '../utils/Regex';

export interface IContact extends Document {
  createdAt: Date;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  mobileNumber: string;
}

export interface IList {
  limit: number;
  skip: number;
}

export interface IContactModel {
  get(id: string): Promise<IContact>;
  list(param: IList): Promise<IContact[]>;
}

/**
 * Contact Schema
 */
const schema = new Schema({
  companyName: {
    required: false,
    type: String,
  },
  createdAt: {
    default: Date.now,
    type: Date,
  },
  email: {
    index: { unique: true },
    required: false,
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
    index: { unique: true },
    match: [ Regex.MobilePhoneRegex, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.'],
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
    return this.findById(id).exec().then(contact => {
      if (contact) {
        return contact;
      }
      const err = APIResponse.contactNotFound();
      return Promise.reject(err);
    });
  },

  /**
   * List contacts in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of contacts to be skipped.
   * @param {number} limit - Limit number of contacts to be returned.
   * @returns {Promise<Contact[]>}
   */
  list({
    skip = 0,
    limit = 50,
  } = {}) {
    return this.find().sort({ createdAt: -1 }).skip(+skip).limit(+limit)
    .exec();
  },
};

export type ContactModel = Model<IContact> & IContactModel;
export const Contact: ContactModel = model<IContact>('Contact', schema) as ContactModel;
