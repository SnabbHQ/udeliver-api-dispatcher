import * as express from 'express';
import * as validate from 'express-validation';
import pusherCtrl from './websocket.controller';
import paramValidation from './websocket.param-validation';

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/pusher/auth - Authentication for presence channel for Puhser */
router.route('/auth')
  .post(validate(paramValidation.auth), pusherCtrl.auth);

/** POST /api/pusher/onDuty - Register a Channel Presence for each of the workers
 * to figure out who is onDuty and who is not
 */
router.route('/onduty')
  .post(validate(paramValidation.onDuty), pusherCtrl.onDuty);

export default router;
