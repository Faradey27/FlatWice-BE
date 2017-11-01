import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import errorHandler from 'errorhandler';
import session from 'express-session';
import chalk from 'chalk';
import dotenv from 'dotenv';
import expressValidator from 'express-validator';
import expressStatusMonitor from 'express-status-monitor';
import flash from 'express-flash';
import path from 'path';

import Database from './../components/Database';
import User from './../components/User';
import Flat from './../components/Flat';

import './../configs/passport';

dotenv.load({ path: path.join(__dirname, '/../configs/params.env') });

class App {
  constructor() {
    this.app = express();
    this.
      initDataBase().
      setMiddlewares().
      setMetaParams().
      initComponents();
  }

  // direct link to express app
  get express() {
    return this.app;
  }

  setMiddlewares() {
    this.app.use(expressStatusMonitor());
    this.app.use(session({
      resave: true,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET,
      store: this.db.getStore(),
    }));

    this.app.use(compression());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(errorHandler());
    this.app.use(expressValidator());
    this.app.use(flash());

    return this;
  }

  setMetaParams() {
    this.app.set('host', process.env.OPENSHIFT_NODEJS_IP);
    this.app.set('port', process.env.PORT);

    return this;
  }

  initDataBase() {
    this.db = new Database();

    return this;
  }

  initComponents() {
    this.user = new User(this.app);
    this.flat = new Flat(this.app, this.user.isAuthenticated, this.user.isAuthorized);

    return this;
  }

  start() {
    this.server = this.app.listen(this.app.get('port'), () => {
      console.info('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), this.app.get('port'), this.app.get('env'));
      console.info('  Press CTRL-C to stop\n');
    });

    return this;
  }

  stop() {
    this.server.close();

    return this;
  }
}

export default App;
