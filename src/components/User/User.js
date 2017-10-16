import passport from 'passport';
import * as userRoutes from './userRoutes';

class User {
  constructor(app) {
    app.use(passport.initialize());
    app.use(passport.session());

    app.post('/login', userRoutes.postLogin);
    app.get('/logout', userRoutes.logout);
    app.post('/signup', userRoutes.postSignup);
  }
}

export default User;
