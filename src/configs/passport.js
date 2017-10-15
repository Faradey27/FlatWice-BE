import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from './../models/User';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

/* istanbul ignore next */
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    /* istanbul ignore next */
    if (err) {
      return done(err);
    }
    /* istanbul ignore next */
    if (!user) {
      return done(null, false, { msg: `Email ${email} not found.` });
    }

    return user.comparePassword(password, (error, isMatch) => {
      /* istanbul ignore next */
      if (error) {
        return done(error);
      }
      if (isMatch) {
        return done(null, user);
      }

      return done(null, false, { msg: 'Invalid email or password.' });
    });
  });
}));
