import * as express from 'express';
import organizationRoutes from './organization/organization.route';
import teamRoutes from './team/team.route';
import userRoutes from './user/user.route';
import websocket from './websocket/websocket.router';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK'),
);

// mount auth routes at /auth
// router.use('/auth', authRoutes);

// mount organizations routes at /organizations
router.use('/organizations', organizationRoutes);

// mount tasks routes at /tasks
// router.use('/tasks', taskRoutes);

// mount teams routes at /teams
router.use('/teams', teamRoutes);

// mount users routes at /users
router.use('/users', userRoutes);

// mount websockets routes at /websocket
router.use('/websockets', websocket);

// mount user routes at /users
// router.use('/users', userRoutes);

export default router;
