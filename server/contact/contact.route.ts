import * as express from 'express';
import * as validate from 'express-validation';
import contactCtrl from './contact.controller';
import paramValidation from './contact.param-validation';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/contacts - Get list of contacts */
  .get(contactCtrl.list)

  /** POST /api/contacts - Create new contact */
  .post(validate(paramValidation.createContact), contactCtrl.create);

router.route('/:contactId')
  /** GET /api/contacts/:contactId - Get contact */
  .get(contactCtrl.get)

  /** PUT /api/contacts/:contactId - Update contact */
  .put(validate(paramValidation.updateContact), contactCtrl.update)

  /** DELETE /api/contacts/:contactId - Delete contact */
  .delete(contactCtrl.remove);

/** Load contact when API with contactId route parameter is hit */
router.param('contactId', contactCtrl.load);

export default router;
