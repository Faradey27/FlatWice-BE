import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import userModel from './../User.model';

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser((id: any, done: any) => userModel.findById(id, (err: any, user: any) => done(err, user)));

/**
 * Sign in using Email and Password.
 */
passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email: string, password: string, done: any) => {
      const user = await userModel.getUserByEmail(email);

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
