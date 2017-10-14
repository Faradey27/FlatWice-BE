import { stub } from 'sinon';
import SmokeTestDriver from './SmokeTest.driver';

describe('List of short tests that cover key product features', () => {
  let driver: SmokeTestDriver = null;

  beforeEach(() => {
    driver = new SmokeTestDriver();
  });

  it('should response with 404 on / endpoint', async () => {
    expect(await driver.get.unknownRequestError()).toContain('404');
  });

  it('should start server and then should stop it', async () => {
    const stubedConsoleInfo = stub(console, 'info');
    await driver.when.serverStarted();
    expect(stubedConsoleInfo.calledTwice).toBeTruthy();
    expect(stubedConsoleInfo.args[0][0]).toBe('App is running at http://localhost:%d in %s mode');

    await driver.when.serverStoped();
    expect(stubedConsoleInfo.calledThrice).toBeTruthy();
    expect(stubedConsoleInfo.args[2][0]).toBe('Server stopped');

    stubedConsoleInfo.restore();
  });

  it('should start server automaticaly on root file run + features', (done) => {
    const stubedConsoleInfo = stub(console, 'info');
    const app = require('./../../../src').default;

    expect(driver.get.features().has('db')).toBeTruthy();
    expect(driver.get.features().has('user')).toBeTruthy();
    expect(driver.get.features().has('random')).toBeFalsy();

    setTimeout(async () => {
      expect(stubedConsoleInfo.calledThrice).toBeTruthy();
      expect(stubedConsoleInfo.args[0][0]).toBe('App is running at http://localhost:%d in %s mode');

      await app.stop();
      expect(stubedConsoleInfo.args.length).toBe(4);
      expect(stubedConsoleInfo.args[3][0]).toBe('Server stopped');

      stubedConsoleInfo.restore();
      done();
    }, 100);
  });
});
