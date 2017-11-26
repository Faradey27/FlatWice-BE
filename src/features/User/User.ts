import { Application, Request, Response } from 'express';
import * as passport from 'passport';
import { IFeature } from './../../types/features.d';
import UserModel, { IUser, IUserModel } from './User.model';

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

    router.get(`${prefix}/authenticated`, this.isAuthenticated);
    router.get(`${prefix}/logout`, this.logout);
    router.post(`${prefix}/login`, this.login);
    router.post(`${prefix}/signup`, this.signup);

    router.get(`${prefix}/user`, this.getUsers);
    router.post(`${prefix}/user`, this.addUser);
    router.delete(`${prefix}/user/:id`, this.deleteUser);
    router.put(`${prefix}/user/:id`, this.updateUser);
  }

  private isAuthenticated = (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      return res.status(200).json({ status: 'OK' });
    }

    return res.status(401).json({ status: 'FAILURE' });
  }

  private signup = (req: Request, res: Response, next: any) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(Number('4'));
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
      return res.status(400).json({ errors });
    }

    const user: IUserModel = new UserModel({
      email: req.body.email,
      ...req.body,
    });

    return UserModel.findOne({ email: req.body.email }, (err: any, existingUser: any) => {
      if (existingUser) {
        return res.status(400).json({ errors: [{ msg: 'Already registered' }] });
      }

      return user.save(() => req.logIn(user, () => res.status(200).json({ user: { email: user.email, id: user._id } })));
    });
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
    const users = await UserModel.find({}).exec();

    return res.status(200).json({
      users,
      total: users.length,
    });
  }

  private addUser = async (req: Request, res: Response) => {
    const newUser = new UserModel({ deleted: false });

    const savedUser = await newUser.save();

    return res.status(200).json(savedUser);
  }

  private deleteUser = async (req: Request, res: Response) => {
    const user: IUserModel = await UserModel.findByIdAndRemove(req.params.id).exec();

    return res.status(200).json(user);
  }

  private updateUser = async (req: Request, res: Response) => {
    const user: IUserModel = await UserModel.findById(req.params.id).exec();

    Object.assign(user, req.body);

    const savedUser = await user.save();
    return res.status(200).json(savedUser);
  }
}

export default User;
