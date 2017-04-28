import { NextFunction, Request, Response } from 'express';
import APIResponse from '../utils/APIResponse';
import { ITeam, Team } from './team.model';

interface ITeamRequest extends Request {
  team: ITeam;
}

/**
 * Load team and append to req.
 */
function load(req: ITeamRequest, res: Response, next: NextFunction, id: string) {
  Team.get(id).then(team => {
    req.team = team;
    return next();
  }).catch(e => next(e));
}

/**
 * Get team
 * @returns {Team}
 */
function get(req, res) {
  return res.json(req.team);
}

/**
 * Create new team
 * @property {string} req.body.name - The name of team.
 * @property {string} req.body.description - The descrioption of team.
 * @returns {Team}
 */
function create(req: ITeamRequest, res: Response, next: NextFunction) {
  const team = new Team({
    description: req.body.description,
    name: req.body.name,
  });

  team.save()
  .then(savedTeam => res.json(savedTeam))
  .catch(err => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // Duplicate team
        const apiError = APIResponse.teamAlreadyExists();
        next(apiError);
      }

      next(err);
    }
  });
}

/**
 * Update existing team
 * @property {string} req.body.name - The name of team.
 * @property {string} req.body.description - The descrioption of team.
 * @returns {Team}
 */
function update(req: ITeamRequest, res: Response, next: NextFunction) {
  const team = req.team;
  team.name = req.body.name;
  team.description = req.body.description;

  team.save().then(savedTeam => res.json(savedTeam)).catch(e => next(e));
}

/**
 * Get team list.
 * @property {number} req.query.skip - Number of teams to be skipped.
 * @property {number} req.query.limit - Limit number of teams to be returned.
 * @returns {Team[]}
 */
function list(req: ITeamRequest, res: Response, next: NextFunction) {
  const {
    limit = 50,
    skip = 0,
  } = req.query;
  Team.list({ limit, skip }).then(teams => res.json(teams)).catch(e => next(e));
}

/**
 * Delete team.
 * @returns {Team}
 */
function remove(req: ITeamRequest, res: Response, next: NextFunction) {
  const team = req.team;
  team.remove()
  .then(() => res.send('OK'))
  .catch(e => next(e));
}

export default {
  load,
  get,
  create,
  update,
  list,
  remove,
};
