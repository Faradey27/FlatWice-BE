import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as dotenv from 'dotenv';
import * as errorHandler from 'errorhandler';
import * as express from 'express';
import * as flash from 'express-flash';
import * as session from 'express-session';
import * as expressStatusMonitor from 'express-status-monitor';
import * as expressValidator from 'express-validator';
import * as path from 'path';
import { IFeature } from './types/features.d';

class App {
  private app: express.Application;
  private server: any;
  private features = new Map<string, IFeature>();

  constructor() {
    dotenv.config({ path: path.join(__dirname, './../.env.example') });

    this.app = express();
    this
      .setPort()
      .setMiddlewares();
  }

  public getExpress = (): express.Application => this.app;

  public setPort = (): App => {
    this.app.set('port', process.env.PORT || '3000');

    return this;
  }

  public setMiddlewares = (): App => {
    this.app.use(expressStatusMonitor());
    this.app.use(compression());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(errorHandler());
    this.app.use(expressValidator());
    this.app.use(flash());
    this.app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

    return this;
  }

  public addFeature(feature: any): Promise<{}> {
    const instanceOfFeature: IFeature = new feature(this.app);

    this.features.set(instanceOfFeature.featureName, instanceOfFeature);

    return instanceOfFeature.connect();
  }

  public getFeatures = (): Map<string, IFeature> => this.features;

  public start = (): Promise<{}> => {
    return new Promise((resolve) => {
      this.server = this.app.listen(this.app.get('port'), () => {
        console.info(
          ('App is running at http://localhost:%d in %s mode'),
          this.app.get('port'),
          this.app.get('env'),
        );
        console.info('Press CTRL-C to stop\n');

        resolve();
      });
    });
  }

  public stop = (): Promise<{}> => {
    this.server.close();

    console.info('Server stopped');

    return Promise.resolve({});
  }
}

const appSingleton = new App();

export default appSingleton;
