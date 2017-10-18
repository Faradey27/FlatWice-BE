import passport from 'passport';
import * as userRoutes from './userRoutes';
const PREFIX = '/api/v1';

class User {
  constructor(app) {
    app.use(passport.initialize());
    app.use(passport.session());

    app.post(`${PREFIX}/login`, userRoutes.postLogin);
    app.get(`${PREFIX}/logout`, userRoutes.logout);
    app.post(`${PREFIX}/signup`, userRoutes.postSignup);

    app.get(`${PREFIX}/authenticated`, userRoutes.isAuthenticated);
  }
}

export default User;
