import { Document, Model, model, Schema } from 'mongoose';
import APIResponse from '../utils/APIResponse';

export type TaskType = 'pickup' | 'dropoff';
export const TaskType = {
  Dropoff: 'dropoff' as TaskType,
  Pickup: 'pickup' as TaskType,
};

export interface ITask extends Document {
  comments: string;
  createdAt: Date;
  completeAfter: Date;
  completeBefore: Date;
  type: TaskType;
}

export interface IList {
  limit: number;
  skip: number;
}

export interface ITaskModel {
  get(id: string): Promise<ITask>;
  list(param: IList): Promise<ITask[]>;
}

/**
 * Task Schema
 */
const schema = new Schema({
  comments: {
    required: false,
    type: String,
  },
  completeAfter: {
    type: Date,
  },
  completeBefore: {
    type: Date,
  },
  createdAt: {
    default: Date.now,
    type: Date,
  },
  type: {
    enum: [ TaskType.Pickup, TaskType.Dropoff ],
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
    return this.findById(id).exec().then(task => {
      if (task) {
        return task;
      }
      const err = APIResponse.taskNotFound();
      return Promise.reject(err);
    });
  },

  /**
   * List tasks in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of tasks to be skipped.
   * @param {number} limit - Limit number of tasks to be returned.
   * @returns {Promise<Task[]>}
   */
  list({
    skip = 0,
    limit = 50,
  } = {}) {
    return this.find().sort({ createdAt: -1 }).skip(+skip).limit(+limit)
    .exec();
  },
};

export type TaskModel = Model<ITask> & ITaskModel;
export const Task: TaskModel = model<ITask>('Task', schema) as TaskModel;
