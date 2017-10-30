/* eslint-disable no-underscore-dangle */
import passport from 'passport';
import User from './UserModel';

/**
 * POST /login
 * Sign in using email and password.
 */
export const postLogin = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).json({ errors });
  }

  return passport.authenticate('local', (err, user, info) => {
    /* istanbul ignore next */
    if (err) {
      res.status(500).json({ message: 'internal error during authenticate' });
    }
    if (!user) {
      return res.status(400).json({ info });
    }

    return req.logIn(user, () => res.status(200).json({ user: { email: user.email, id: user._id } }));
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
export const logout = (req, res) => {
  req.logout();

  return res.status(200).json({});
};

/**
 * POST /signup
 * Create a new local account.
 */
export const postSignup = async (req, res) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(Number('4'));
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).json({ errors });
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });
  const existingUser = await User.findOne({ email: req.body.email });

  if (existingUser) {
    return res.status(400).json({ message: 'Already registered' });
  }
  await user.save();

  return req.logIn(user, () => res.status(200).json({ user: { email: user.email, id: user._id } }));
};

/**
 * GET /authenticated
 * Check auth.
 */
export const isAuthenticated = (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ status: 'OK' });
  }

  return res.status(401).json({ status: 'FAILURE' });
};
