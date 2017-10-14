import * as chalk from 'chalk';
import * as connectMongo from 'connect-mongo';
import * as express from 'express';
import * as session from 'express-session';
import * as mongoose from 'mongoose';

import { IFeature } from './../../types/features.d';

const MongoStore: connectMongo.MongoStoreFactory = connectMongo(session);

class Mongo implements IFeature {
  constructor(app: express.Application) {
    app.use(session({
      resave: true,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET,
      store: this.getStore(),
    }));
  }

  public featureName: string = 'db';

  public connect = () => new Promise((resolve, reject) => {
    (mongoose as any).Promise = global.Promise;

    mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

    mongoose.connection.on('error', (err) => {
      console.error(err);
      console.info('MongoDB connection error. Please make sure MongoDB is running.');
      reject({ status: 'FAILURE' });
    });
    mongoose.connection.on('connected', () => {
      console.info('MongoDB connection established');
      resolve({ status: 'OK' });
    });
  })

  private getStore = (): connectMongo.MongoStore => new MongoStore({
    autoReconnect: true,
    url: process.env.MONGODB_URI,
  })
}

export default Mongo;
