import * as supertest from 'supertest';
import app from './../../../app';
import DatabaseDriver from './../../Database/__test__/Mongo.driver';
import User from './../index';
import { IAuthUser, IUser } from './../User.d';
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
    loggedAsAdmin: async () => {
      const user: IUser = { email: '123@gmail.com', password: '12345', role: 'admin' };
      await this.given.user(user);
      const response = await this.request.post('/api/v1/login').send(user);

      return response;
    },
    userCreated: async (user: IUser, cookies: string = '') => {
      const response = await this.request.post('/api/v1/user').send(user).set('cookie', cookies);

      return response;
    },
    userDeleted: async (id: string, cookies: string = '') => {
      const response = await this.request.delete(`/api/v1/user/${id}`).send().set('cookie', cookies);

      return response;
    },
    userUpdated: async (id: string, user: IUser, cookies: string = '') => {
      const response = await this.request.put(`/api/v1/user/${id}`).send(user).set('cookie', cookies);

      return response;
    },
  };

  public get = {
    users: async (cookies: string = '') => {
      const response = await this.request.get('/api/v1/user').set('cookie', cookies);

      return response;
    },
  };

  public cleanup = (): Promise<any> => userModel.drop();
}

export default UserDriver;
