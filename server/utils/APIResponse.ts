import * as httpStatus from 'http-status';
import APIError from './APIError';

/**
* Collection of all the responses the API will give through the router endpoints.
* Thanks to this collection we can keep consistent all the responses and make
* sure our beloved client developers don't go bananas with different error responses
* in each endpoint.
**/
class APIResponse {

  /**
  * 401 Group
  **/
  static unAuthorized() {
    return new APIError(
      422000,
      'UNAUTHORIZED',
      'Authentication error',
      httpStatus.UNAUTHORIZED,
      true
    );
  }

  /**
  * 404 Group
  **/
  static apiNotFound() {
    return new APIError(
      404000,
      'API_NOT_FOUND',
      'API not found',
      httpStatus.NOT_FOUND,
      true
    );
  }

  static agentNotFound() {
    return new APIError(
        404001,
        'AGENT_NOT_FOUND',
        'No such agent exists',
        httpStatus.NOT_FOUND,
        true
    );
  }

  static organizationNotFound() {
    return new APIError(
        404002,
        'ORGANIZATION_NOT_FOUND',
        'No such organization exists',
        httpStatus.NOT_FOUND,
        true
    );
  }

  static taskNotFound() {
    return new APIError(
        404003,
        'TASK_NOT_FOUND',
        'No such task exists',
        httpStatus.NOT_FOUND,
        true
    );
  }

  static teamNotFound() {
    return new APIError(
        404004,
        'TEAM_NOT_FOUND',
        'No such team exists',
        httpStatus.NOT_FOUND,
        true
    );
  }

  static userNotFound() {
    return new APIError(
        404005,
        'USER_NOT_FOUND',
        'No such user exists',
        httpStatus.NOT_FOUND,
        true
    );
  }

  /**
  * 422 Group
  **/
  static invalidRequest(errorMessage = 'Invalid Request') {
    return new APIError(
      422000,
      'INVALID_REQUEST',
      errorMessage,
      httpStatus.UNPROCESSABLE_ENTITY,
      true
    );
  }
}

export default APIResponse;
