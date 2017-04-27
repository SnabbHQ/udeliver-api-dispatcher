import * as express from 'express';
import teamRoutes from '../team/team.route';
import postRoutes from './post/post';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount posts routes at /posts
router.use('/posts', postRoutes);

// mount teams routes at /teams
router.use('/teams', teamRoutes);

export default router;
