import * as passport from 'passport';
import { IAuthUser, IUser } from './../index';
import UserDriver from './User.driver';

describe('User', () => {
  let driver: UserDriver = null;

  beforeEach(async () => {
    driver = new UserDriver();

    await driver.cleanup();
  });

  afterEach(() => driver.cleanup());

  describe('Login', () => {
    it('should not login user with wrong email and response with error', async () => {
      const user: IAuthUser = {
        email: 'someemail',
        password: '12345',
      };
      const response = await driver.when.loggedIn(user);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ errors: [
        {
          location: 'body',
          msg: 'Email is not valid',
          param: 'email',
          value: false,
        },
      ]});
    });

    it('should not login user with blank password', async () => {
      const user: IAuthUser = {
        email: 'someemail@gmail.com',
        password: '',
      };
      const response = await driver.when.loggedIn(user);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ errors: [
        {
          location: 'body',
          msg: 'Password cannot be blank',
          param: 'password',
          value: '',
        },
      ]});
    });

    it('should not login user who is not registered', async () => {
      const user: IAuthUser = {
        email: 'someemail@gmail.com',
        password: '12345',
      };
      const response = await driver.when.loggedIn(user);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ errors: [
        {
          msg: 'Email someemail@gmail.com not found.',
        },
      ]});
    });

    it('should login with correct email and password', async () => {
      const user: IAuthUser = {
        email: 'someemail@gmail.com',
        password: '12345',
      };

      const userMock: IUser = {
        email: 'someemail@gmail.com',
        password: '12345',
      };

      await driver.given.user(userMock);

      const response = await driver.when.loggedIn(user);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        user: {
          email: user.email,
          id: response.body.user.id,
          updatedAt: response.body.user.updatedAt,
          createdAt: response.body.user.createdAt,
          profile: {},
        },
      });
    });

    it('should not login with wrong password', async () => {
      const user: IAuthUser = {
        email: 'someemail@gmail.com',
        password: '12345',
      };

      const userMock: IUser = {
        email: 'someemail@gmail.com',
        password: '123456',
      };

      await driver.given.user(userMock);

      const response = await driver.when.loggedIn(user);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errors: [{ msg: 'Invalid email or password.' }],
      });
    });

    it('should deserializeUser user', async (done) => {
      const user: IAuthUser = {
        email: 'someemail@gmail.com',
        password: '12345',
      };

      const userMock: IUser = {
        email: 'someemail@gmail.com',
        password: '12345',
      };

      await driver.given.user(userMock);

      const response = await driver.when.loggedIn(user);

      const id = response.body.user.id;

      (passport as any).deserializeUser(id, (err: any, desUser: any) => {
        expect(desUser.email).toBe(userMock.email);
        done();
      });
    });

    it('should return FAILURE with 401 status for authenticated request', async () => {
      const isLoggedIn = await driver.is.loggedIn();

      expect(isLoggedIn).toBeFalsy();
    });

    it('should return OK with 200 status for authenticated request when user authenticated', async () => {
      const user: IAuthUser = {
        email: 'someemail@gmail.com',
        password: '12345',
      };
      const userMock: IUser = {
        email: 'someemail@gmail.com',
        password: '12345',
      };

      await driver.given.user(userMock);

      const response: any = await driver.when.loggedIn(user);
      const cookies = response.headers['set-cookie'];

      const isLoggedIn = await driver.is.loggedIn(cookies);

      expect(isLoggedIn).toBeTruthy();
    });

    it('should return OK with 200 status for authenticated request when user authenticated and then logout', async () => {
      const user: IAuthUser = {
        email: 'someemail@gmail.com',
        password: '12345',
      };
      const userMock: IUser = {
        email: 'someemail@gmail.com',
        password: '12345',
      };

      await driver.given.user(userMock);

      const response: any = await driver.when.loggedIn(user);
      const cookies = response.headers['set-cookie'];

      const isLoggedIn = await driver.is.loggedIn(cookies);

      expect(isLoggedIn).toBeTruthy();

      await driver.when.logout(cookies);

      const isLoggedIn2 = await driver.is.loggedIn(cookies);

      expect(isLoggedIn2).toBeFalsy();
    });
  });

  describe('User', () => {
    it('should return list of User', async () => {
      const usersResponse = await driver.get.users();

      expect(usersResponse.status).toBe(200);
      expect(usersResponse.body).toEqual({
        users: [],
        total: 0,
      });
    });

    it('should create User', async () => {
      const createdUserResponse = await driver.when.userCreated({ email: '1234@gmail.com', password: '12345' });
      expect(createdUserResponse.status).toBe(200);
      expect(createdUserResponse.body._id).toBeTruthy();
      expect(createdUserResponse.body.updatedAt).toBeTruthy();
      expect(createdUserResponse.body.createdAt).toBeTruthy();

      const usersResponse = await driver.get.users();

      expect(usersResponse.status).toBe(200);
      expect(usersResponse.body.total).toBe(1);
      expect(usersResponse.body.users.length).toBe(1);
      expect(usersResponse.body.users[0]._id).toBeTruthy();
    });

    it('should delete User', async () => {
      const userResponse = await driver.when.userCreated({ email: '1234@gmail.com', password: '12345' });
      const usersResponse = await driver.get.users();
      expect(usersResponse.body.total).toBe(1);

      const deletedResponse = await driver.when.userDeleted(userResponse.body._id);
      expect(deletedResponse.status).toBe(200);
      expect(deletedResponse.body._id).toBe(userResponse.body._id);

      const usersResponse2 = await driver.get.users();
      expect(usersResponse2.body.total).toBe(0);
    });

    it('should update User', async () => {
      const userResponse = await driver.when.userCreated({ email: '1234@gmail.com', password: '12345' });

      const usersResponse = await driver.get.users();
      expect(usersResponse.body.users[0].deleted).toBeFalsy();

      const updatedResponse = await driver.when
        .userUpdated(userResponse.body._id, { deleted: true, email: '1234@gmail.com', password: '12345' });
      expect(updatedResponse.status).toBe(200);
      expect(updatedResponse.body._id).toBe(userResponse.body._id);
      expect(updatedResponse.body.deleted).toBeTruthy();

      const usersResponse2 = await driver.get.users();
      expect(usersResponse2.body.users[0].deleted).toBeTruthy();
    });
  });
});
