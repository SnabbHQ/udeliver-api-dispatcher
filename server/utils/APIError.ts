import * as httpStatus from 'http-status';

/**
 * @extends Error
 */
class ExtendableError extends Error {
  status: number;
  code: number;
  key: string;
  isPublic: boolean;
  isOperational: boolean;

  constructor(code, key, message, status, isPublic) {
    super(message);
    //this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.code = code;
    this.key = key;
    this.isPublic = isPublic;
    this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
    
    //Error.captureStackTrace(this, this.constructor.name);
  }
}

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
  constructor(code = 500000, key = 'UNKNOWN_ERROR', message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false) {
    super(code, key, message, status, isPublic);
  }
}

export default APIError;