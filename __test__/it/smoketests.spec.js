import request from 'supertest';
import { stub } from 'sinon';
import App from './../../src/controllers/App';
const app = new App();

describe('List of short tests that cover key product features', () => {
  it('should response with 404 on / endpoint', async () => {
    const response = await request(app.express).get('/');

    expect(response.error.toString()).toContain('404');
  });

  it('should start server and stop it', (done) => {
    stub(console, 'info');
    app.start();
    setTimeout(() => {
      expect(console.info.calledTwice).toBeTruthy();
      expect(console.info.args[0][0]).toBe('%s App is running at http://localhost:%d in %s mode');
      app.stop();
      console.info.restore();
      done();
    }, '100');
  });

  it('should start server automaticaly on require and then stop it', (done) => {
    stub(console, 'info');
    const autoInitedApp = require('./../../src').default;

    setTimeout(() => {
      expect(console.info.calledTwice).toBeTruthy();
      expect(console.info.args[0][0]).toBe('%s App is running at http://localhost:%d in %s mode');
      autoInitedApp.stop();
      console.info.restore();
      done();
    }, '100');
  });
});
