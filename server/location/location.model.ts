import { Document, Model, model, Schema } from 'mongoose';
import APIResponse from '../utils/APIResponse';
import Regex from '../utils/Regex';

export interface ILocation extends Document {
  latitude: number;
  longitude: number;
}

/**
 * Location schema props
 */
export const Location = {
  latitude: {
    required: true,
    type: Number,
  },
  longitude: {
    required: true,
    type: Number,
  },
};
