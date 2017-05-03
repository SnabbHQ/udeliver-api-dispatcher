import * as Joi from 'joi';
import Regex from '../utils/Regex';
import { TransportType } from './worker.model';

export default {
  // POST /api/workers
  createWorker: {
    body: {
      color: Joi.string().optional(),
      email: Joi.string().email().required(),
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      licensePlate: Joi.string().optional(),
      location: Joi.object({
        latitude: Joi.number().optional(),
        longitude: Joi.number().optional(),
      }),
      mobileNumber: Joi.string().regex(Regex.MobilePhoneRegex).required(),
      transportDesc: Joi.string().optional(),
      transportType: Joi.string().required().valid(
        TransportType.Bicycle,
        TransportType.Car,
        TransportType.Foot,
        TransportType.Motorcycle,
        TransportType.Scooter,
        TransportType.Truck,
        ),
    },
  },

  // UPDATE /api/workers/:workerId
  updateWorker: {
    body: {
      color: Joi.string().optional(),
      email: Joi.string().email().required(),
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      licensePlate: Joi.string().optional(),
      location: Joi.object({
        latitude: Joi.number().optional(),
        longitude: Joi.number().optional(),
      }),
      mobileNumber: Joi.string().regex(Regex.MobilePhoneRegex).required(),
      transportDesc: Joi.string().optional(),
      transportType: Joi.string().required().valid(
        TransportType.Bicycle,
        TransportType.Car,
        TransportType.Foot,
        TransportType.Motorcycle,
        TransportType.Scooter,
        TransportType.Truck,
        ),
    },
    params: {
      workerId: Joi.string().hex().required(),
    },
  },
};

