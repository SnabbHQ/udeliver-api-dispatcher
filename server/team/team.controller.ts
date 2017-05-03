import { NextFunction, Request, Response } from 'express';
import logger from '../config/winston';
import APIResponse from '../utils/APIResponse';
import { Worker } from '../worker/worker.model';
import { ITeam, Team } from './team.model';

interface ITeamRequest extends Request {
  team: ITeam;
}

class TeamController {
  /**
   * Create new team
   * @property {string} req.body.name - The name of team.
   * @property {string} req.body.description - The descrioption of team.
   * @returns {Team}
   */
  public static create(req: ITeamRequest, res: Response, next: NextFunction) {
    // TODO - Make sure to check that the id of the workers being added actually do exists
    // TODO - Also make sure to update the worker's array of teams which belongs to.

    const team = new Team({
      description: req.body.description,
      name: req.body.name,
      workers: req.body.workers,
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
  public static update(req: ITeamRequest, res: Response, next: NextFunction) {
    const team = req.team;
    team.name = req.body.name;
    team.description = req.body.description;
    team.workers = req.body.workers;

    team.save().then(savedTeam => res.json(savedTeam)).catch(e => next(e));
  }

/**
 * Get team list.
 * @property {number} req.query.skip - Number of teams to be skipped.
 * @property {number} req.query.limit - Limit number of teams to be returned.
 * @returns {Team[]}
 */
  public static list(req: ITeamRequest, res: Response, next: NextFunction) {
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
  public static remove(req: ITeamRequest, res: Response, next: NextFunction) {
    const team = req.team;
    team.remove()
    .then(() => res.send('OK'))
    .catch(e => next(e));
  }

  /**
   * Load team and append to req.
   */
  public static load(req: ITeamRequest, res: Response, next: NextFunction, id: string) {
    Team.get(id).then(team => {
      req.team = team;
      return next();
    }).catch(e => next(e));
  }

  /**
   * Get team
   * @returns {Team}
   */
  public static get(req, res) {
    return res.json(req.team);
  }
}



export default TeamController;
