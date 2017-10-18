import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from './../components/User/UserModel';

passport.serializeUser((user, done) => done(null, user.id));
/* istanbul ignore next */
passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await User.
      findOne({ email: email.toLowerCase() }).
      exec();

    if (!user) {
      return done(null, false, { msg: `Email ${email} not found.` });
    }

    const isMatch = await user.comparePassword(password);

    if (isMatch) {
      return done(null, user);
    }

    return done(null, false, { msg: 'Invalid email or password.' });
  } catch (err) {
    /* istanbul ignore next */
    return done(err);
  }
}));
