import * as supertest from 'supertest';
import app from './../../../app';
import DatabaseDriver from './../../Database/__test__/Mongo.driver';
import User, { IAuthUser, IUser } from './../index';
import userModel from './../User.model';

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
    loggedIn: async (cookies: string = '') => {
      const response = await this.request.get('/api/v1/authenticated').set('cookie', cookies);

      return response.body.status === 'OK' && response.status === 200;
    },
  };

  public given = {
    user: async (user: IUser): Promise<any> => {
      const savedUser = await userModel.addUser(user);

      return savedUser;
    },
  };

  public when = {
    signuped: async (user: IAuthUser) => {
      const response = await this.request.post('/api/v1/signup').send(user);

      return response;
    },
    logout: async (cookies: string) => {
      const response = await this.request.get('/api/v1/logout').set('cookie', cookies);

      return response;
    },
    loggedIn: async (user: IAuthUser) => {
      const response = await this.request.post('/api/v1/login').send(user);

      return response;
    },
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

  public cleanup = (): Promise<any> => userModel.drop();
}

export default UserDriver;
