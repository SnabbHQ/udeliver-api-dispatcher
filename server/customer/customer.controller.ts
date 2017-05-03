import { NextFunction, Request, Response } from 'express';
import APIResponse from '../utils/APIResponse';
import { Customer, ICustomer } from './customer.model';

import logger from '../config/winston';

interface ICustomerRequest extends Request {
  customer: ICustomer;
}

/**
 * Load customer and append to req.
 */
function load(req: ICustomerRequest, res: Response, next: NextFunction, id: string) {
  Customer.get(id).then(customer => {
    req.customer = customer;
    return next();
  }).catch(e => next(e));
}

/**
 * Get customer
 * @returns {Customer}
 */
function get(req, res) {
  return res.json(req.customer);
}

/**
 * Create new customer
 * @property {string} req.body.email - The email of customer.
 * @property {string} req.body.firstName - The first name of customer.
 * @property {string} req.body.lastName - The last name of customer.
 * @property {string} req.body.mobileNumber - The mobileNumber of customer.
 * @returns {Customer}
 */
function create(req: ICustomerRequest, res: Response, next: NextFunction) {
  const customer = new Customer({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mobileNumber: req.body.mobileNumber,
  });

  customer.save()
  .then(savedCustomer => res.json(savedCustomer))
  .catch(err => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate customer
        const apiError = APIResponse.customerAlreadyExists();
        next(apiError);
      }

      next(err);
    }
  });
}

/**
 * Update existing customer
 * @property {string} req.body.email - The email of customer.
 * @property {string} req.body.firstName - The first name of customer.
 * @property {string} req.body.lastName - The last name of customer.
 * @property {string} req.body.mobileNumber - The mobileNumber of customer.
 * @returns {Customer}
 */
function update(req: ICustomerRequest, res: Response, next: NextFunction) {
  const customer = req.customer;
  customer.email = req.body.email;
  customer.firstName = req.body.firstName;
  customer.lastName = req.body.lastName;
  customer.mobileNumber = req.body.mobileNumber;

  customer.save().then(savedCustomer => res.json(savedCustomer)).catch(e => next(e));
}

/**
 * Get customer list.
 * @property {number} req.query.skip - Number of customers to be skipped.
 * @property {number} req.query.limit - Limit number of customers to be returned.
 * @returns {Customer[]}
 */
function list(req: ICustomerRequest, res: Response, next: NextFunction) {
  const {
    limit = 50,
    skip = 0,
  } = req.query;
  Customer.list({ limit, skip }).then(customers => res.json(customers)).catch(e => next(e));
}

/**
 * Delete customer.
 * @returns {Customer}
 */
function remove(req: ICustomerRequest, res: Response, next: NextFunction) {
  const customer = req.customer;
  customer.remove()
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
