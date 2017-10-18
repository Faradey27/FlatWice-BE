import request from 'supertest';
import App from './../../../src/controllers/App';

const app = new App();

describe('Authentication', () => {
  const newUser = {
    email: `${Math.random() * '10000'}@test-magic-domain.com`,
    password: '12345',
    confirmPassword: '12345',
  };

  describe('SignUp', () => {
    it('should response with created user after signup', async () => {
      const response = await request(app.express).post('/api/v1/signup').send(newUser);
      const cookies = response.headers['set-cookie'];

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user: { email: newUser.email, id: response.body.user.id } });

      const authResponse = await request(app.express).
        get('/api/v1/authenticated').
        set('set-cookie', cookies).
        set('cookie', cookies).
        send(newUser);

      expect(authResponse.status).toBe(200);
    });

    it('should response with error when trying to register with same email', async () => {
      const response = await request(app.express).post('/api/v1/signup').send(newUser);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Already registered' });
    });

    it('should response with error when trying to register with bad email or password', async () => {
      const response = await request(app.express).post('/api/v1/signup').send(Object.assign({}, newUser, { password: '11' }));

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ errors: [
        {
          location: 'body',
          param: 'password',
          msg: 'Password must be at least 4 characters long',
          value: '11',
        },
        {
          location: 'body',
          param: 'confirmPassword',
          msg: 'Passwords do not match',
          value: '12345',
        },
      ] });
    });

    it('should response with 401 when user did not authenticated', async () => {
      const response = await request(app.express).get('/api/v1/authenticated').send(newUser);

      expect(response.status).toBe(401);
    });
  });

  describe('Login and logout', () => {
    it('should login successfully', async () => {
      const response = await request(app.express).
        post('/api/v1/login').
        send({ email: newUser.email, password: newUser.password });
      const cookies = response.headers['set-cookie'];

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user: { email: newUser.email, id: response.body.user.id } });

      const authResponse = await request(app.express).
        get('/api/v1/authenticated').
        set('cookie', cookies).
        send(newUser);

      expect(authResponse.status).toBe(200);
    });

    it('should logout after login successfully', async () => {
      const response = await request(app.express).
        post('/api/v1/login').
        send({ email: newUser.email, password: newUser.password });
      const cookies = response.headers['set-cookie'];

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user: { email: newUser.email, id: response.body.user.id } });

      const authResponse = await request(app.express).
        get('/api/v1/authenticated').
        set('cookie', cookies).
        send(newUser);

      expect(authResponse.status).toBe(200);
      await request(app.express).get('/api/v1/logout').set('cookie', cookies);

      const authLogoutResponse = await request(app.express).
        get('/api/v1/authenticated').
        set('cookie', cookies).
        send(newUser);

      expect(authLogoutResponse.status).toBe(401);
    });

    it('should not login with wrong password', async () => {
      const response = await request(app.express).post('/api/v1/login').send({ email: newUser.email, password: 'wrong' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ info: {
        msg: 'Invalid email or password.',
      } });
    });

    it('should show error when user not found', async () => {
      const response = await request(app.express).
        post('/api/v1/login').
        send({ email: 'newUser1232@gmail.com', password: newUser.password });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ info: {
        msg: 'Email newuser1232@gmail.com not found.',
      } });
    });

    it('should show error when email is invalid', async () => {
      const response = await request(app.express).post('/api/v1/login').send({ email: '1', password: 'wrong' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ errors: [
        {
          location: 'body',
          param: 'email',
          msg: 'Email is not valid',
          value: false,
        },
      ] });
    });

    it('should logout successfully', async () => {
      const response = await request(app.express).get('/api/v1/logout');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({});
    });

    it('should response with 401 when user did not authenticated', async () => {
      const response = await request(app.express).get('/api/v1/authenticated').send(newUser);

      expect(response.status).toBe(401);
    });
  });
});
