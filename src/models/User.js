/* eslint-disable fp/no-mutation */
import bcrypt from 'bcrypt-nodejs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  facebook: String,
  twitter: String,
  google: String,
  github: String,
  instagram: String,
  linkedin: String,
  steam: String,
  tokens: Array,

  profile: {
    name: String,
    gender: String,
    location: String,
    website: String,
    picture: String,
  },
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) { // eslint-disable-line
  const SALT = 10;

  /* istanbul ignore next */
  if (!this.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(SALT, (err, salt) => {
    /* istanbul ignore next */
    if (err) {
      return next(err);
    }

    return bcrypt.hash(this.password, salt, null, (error, hash) => {
      /* istanbul ignore next */
      if (error) {
        return next(error);
      }
      this.password = hash;

      return next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => cb(err, isMatch));
};

const User = mongoose.model('User', userSchema);

export default User;
