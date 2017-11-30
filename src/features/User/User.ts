import { Application, Request, Response } from 'express';
import * as passport from 'passport';

import userModel from './User.model';

import { IFeature } from './../../types/features.d';
import { IUser, IUserModel, Roles } from './User.d';

import './config/passport';

class User implements IFeature {
  private static PREFIX = '/api/v1';
  private app: Application;

  constructor(app: Application) {
    this.app = app;
    app.use(passport.initialize());
    app.use(passport.session());
  }

  public featureName: string = 'user';

  public connect = () => {
    this.setupRouting(this.app);
    return Promise.resolve({ status: 'OK' });
  }

  private setupRouting(router: Application) {
    const prefix = User.PREFIX;

    router.get(`${prefix}/authenticated`, this.authenticated);
    router.get(`${prefix}/logout`, this.logout);
    router.post(`${prefix}/login`, this.login);
    router.post(`${prefix}/signup`, this.signup);

    router.get(`${prefix}/user`, this.getUsers);
    router.post(`${prefix}/user`, this.addUser);
    router.delete(`${prefix}/user/:id`, this.deleteUser);
    router.put(`${prefix}/user/:id`, this.updateUser);
  }

  private isAllowed = (permissions: Roles[], user: IUser) => {
    return Boolean(user && permissions.indexOf(user.role) !== -1);
  }

  private isAuthenticated = (req: Request) => req.isAuthenticated();

  private authenticated = (req: Request, res: Response) => {
    if (this.isAuthenticated(req)) {
      return res.status(200).json({ status: 'OK' });
    }

    return res.status(401).json({ status: 'FAILURE' });
  }

  private signup = async (req: Request, res: Response, next: any) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len({ min: 4 });
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
      return res.status(400).json({ errors });
    }

    const existingUser = await userModel.getUserByEmail(req.body.email);
    if (existingUser) {
      return res.status(400).json({ errors: [{ msg: 'Already registered' }] });
    }

    const savedUser: IUserModel = await userModel.addUser(req.body);
    return req.logIn(savedUser, () => res.status(200).json({ user: { email: savedUser.email, id: savedUser.id } }));
  }

  private logout = (req: Request, res: Response) => {
    req.logout();

    return res.status(200).json({});
  }

  private login = (req: Request, res: Response, next: any) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
      return res.status(400).json({ errors });
    }

    return passport.authenticate('local', (err: any, user: IUser, result: any) => {
      if (!user) {
        return res.status(400).json({ errors: result });
      }

      return req.logIn(user, () => res.status(200).json({ user: {
        email: user.email,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
        profile: user.profile,
        id: user.id,
      } }));
    })(req, res, next);
  }

  private getUsers = async (req: Request, res: Response) => {
    const permissions: Roles[] = ['admin'];
    if (!this.isAuthenticated(req)) {
      return res.status(401).json({});
    }
    if (!this.isAllowed(permissions, req.user)) {
      return res.status(403).json({});
    }
    return res.status(200).json(await userModel.getUsers());
  }

  private addUser = async (req: Request, res: Response) => {
    const permissions: Roles[] = ['admin'];
    if (!this.isAuthenticated(req)) {
      return res.status(401).json({});
    }
    if (!this.isAllowed(permissions, req.user)) {
      return res.status(403).json({});
    }
    return res.status(200).json(await userModel.addUser(req.body));
  }

  private deleteUser = async (req: Request, res: Response) => {
    const permissions: Roles[] = ['admin'];
    if (!this.isAuthenticated(req)) {
      return res.status(401).json({});
    }
    if (!this.isAllowed(permissions, req.user)) {
      return res.status(403).json({});
    }
    return res.status(200).json(await userModel.deleteUser(req.params.id));
  }

  private updateUser = async (req: Request, res: Response) => {
    const permissions: Roles[] = ['admin'];
    if (!this.isAuthenticated(req)) {
      return res.status(401).json({});
    }
    if (!this.isAllowed(permissions, req.user)) {
      return res.status(403).json({});
    }
    return res.status(200).json(await userModel.updateUser(req.params.id, req.body));
  }
}

export default User;
