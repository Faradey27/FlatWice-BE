import * as passport from 'passport';
import { IAuthUser, IUser } from './../User.d';
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

  describe('Sing up', () => {
    it('should not register user with wrong email and response with error', async () => {
      const user: IAuthUser = {
        email: 'someemail',
        password: '12345',
        confirmPassword: '12345',
      };
      const response = await driver.when.signuped(user);

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

    it('should not register user with blank password', async () => {
      const user: IAuthUser = {
        email: 'someemail@gmail.com',
        password: '',
      };
      const response = await driver.when.signuped(user);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ errors: [
        {
          location: 'body',
          msg: 'Password must be at least 4 characters long',
          param: 'password',
          value: '',
        },
      ]});
    });

    it('should not register user when confirmPassword did not match', async () => {
      const user: IAuthUser = {
        email: 'someemail@gmail.com',
        password: '12345',
        confirmPassword: '123456',
      };
      const response = await driver.when.signuped(user);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ errors: [
        {
          location: 'body',
          msg: 'Passwords do not match',
          param: 'confirmPassword',
          value: '123456',
        },
      ]});
    });

    it('should not register user who is already registered', async () => {
      const user: IAuthUser = {
        email: 'someemail@gmail.com',
        password: '12345',
        confirmPassword: '12345',
      };
      await driver.when.signuped(user);
      const response = await driver.when.signuped(user);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ errors: [
        {
          msg: 'Already registered',
        },
      ]});
    });

    it('should register user and user should be signuped', async () => {
      const user: IAuthUser = {
        email: 'someemail@gmail.com',
        password: '12345',
        confirmPassword: '12345',
      };
      const response: any = await driver.when.signuped(user);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({user: {
        email: 'someemail@gmail.com',
        id: response.body.user.id,
      }});

      const cookies = response.headers['set-cookie'];

      const isLoggedIn = await driver.is.loggedIn(cookies);

      expect(isLoggedIn).toBeTruthy();

      await driver.when.logout(cookies);

      const isLoggedIn2 = await driver.is.loggedIn(cookies);

      expect(isLoggedIn2).toBeFalsy();
    });
  });

  describe('User', () => {
    it('should not create user if not authenticated', async () => {
      const createdUserResponse = await driver.when.userCreated({ email: '1234@gmail.com', password: '12345' });
      expect(createdUserResponse.status).toBe(401);
    });

    it('should not return list of users if not authenticated', async () => {
      const usersResponse = await driver.get.users();
      expect(usersResponse.status).toBe(401);
    });

    it('should not delete user if not authenticated', async () => {
      const deletedResponse = await driver.when.userDeleted('123');
      expect(deletedResponse.status).toBe(401);
    });

    it('should not update user if not authenticated', async () => {
      const updatedResponse = await driver.when.userUpdated('123', { email: '1234@gmail.com', password: '12345' });
      expect(updatedResponse.status).toBe(401);
    });

    it('should not create user if no permissions', async () => {
      const loginResponse: any = await driver.when.loggedAsUser();
      const cookies = loginResponse.headers['set-cookie'];
      const createdUserResponse = await driver.when.userCreated({ email: '1234@gmail.com', password: '12345' }, cookies);
      expect(createdUserResponse.status).toBe(403);
    });

    it('should not return list of users if no permissions', async () => {
      const loginResponse: any = await driver.when.loggedAsUser();
      const cookies = loginResponse.headers['set-cookie'];
      const usersResponse = await driver.get.users(cookies);
      expect(usersResponse.status).toBe(403);
    });

    it('should not delete user if no permissions', async () => {
      const loginResponse: any = await driver.when.loggedAsUser();
      const cookies = loginResponse.headers['set-cookie'];
      const deletedResponse = await driver.when.userDeleted('123', cookies);
      expect(deletedResponse.status).toBe(403);
    });

    it('should not update user if no permissions', async () => {
      const loginResponse: any = await driver.when.loggedAsUser();
      const cookies = loginResponse.headers['set-cookie'];
      const updatedResponse = await driver.when.userUpdated('123', { email: '1234@gmail.com', password: '12345' }, cookies);
      expect(updatedResponse.status).toBe(403);
    });

    it('should return list of User', async () => {
      const loginResponse: any = await driver.when.loggedAsAdmin();
      const cookies = loginResponse.headers['set-cookie'];
      const usersResponse = await driver.get.users(cookies);

      expect(usersResponse.status).toBe(200);
      expect(usersResponse.body).toEqual({
        users: [
          {
            ...usersResponse.body.users[0],
          },
        ],
        total: 1,
      });
    });

    it('should create User', async () => {
      const loginResponse: any = await driver.when.loggedAsAdmin();
      const cookies = loginResponse.headers['set-cookie'];
      const createdUserResponse = await driver.when.userCreated({ email: '1234@gmail.com', password: '12345' }, cookies);
      expect(createdUserResponse.status).toBe(200);
      expect(createdUserResponse.body._id).toBeTruthy();
      expect(createdUserResponse.body.updatedAt).toBeTruthy();
      expect(createdUserResponse.body.createdAt).toBeTruthy();

      const usersResponse = await driver.get.users(cookies);

      expect(usersResponse.status).toBe(200);
      expect(usersResponse.body.total).toBe(2);
      expect(usersResponse.body.users.length).toBe(2);
      expect(usersResponse.body.users[1]._id).toBeTruthy();
      expect(usersResponse.body.users[1].email).toBe('1234@gmail.com');
    });

    it('should delete User', async () => {
      const loginResponse: any = await driver.when.loggedAsAdmin();
      const cookies = loginResponse.headers['set-cookie'];

      const userResponse = await driver.when.userCreated({ email: '1234@gmail.com', password: '12345' }, cookies);
      const usersResponse = await driver.get.users(cookies);
      expect(usersResponse.body.total).toBe(2);

      const deletedResponse = await driver.when.userDeleted(userResponse.body._id, cookies);
      expect(deletedResponse.status).toBe(200);
      expect(deletedResponse.body._id).toBe(userResponse.body._id);

      const usersResponse2 = await driver.get.users(cookies);
      expect(usersResponse2.body.total).toBe(1);
    });

    it('should update User', async () => {
      const loginResponse: any = await driver.when.loggedAsAdmin();
      const cookies = loginResponse.headers['set-cookie'];
      const userResponse = await driver.when.userCreated({ email: '1234@gmail.com', password: '12345' }, cookies);

      const usersResponse = await driver.get.users(cookies);
      expect(usersResponse.body.users[1].deleted).toBeFalsy();

      const updatedResponse = await driver.when
        .userUpdated(userResponse.body._id, { deleted: true, email: '1234@gmail.com', password: '12345' }, cookies);
      expect(updatedResponse.status).toBe(200);
      expect(updatedResponse.body._id).toBe(userResponse.body._id);
      expect(updatedResponse.body.deleted).toBeTruthy();

      const usersResponse2 = await driver.get.users(cookies);
      expect(usersResponse2.body.users[1].deleted).toBeTruthy();
    });
  });
});
