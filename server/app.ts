import mongoose = require('mongoose');
import * as debug from 'debug';
import { Mockgoose } from 'mockgoose';
import * as util from 'util';

// config should be imported before importing any other file
import config from './config/config';
import app from './config/express';

// make bluebird default Promise
import bluebird = require('bluebird');
Promise = bluebird;

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;

// Initialize mockgoose
const mockgoose: Mockgoose = new Mockgoose(mongoose);

// make sure that if we running test, we isolate the DB to not pollute our own DB with test stuff
if (config.env === 'test') {
  mockgoose.prepareStorage().then((): void => { mongoose.connect('mongodb://udeliver.com/TestingDB'); });
} else {
  mongoose.connect(mongoUri, { server: { socketOptions: { keepAlive: 1 } } });
}

mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env
if (config.mongooseDebug) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  app.listen(process.env.PORT || config.port, () => {

    // tslint:disable-next-line:no-console
    console.info(`server started on port ${process.env.PORT ||
      config.port} (${config.env})`);
  });
}

export { app };
