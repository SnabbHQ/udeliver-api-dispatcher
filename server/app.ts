import mongoose = require("mongoose");
import mockgoose = require("mockgoose");

// config should be imported before importing any other file
import config from "./config/config";
import app from './config/express';

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(mongoUri, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  app.listen(process.env.PORT || config.port, () => {
    console.info(`server started on port ${process.env.PORT || config.port} (${config.env})`); // eslint-disable-line no-console
  });
}

export { app };