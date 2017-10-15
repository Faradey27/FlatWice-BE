import mongoose from 'mongoose';
import chalk from 'chalk';
import session from 'express-session';

const MongoStore = require('connect-mongo')(session);

class Database {
  constructor() {
    mongoose.Promise = global.Promise; // eslint-disable-line
    mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
    mongoose.connection.on('error', /* istanbul ignore next */ (err) => {
      console.error(err);
      console.info('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    });
  }

  getStore() {
    return new MongoStore({
      url: process.env.MONGODB_URI,
      autoReconnect: true,
      clear_interval: 3600,
    });
  }
}

export default Database;
