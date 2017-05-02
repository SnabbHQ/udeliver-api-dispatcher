import * as express from 'express';
import * as validate from 'express-validation';
import organizationCtrl from './organization.controller';
import paramValidation from './organization.param-validation';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/organizations - Get list of organizations */
  .get(organizationCtrl.list)

  /** POST /api/organizations - Create new organization */
  .post(validate(paramValidation.createOrganization), organizationCtrl.create);

router.route('/:organizationId')
  /** GET /api/organizations/:organizationId - Get organization */
  .get(organizationCtrl.get)

  /** PUT /api/organizations/:organizationId - Update organization */
  .put(validate(paramValidation.updateOrganization), organizationCtrl.update)

  /** DELETE /api/organizations/:organizationId - Delete organization */
  .delete(organizationCtrl.remove);

/** Load organization when API with organizationId route parameter is hit */
router.param('organizationId', organizationCtrl.load);

export default router;
