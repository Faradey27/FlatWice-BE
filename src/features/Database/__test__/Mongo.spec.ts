import * as mongodb from 'mongodb';
import { stub } from 'sinon';
import MongoDriver from './Mongo.driver';

describe('Mongo component', () => {
  let driver: MongoDriver = null;

  beforeEach(() => {
    driver = new MongoDriver();
  });

  it('should connect feature successfully', async () => {
    const stubedConsole = stub(console, 'error');
    const db: any = await driver.when.connected();
    expect(stubedConsole.notCalled).toBeTruthy();
    expect(db.status).toBe('OK');
    stubedConsole.restore();
  });

  it('should not connect feature successfully', async () => {
    const stubedConsole = stub(console, 'error');
    const db: any = await driver.when.connected({ withError: true });
    expect(stubedConsole.args[0][0]).toBe('This is an error');

    expect(db.status).toBe('FAILURE');

    stubedConsole.restore();
  });
});
