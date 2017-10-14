import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import errorHandler from 'errorhandler';
import chalk from 'chalk';

const DEFAULT_PORT = 8082;
const DEFAULT_HOST = '0.0.0.0';

class App {
  constructor() {
    this.app = express();
    this.setMiddlewares().setMetaParams();
  }

  // direct link to express app
  get express() {
    return this.app;
  }

  setMiddlewares() {
    this.app.use(compression());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(errorHandler());

    return this;
  }

  setMetaParams() {
    this.app.set('host', process.env.OPENSHIFT_NODEJS_IP || DEFAULT_HOST);
    this.app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || DEFAULT_PORT);

    return this;
  }

  /* istanbul ignore next */
  start() {
    this.server = this.app.listen(this.app.get('port'), () => {
      console.info('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), this.app.get('port'), this.app.get('env'));
      console.info('  Press CTRL-C to stop\n');
    });

    return this;
  }

  /* istanbul ignore next */
  stop() {
    this.server.close();

    return this;
  }
}

export default App;
