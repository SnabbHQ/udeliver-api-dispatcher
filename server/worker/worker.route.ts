import * as express from 'express';
import * as validate from 'express-validation';
import workerCtrl from './worker.controller';
import paramValidation from './worker.param-validation';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/workers - Get list of workers */
  .get(workerCtrl.list)

  /** POST /api/workers - Create new worker */
  .post(validate(paramValidation.createWorker), workerCtrl.create);

router.route('/:workerId')
  /** GET /api/workers/:workerId - Get worker */
  .get(workerCtrl.get)

  /** PUT /api/workers/:workerId - Update worker */
  .put(validate(paramValidation.updateWorker), workerCtrl.update)

  /** DELETE /api/workers/:workerId - Delete worker */
  .delete(workerCtrl.remove);

/** Load worker when API with workerId route parameter is hit */
router.param('workerId', workerCtrl.load);

export default router;
