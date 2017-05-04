import { NextFunction, Request, Response } from 'express';
import APIResponse from '../utils/APIResponse';
import { Address, IAddress } from './address.model';

import logger from '../config/winston';

interface IAddressRequest extends Request {
  address: IAddress;
}

/**
 * Load address and append to req.
 */
function load(req: IAddressRequest, res: Response, next: NextFunction, id: string) {
  Address.get(id).then(address => {
    req.address = address;
    return next();
  }).catch(e => next(e));
}

/**
 * Get address
 * @returns {Address}
 */
function get(req, res) {
  return res.json(req.address);
}

/**
 * Create new address
 * @property {string} req.body.address - The address of address.
 * @property {string} req.body.address2 - The second part of the address of address.
 * @property {string} req.body.city - The city  of address.
 * @property {string} req.body.country - The country of address.
 * @property {string} req.body.latitude - The latitude of address.
 * @property {string} req.body.longitude - The longitude of address.
 * @property {string} req.body.postalCode - The postal code of address.
 * @property {string} req.body.state - The state of address.
 * @returns {Address}
 */
function create(req: IAddressRequest, res: Response, next: NextFunction) {
  const address = new Address({
    address: req.body.address,
    address2: req.body.address2,
    city: req.body.city,
    country: req.body.country,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    postalCode: req.body.postalCode,
    state: req.body.state,
  });

  address.save()
  .then(savedAddress => res.json(savedAddress))
  .catch(err => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate address
        const apiError = APIResponse.addressAlreadyExists();
        next(apiError);
      }

      next(err);
    }
  });
}

/**
 * Create new address
 * @property {string} req.body.address - The address of address.
 * @property {string} req.body.address2 - The second part of the address of address.
 * @property {string} req.body.city - The city  of address.
 * @property {string} req.body.country - The country of address.
 * @property {string} req.body.latitude - The latitude of address.
 * @property {string} req.body.longitude - The longitude of address.
 * @property {string} req.body.postalCode - The postal code of address.
 * @property {string} req.body.state - The state of address.
 * @returns {Address}
 */
function update(req: IAddressRequest, res: Response, next: NextFunction) {
  const address = req.address;
  address.address = req.body.address;
  address.address2 = req.body.address2;
  address.city = req.body.city;
  address.country = req.body.country;
  address.latitude = req.body.latitude;
  address.longitude = req.body.longitude;
  address.postalCode = req.body.postalCode;
  address.state = req.body.state;

  address.save().then(savedAddress => res.json(savedAddress)).catch(e => next(e));
}

/**
 * Get address list.
 * @property {number} req.query.skip - Number of addresss to be skipped.
 * @property {number} req.query.limit - Limit number of addresss to be returned.
 * @returns {Address[]}
 */
function list(req: IAddressRequest, res: Response, next: NextFunction) {
  const {
    limit = 50,
    skip = 0,
  } = req.query;
  Address.list({ limit, skip }).then(addresss => res.json(addresss)).catch(e => next(e));
}

/**
 * Delete address.
 * @returns {Address}
 */
function remove(req: IAddressRequest, res: Response, next: NextFunction) {
  const address = req.address;
  address.remove()
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
