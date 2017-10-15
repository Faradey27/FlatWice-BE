import passport from 'passport';

class Auth {
  constructor(app) {
    app.use(passport.initialize());
    app.use(passport.session());
  }
}

export default Auth;
