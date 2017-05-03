import * as express from 'express';
import * as validate from 'express-validation';
import taskCtrl from './task.controller';
import paramValidation from './task.param-validation';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** GET /api/tasks - Get list of tasks */
  .get(taskCtrl.list)

  /** POST /api/tasks - Create new task */
  .post(validate(paramValidation.createTask), taskCtrl.create);

router.route('/:taskId')
  /** GET /api/tasks/:taskId - Get task */
  .get(taskCtrl.get)

  /** PUT /api/tasks/:taskId - Update task */
  .put(validate(paramValidation.updateTask), taskCtrl.update)

  /** DELETE /api/tasks/:taskId - Delete task */
  .delete(taskCtrl.remove);

/** Load task when API with taskId route parameter is hit */
router.param('taskId', taskCtrl.load);

export default router;
