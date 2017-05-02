import { NextFunction, Request, Response } from 'express';
import APIResponse from '../utils/APIResponse';
import { IOrganization, Organization } from './organization.model';

interface IOrganizationRequest extends Request {
  organization: IOrganization;
}

/**
 * Load organization and append to req.
 */
function load(req: IOrganizationRequest, res: Response, next: NextFunction, id: string) {
  Organization.get(id).then(organization => {
    req.organization = organization;
    return next();
  }).catch(e => next(e));
}

/**
 * Get organization
 * @returns {Organization}
 */
function get(req: IOrganizationRequest, res: Response): Response {
  return res.json(req.organization);
}

/**
 * Create new organization
 * @property {string} req.body.email - The email of organization.
 * @property {string} req.body.name - The name of organization.
 * @returns {Organization}
 */
function create(req: IOrganizationRequest, res: Response, next: NextFunction): void {
  const organization = new Organization({
    email: req.body.email,
    name: req.body.name,
  });

  organization.save()
  .then(savedOrganization => res.json(savedOrganization))
  .catch(err => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate team
        const apiError = APIResponse.organizationAlreadyExists();
        next(apiError);
      }

      next(err);
    }
  });
}

/**
 * Update existing organization
 * @property {string} req.body.email - The email of organization.
 * @property {string} req.body.name - The name of organization.
 * @returns {Organization}
 */
function update(req: IOrganizationRequest, res: Response, next: NextFunction): void {
  const organization = req.organization;
  organization.email = req.body.email;
  organization.name = req.body.name;

  organization.save()
  .then(savedOrganization => res.json(savedOrganization))
  .catch(e => next(e));
}

/**
 * Get organization list.
 * @property {number} req.query.skip - Number of organizations to be skipped.
 * @property {number} req.query.limit - Limit number of organizations to be returned.
 * @returns {Organization[]}
 */
function list(req: IOrganizationRequest, res: Response, next: NextFunction): void {
  const {
    limit = 50,
    skip = 0,
  } = req.query;
  Organization.list({ limit, skip })
  .then(organizations => res.json(organizations))
  .catch(e => next(e));
}

/**
 * Delete organization.
 * @returns {Organization}
 */
function remove(req: IOrganizationRequest, res: Response, next: NextFunction): void {
  const organization = req.organization;
  organization.remove()
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
