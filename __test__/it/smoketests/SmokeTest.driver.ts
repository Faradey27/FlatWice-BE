import * as supertest from 'supertest';
import app from './../../../src/app';

class SmokeTestDriver {
  private request: supertest.SuperTest<supertest.Test>;

  constructor() {
    this.request = supertest(app.getExpress());
  }

  public when = {
    serverStarted: () => app.start(),
    serverStoped: () => app.stop(),
  };

  public get = {
    features: () => app.getFeatures(),
    unknownRequestError: async () => {
      const response = await this.request.get('/');
      return response.error.toString();
    },
  };
}

export default SmokeTestDriver;
