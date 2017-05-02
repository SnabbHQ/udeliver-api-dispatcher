import { Document, Model, model, Schema } from 'mongoose';
import APIResponse from '../utils/APIResponse';

export interface IOrganization extends Document {
  createdAt: Date;
  email: string;
  name: string;
}

export interface IList {
  limit: number;
  skip: number;
}

export interface IOrganizationModel {
  get(id: string): Promise<IOrganization>;
  list(param: IList): Promise<IOrganization[]>;
}

/**
 * Organization Schema
 */
const schema = new Schema({
  email: {
    required: false,
    type: String,
  },
  name: {
    index: { unique: true },
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
 * Methods
 */
schema.method({});

/**
 * Statics
 */
schema.statics = {
  /**
   * Get organization
   * @param {ObjectId} id - The objectId of organization.
   * @returns {Promise<Organization, APIError>}
   */
  get(id) {
    return this.findById(id).exec().then(organization => {
      if (organization) {
        return organization;
      }

      const err = APIResponse.organizationNotFound();
      return Promise.reject(err);
    });
  },

  /**
   * List organizations in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of organizations to be skipped.
   * @param {number} limit - Limit number of organizations to be returned.
   * @returns {Promise<Organization[]>}
   */
  list({
    skip = 0,
    limit = 50,
  } = {}) {
    return this.find().sort({ createdAt: -1 }).skip(+skip).limit(+limit)
    .exec();
  },
};

export type OrganizationModel = Model<IOrganization> & IOrganizationModel;
export const Organization: OrganizationModel = model<IOrganization>('Organization', schema) as OrganizationModel;
