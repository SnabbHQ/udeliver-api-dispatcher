import * as winston from 'winston';

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true,
      json: true,
    }),
  ],
});

export default logger;
