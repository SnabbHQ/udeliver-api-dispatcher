import { Document, Model, model, Schema } from 'mongoose';
import APIResponse from '../utils/APIResponse';
import Regex from '../utils/Regex';

export interface IUser extends Document {
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

export interface IUserModel {
  get(id: string): Promise<IUser>;
  list(param: IList): Promise<IUser[]>;
}

/**
 * User Schema
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
    return this.findById(id).exec().then(user => {
      if (user) {
        return user;
      }
      const err = APIResponse.userNotFound();
      return Promise.reject(err);
    });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({
    skip = 0,
    limit = 50,
  } = {}) {
    return this.find().sort({ createdAt: -1 }).skip(+skip).limit(+limit)
    .exec();
  },
};

export type UserModel = Model<IUser> & IUserModel;
export const User: UserModel = model<IUser>('User', schema) as UserModel;
