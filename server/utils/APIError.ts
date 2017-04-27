import * as httpStatus from 'http-status';
import ExtendableError from './ExtendableError';

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {

  /**
   * Creates an API error.
   * @param {number} code - Custom Error code. Wil follow patter HttpStatus + incremental eg. 400001
   * @param {string} key - Custom Error code.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor(
    code = 500000,
    key: string = 'UNKNOWN_ERROR',
    message: string,
    status: number = httpStatus.INTERNAL_SERVER_ERROR,
    isPublic: boolean = false) {
    super(code, key, message, status, isPublic);
  }
}

export default APIError;
