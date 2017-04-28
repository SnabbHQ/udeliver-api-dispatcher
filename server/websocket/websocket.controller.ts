import { NextFunction, Request, Response } from 'express';
import * as httpStatus from 'http-status';
import websocket from '../config/websocket';
import APIResponse from '../utils/APIResponse';

/**
 * Returns pusher token if valid socke_id and channel
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function auth(req: Request, res: Response, next: NextFunction) {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;

  // const userId = channel.split('-').pop();
  // winston.info(userId);

  const presenceData = {
    user_id: '58f5f7fa95328cb375975a09',
    user_info: {
      name: 'Mr Pusher',
      twitter_id: '@pusher',
    },
  };
  const authToken = websocket.authenticate(socketId, channel, presenceData);
  if (authToken) {
    return res.send(authToken);
  }

  const err = APIResponse.unAuthorized();
  return next(err);
}

/**
 * Webhook endpoint for pusher to notify if a certain channel becomes available
 * or not. This way we can track if a certain worker goes onDuty or not.
 * @param req
 * @param res
 * @param next
 * @property {number} req.body.time_ms - Time in ms of when the event ocurred.
 * @property {array} req.body.events - An array of events given by pusher.
 * @returns {*}
 */
function onDuty(req: Request, res: Response) {
  const timeMs = req.body.time_ms;
  const events = req.body.events;

  // Here we should do the following:
  // 1. Parse the events[0].channel to find out the id of the agent onDuty
  // 2. Check if the events[0].name is either channel_vacated or channel_occupied
  // for that specific user.
  // 3. Update in the DB the onDuty state of the user
  // 4. Trigger an event in which lists all the agents online at the moment.

  return res.json({
    timeMs,
    events,
  });
}

export default { auth, onDuty };
