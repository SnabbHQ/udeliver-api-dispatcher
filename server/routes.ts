import * as express from 'express';
import teamRoutes from './team/team.route';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK'),
);

// mount teams routes at /teams
router.use('/teams', teamRoutes);

export default router;
