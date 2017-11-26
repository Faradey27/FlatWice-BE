import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import UserModel from './../User.model';

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser((id: any, done: any) => UserModel.findById(id, (err, user) => done(err, user)));

/**
 * Sign in using Email and Password.
 */
passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email: string, password: string, done: any) => {
      const user = await UserModel.findOne({ email: email.toLowerCase() }).exec();

      if (!user) {
        return done(null, false, [{ msg: `Email ${email} not found.` }]);
      }

      const isMatch = await user.comparePassword(password);

      if (isMatch) {
        return done(null, user);
      }

      return done(null, false, [{ msg: 'Invalid email or password.' }]);
    },
  ),
);
