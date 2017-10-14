import * as supertest from 'supertest';
import app from './../../../app';
import DatabaseDriver from './../../Database/__test__/Mongo.driver';
import User, { IUser } from './../index';
import UserModel from './../User.model';

class UserDriver {
  private request: supertest.SuperTest<supertest.Test>;
  private database: DatabaseDriver;

  constructor() {
    this.database  = new DatabaseDriver();
    this.database.when.connected();

    app.addFeature(User);
    this.request = supertest(app.getExpress());
  }

  public is = {

  };

  public when = {
    userCreated: async (user: IUser) => {
      const response = await this.request.post('/api/v1/user').send(user);

      return response;
    },
    userDeleted: async (id: string) => {
      const response = await this.request.delete(`/api/v1/user/${id}`).send();

      return response;
    },
    userUpdated: async (id: string, user: IUser) => {
      const response = await this.request.put(`/api/v1/user/${id}`).send(user);

      return response;
    },
  };

  public get = {
    users: async () => {
      const response = await this.request.get('/api/v1/user');

      return response;
    },
  };

  public cleanup = (): Promise<any> => UserModel.remove({}).exec();
}

export default UserDriver;
