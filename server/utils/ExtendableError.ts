/**
 * @extends Error
 */
class ExtendableError extends Error {
  public code: number;
  public isOperational: boolean;
  public isPublic: boolean;
  public key: string;
  public status: number;

  constructor(code, key, message, status, isPublic) {
    super(message);
    // this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.code = code;
    this.key = key;
    this.isPublic = isPublic;
    this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.

    // Error.captureStackTrace(this, this.constructor.name);
  }
}

export default ExtendableError;
