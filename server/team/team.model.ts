import { Schema, Document, Model, model } from "mongoose";
import APIResponse from '../utils/APIResponse';

export interface ITeam extends Document {
    name: string,
    description: string,
    createdAt: Date;
}

export interface IList {
    limit: number;
    skip: number;
}

export interface ITeamModel {
    get(id: string): Promise<ITeam>;
    list(param: IList): Promise<Array<ITeam>>;
}

/**
 * Team Schema
 */
const schema = new Schema({
  name: {
    type: String,
    required: true,
    index: { unique: true }
  },
  description: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
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
    return this.findById(id).exec().then((team) => {
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
    limit = 50
  } = {}) {
    return this.find().sort({ createdAt: -1 }).skip(+skip).limit(+limit)
    .exec();
  }
};

export type TeamModel = Model<ITeam> & ITeamModel;
export const Team: TeamModel = <TeamModel>model<ITeam>("Team", schema);


