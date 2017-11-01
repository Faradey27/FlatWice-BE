import passport from 'passport';
import * as userRoutes from './userRoutes';
import ROLES from './../../configs/roles';
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

  isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    return res.status(401).json({});
  }

  isAuthorized(roles, req, res, next) {
    const user = (req.user && req.user.toObject()) || {};
    const isAllowedForEveryone = roles.indexOf(ROLES.any) !== -1;
    const isAllowedForCurrentUser = roles.indexOf(user.role) !== -1;

    if (isAllowedForEveryone || isAllowedForCurrentUser) {
      return next();
    }

    return res.status(403).json({});
  }
}

export default User;
