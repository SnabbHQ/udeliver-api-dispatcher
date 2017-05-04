import * as express from 'express';
import * as validate from 'express-validation';
import locationCtrl from './location.controller';
import paramValidation from './location.param-validation';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/locations - Get list of locations */
  .get(locationCtrl.list)

  /** POST /api/locations - Create new location */
  .post(validate(paramValidation.createLocation), locationCtrl.create);

router.route('/:locationId')
  /** GET /api/locations/:locationId - Get location */
  .get(locationCtrl.get)

  /** PUT /api/locations/:locationId - Update location */
  .put(validate(paramValidation.updateLocation), locationCtrl.update)

  /** DELETE /api/locations/:locationId - Delete location */
  .delete(locationCtrl.remove);

/** Load location when API with locationId route parameter is hit */
router.param('locationId', locationCtrl.load);

export default router;
