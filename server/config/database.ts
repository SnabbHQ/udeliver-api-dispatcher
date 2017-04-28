import mongoose = require('mongoose');
import mockgoose = require('mockgoose');
import config from './config';

// if (process.env.NODE_ENV === "testing") {
//     mockgoose(mongoose).then((): void => { mongoose.connect("mongodb://example.com/TestingDB") });
// } else {
//     mongoose.connect("mongodb://127.0.0.1/typescript_mongoose");
// }

// plugin bluebird promise in mongoose
// mongoose.Promise = Promise;

// // connect to mongo db
// const mongoUri = config.mongo.host;
// mongoose.connect(mongoUri, { server: { socketOptions: { keepAlive: 1 } } });
// mongoose.connection.on('error', () => {
//   throw new Error(`unable to connect to database: ${mongoUri}`);
// });

// print mongoose logs in dev env
// if (config.mongooseDebug) {
//   mongoose.set('debug', (collectionName, method, query, doc) => {
//     debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
//   });
// }
