import { Document, Model, model, Schema } from 'mongoose';
import APIResponse from '../utils/APIResponse';

export interface ITeam extends Document {
  name: string;
  description: string;
  createdAt: Date;
}

export interface IList {
  limit: number;
  skip: number;
}

export interface ITeamModel {
  get(id: string): Promise<ITeam>;
  list(param: IList): Promise<ITeam[]>;
}

/**
 * Team Schema
 */
const schema = new Schema({
  createdAt: {
    default: Date.now,
    type: Date,
  },
  description: {
    required: false,
    type: String,
  },
  members: [{ type: Schema.Types.ObjectId, ref: 'Member'}],
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
 * Statics
 */
schema.statics = {

  get(id) {
    return this.findById(id).exec().then(team => {
      if (team) {
        return team;
      }
      const err = APIResponse.teamNotFound();
      return Promise.reject(err);
    });
  },

  /**
   * List teams in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of teams to be skipped.
   * @param {number} limit - Limit number of teams to be returned.
   * @returns {Promise<Team[]>}
   */
  list({
    skip = 0,
    limit = 50,
  } = {}) {
    return this.find().sort({ createdAt: -1 }).skip(+skip).limit(+limit)
    .exec();
  },
};

export type TeamModel = Model<ITeam> & ITeamModel;
export const Team: TeamModel = model<ITeam>('Team', schema) as TeamModel;
