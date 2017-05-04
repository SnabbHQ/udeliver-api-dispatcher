import { NextFunction, Request, Response } from 'express';
import APIResponse from '../utils/APIResponse';
import { Contact, IContact } from './contact.model';

import logger from '../config/winston';

interface IContactRequest extends Request {
  contact: IContact;
}

/**
 * Load contact and append to req.
 */
function load(req: IContactRequest, res: Response, next: NextFunction, id: string) {
  Contact.get(id).then(contact => {
    req.contact = contact;
    return next();
  }).catch(e => next(e));
}

/**
 * Get contact
 * @returns {Contact}
 */
function get(req, res) {
  return res.json(req.contact);
}

/**
 * Create new contact
 * @property {string} req.body.email - The email of contact.
 * @property {string} req.body.firstName - The first name of contact.
 * @property {string} req.body.lastName - The last name of contact.
 * @property {string} req.body.companyName - The company name of contact.
 * @property {string} req.body.mobileNumber - The mobileNumber of contact.
 * @returns {Contact}
 */
function create(req: IContactRequest, res: Response, next: NextFunction) {
  const contact = new Contact({
    companyName: req.body.companyName,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mobileNumber: req.body.mobileNumber,
  });

  contact.save()
  .then(savedContact => res.json(savedContact))
  .catch(err => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate contact
        const apiError = APIResponse.contactAlreadyExists();
        next(apiError);
      }

      next(err);
    }
  });
}

/**
 * Update existing contact
 * @property {string} req.body.email - The email of contact.
 * @property {string} req.body.firstName - The first name of contact.
 * @property {string} req.body.lastName - The last name of contact.
 * @property {string} req.body.companyName - The company name of contact.
 * @property {string} req.body.mobileNumber - The mobileNumber of contact.
 * @returns {Contact}
 */
function update(req: IContactRequest, res: Response, next: NextFunction) {
  const contact = req.contact;
  contact.companyName = req.body.companyName;
  contact.email = req.body.email;
  contact.firstName = req.body.firstName;
  contact.lastName = req.body.lastName;
  contact.mobileNumber = req.body.mobileNumber;

  contact.save().then(savedContact => res.json(savedContact)).catch(e => next(e));
}

/**
 * Get contact list.
 * @property {number} req.query.skip - Number of contacts to be skipped.
 * @property {number} req.query.limit - Limit number of contacts to be returned.
 * @returns {Contact[]}
 */
function list(req: IContactRequest, res: Response, next: NextFunction) {
  const {
    limit = 50,
    skip = 0,
  } = req.query;
  Contact.list({ limit, skip }).then(contacts => res.json(contacts)).catch(e => next(e));
}

/**
 * Delete contact.
 * @returns {Contact}
 */
function remove(req: IContactRequest, res: Response, next: NextFunction) {
  const contact = req.contact;
  contact.remove()
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
