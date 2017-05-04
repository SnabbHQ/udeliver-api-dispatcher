import { NextFunction, Request, Response } from 'express';
import APIResponse from '../utils/APIResponse';
import { ILocation, Location } from './location.model';

import logger from '../config/winston';

interface ILocationRequest extends Request {
  location: ILocation;
}

/**
 * Load location and append to req.
 */
function load(req: ILocationRequest, res: Response, next: NextFunction, id: string) {
  Location.get(id).then(location => {
    req.location = location;
    return next();
  }).catch(e => next(e));
}

/**
 * Get location
 * @returns {Location}
 */
function get(req, res) {
  return res.json(req.location);
}

/**
 * Create new location
 * @property {string} req.body.address - The address of location.
 * @property {string} req.body.address2 - The second part of the address of location.
 * @property {string} req.body.city - The city  of location.
 * @property {string} req.body.country - The country of location.
 * @property {string} req.body.latitude - The latitude of location.
 * @property {string} req.body.longitude - The longitude of location.
 * @property {string} req.body.postalCode - The postal code of location.
 * @property {string} req.body.state - The state of location.
 * @returns {Location}
 */
function create(req: ILocationRequest, res: Response, next: NextFunction) {
  const location = new Location({
    address: req.body.address,
    address2: req.body.address2,
    city: req.body.city,
    country: req.body.country,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    postalCode: req.body.postalCode,
    state: req.body.state,
  });

  location.save()
  .then(savedLocation => res.json(savedLocation))
  .catch(err => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate location
        const apiError = APIResponse.locationAlreadyExists();
        next(apiError);
      }

      next(err);
    }
  });
}

/**
 * Create new location
 * @property {string} req.body.address - The address of location.
 * @property {string} req.body.address2 - The second part of the address of location.
 * @property {string} req.body.city - The city  of location.
 * @property {string} req.body.country - The country of location.
 * @property {string} req.body.latitude - The latitude of location.
 * @property {string} req.body.longitude - The longitude of location.
 * @property {string} req.body.postalCode - The postal code of location.
 * @property {string} req.body.state - The state of location.
 * @returns {Location}
 */
function update(req: ILocationRequest, res: Response, next: NextFunction) {
  const location = req.location;
  location.address = req.body.address;
  location.address2 = req.body.address2;
  location.city = req.body.city;
  location.country = req.body.country;
  location.latitude = req.body.latitude;
  location.longitude = req.body.longitude;
  location.postalCode = req.body.postalCode;
  location.state = req.body.state;

  location.save().then(savedLocation => res.json(savedLocation)).catch(e => next(e));
}

/**
 * Get location list.
 * @property {number} req.query.skip - Number of locations to be skipped.
 * @property {number} req.query.limit - Limit number of locations to be returned.
 * @returns {Location[]}
 */
function list(req: ILocationRequest, res: Response, next: NextFunction) {
  const {
    limit = 50,
    skip = 0,
  } = req.query;
  Location.list({ limit, skip }).then(locations => res.json(locations)).catch(e => next(e));
}

/**
 * Delete location.
 * @returns {Location}
 */
function remove(req: ILocationRequest, res: Response, next: NextFunction) {
  const location = req.location;
  location.remove()
  .then(() => res.send('OK'))
  .catch(e => next(e));
}

export default {
  load,
  get,
  create,
  update,
  list,
  remove,
};
