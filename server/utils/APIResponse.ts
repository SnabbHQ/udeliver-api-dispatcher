import * as httpStatus from 'http-status';
import APIError from './APIError';

/**
 * Collection of all the responses the API will give through the router endpoints.
 * Thanks to this collection we can keep consistent all the responses and make
 * sure our beloved client developers don't go bananas with different error responses
 * in each endpoint.
 *
 */
class APIResponse {

  /**
   * 401 Group
   */
  public static unAuthorized(): APIError {
    return new APIError(
      422000,
      'UNAUTHORIZED',
      'Authentication error',
      httpStatus.UNAUTHORIZED,
      true,
    );
  }

  /**
   * 404 Group
   */
  public static apiNotFound(): APIError {
    return new APIError(
      404000,
      'API_NOT_FOUND',
      'API not found',
      httpStatus.NOT_FOUND,
      true,
    );
  }

  public static agentNotFound(): APIError {
    return new APIError(
        404001,
        'AGENT_NOT_FOUND',
        'No such agent exists',
        httpStatus.NOT_FOUND,
        true,
    );
  }

  public static organizationNotFound(): APIError {
    return new APIError(
        404002,
        'ORGANIZATION_NOT_FOUND',
        'No such organization exists',
        httpStatus.NOT_FOUND,
        true,
    );
  }

  public static taskNotFound(): APIError {
    return new APIError(
        404003,
        'TASK_NOT_FOUND',
        'No such task exists',
        httpStatus.NOT_FOUND,
        true,
    );
  }

  public static teamNotFound(): APIError {
    return new APIError(
        404004,
        'TEAM_NOT_FOUND',
        'No such team exists',
        httpStatus.NOT_FOUND,
        true,
    );
  }

  public static userNotFound(): APIError {
    return new APIError(
        404005,
        'USER_NOT_FOUND',
        'No such user exists',
        httpStatus.NOT_FOUND,
        true,
    );
  }

  /**
   * 409 Group
   */
  public static organizationAlreadyExists(): APIError {
    return new APIError(
        409001,
        'ORGANIZATION_ALREADY_EXISTS',
        'An organization with the given name already exists',
        httpStatus.CONFLICT,
        true,
    );
  }

  public static teamAlreadyExists(): APIError {
    return new APIError(
        409002,
        'TEAM_ALREADY_EXISTS',
        'A team with the given name already exists',
        httpStatus.CONFLICT,
        true,
    );
  }

  public static userAlreadyExists(): APIError {
    return new APIError(
        409003,
        'USER_ALREADY_EXISTS',
        'A user with the given email already exists',
        httpStatus.CONFLICT,
        true,
    );
  }

  /**
   * 422 Group
   */
  public static invalidRequest(errorMessage = 'Invalid Request'): APIError {
    return new APIError(
      422000,
      'INVALID_REQUEST',
      errorMessage,
      httpStatus.UNPROCESSABLE_ENTITY,
      true,
    );
  }
}

export default APIResponse;
