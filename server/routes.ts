import * as express from 'express';
import contactRoutes from './contact/contact.route';
import organizationRoutes from './organization/organization.route';
import taskRoutes from './task/task.route';
import teamRoutes from './team/team.route';
import userRoutes from './user/user.route';
import websocketRoutes from './websocket/websocket.route';
import workerRoutes from './worker/worker.route';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK'),
);

// mount auth routes at /auth
// router.use('/auth', authRoutes);

// mount contacts routes at /contacts
router.use('/contacts', contactRoutes);

// mount organizations routes at /organizations
router.use('/organizations', organizationRoutes);

// mount tasks routes at /tasks
router.use('/tasks', taskRoutes);

// mount teams routes at /teams
router.use('/teams', teamRoutes);

// mount users routes at /users
router.use('/users', userRoutes);

// mount websockets routes at /websockets
router.use('/websockets', websocketRoutes);

// mount workers routes at /workers
router.use('/workers', workerRoutes);

export default router;
