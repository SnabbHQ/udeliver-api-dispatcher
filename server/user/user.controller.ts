import { NextFunction, Request, Response } from 'express';
import APIResponse from '../utils/APIResponse';
import { IUser, User } from './user.model';

import logger from '../config/winston';

interface IUserRequest extends Request {
  user: IUser;
}

/**
 * Load user and append to req.
 */
function load(req: IUserRequest, res: Response, next: NextFunction, id: string) {
  User.get(id).then(user => {
    req.user = user;
    return next();
  }).catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.firstName - The first name of user.
 * @property {string} req.body.lastName - The last name of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req: IUserRequest, res: Response, next: NextFunction) {
  const user = new User({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mobileNumber: req.body.mobileNumber,
  });

  user.save()
  .then(savedUser => res.json(savedUser))
  .catch(err => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate user
        const apiError = APIResponse.userAlreadyExists();
        next(apiError);
      }

      next(err);
    }
  });
}

/**
 * Update existing user
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.firstName - The first name of user.
 * @property {string} req.body.lastName - The last name of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req: IUserRequest, res: Response, next: NextFunction) {
  const user = req.user;
  user.email = req.body.email;
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.mobileNumber = req.body.mobileNumber;

  user.save().then(savedUser => res.json(savedUser)).catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req: IUserRequest, res: Response, next: NextFunction) {
  const {
    limit = 50,
    skip = 0,
  } = req.query;
  User.list({ limit, skip }).then(users => res.json(users)).catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req: IUserRequest, res: Response, next: NextFunction) {
  const user = req.user;
  user.remove()
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
