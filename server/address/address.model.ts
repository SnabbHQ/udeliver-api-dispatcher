import { Document, Model, model, Schema } from 'mongoose';
import APIResponse from '../utils/APIResponse';
import Regex from '../utils/Regex';

export interface IAddress extends Document {
  apartmentNumber?: string;
  city: string;
  countryCode: string;
  createdAt: Date;
  number: string;
  postalCode: string;
  state?: string;
  street: string;
}

/**
 * Address
 */
export const Address = {
  apartmentNumber: {
    required: false,
    type: String,
  },
  city: {
    required: true,
    type: String,
  },
  countryCode: {
    required: true,
    type: String,
  },
  createdAt: {
    default: Date.now,
    type: Date,
  },
  number: {
    required: true,
    type: String,
  },
  postalCode: {
    required: true,
    type: String,
  },
  state: {
    required: false,
    type: String,
  },
  street: {
    required: true,
    type: String,
  },
};
