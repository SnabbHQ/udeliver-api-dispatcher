import * as express from 'express';
import * as validate from 'express-validation';
import teamCtrl from './team.controller';
import paramValidation from './team.param-validation';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/teams - Get list of teams */
  .get(teamCtrl.list)

  /** POST /api/teams - Create new team */
  .post(validate(paramValidation.createTeam), teamCtrl.create);

router.route('/:teamId')
  /** GET /api/teams/:teamId - Get team */
  .get(teamCtrl.get)

  /** PUT /api/teams/:teamId - Update team */
  .put(validate(paramValidation.updateTeam), teamCtrl.update)

  /** DELETE /api/teams/:teamId - Delete team */
  .delete(teamCtrl.remove);

/** Load team when API with teamId route parameter is hit */
router.param('teamId', teamCtrl.load);

export default router;
