import * as supertest from 'supertest';
import app from './../../../app';
import DatabaseDriver from './../../Database/__test__/Mongo.driver';
import _PLACEHOLDER_, { I_PLACEHOLDER_ } from './../index';
import _PLACEHOLDER_Model from './../_PLACEHOLDER_.model';

class _PLACEHOLDER_Driver {
  private request: supertest.SuperTest<supertest.Test>;
  private database: DatabaseDriver;

  constructor() {
    this.database  = new DatabaseDriver();
    this.database.when.connected();

    app.addFeature(_PLACEHOLDER_);
    this.request = supertest(app.getExpress());
  }

  public is = {

  };

  public when = {
    _PLACEHOLDERLOWER_Created: async (_PLACEHOLDERLOWER_: I_PLACEHOLDER_) => {
      const response = await this.request.post('/api/v1/_PLACEHOLDERLOWER_').send(_PLACEHOLDERLOWER_);

      return response;
    },
    _PLACEHOLDERLOWER_Deleted: async (id: string) => {
      const response = await this.request.delete(`/api/v1/_PLACEHOLDERLOWER_/${id}`).send();

      return response;
    },
    _PLACEHOLDERLOWER_Updated: async (id: string, _PLACEHOLDERLOWER_: I_PLACEHOLDER_) => {
      const response = await this.request.put(`/api/v1/_PLACEHOLDERLOWER_/${id}`).send(_PLACEHOLDERLOWER_);

      return response;
    },
  };

  public get = {
    _PLACEHOLDERLOWER_s: async () => {
      const response = await this.request.get('/api/v1/_PLACEHOLDERLOWER_');

      return response;
    },
  };

  public cleanup = (): Promise<any> => _PLACEHOLDER_Model.remove({}).exec();
}

export default _PLACEHOLDER_Driver;
