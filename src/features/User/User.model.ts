import * as bcrypt from 'bcrypt-nodejs';
import { Document, Model, model, Schema } from 'mongoose';

export interface IAuthUser {
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface IUser {
  id?: string;
  deleted?: boolean;
  email: string;
  password: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;

  facebook?: string;
  twitter?: string;
  google?: string;
  github?: string;
  instagram?: string;
  linkedin?: string;
  steam?: string;
  tokens?: any[];

  updatedAt?: string;
  createdAt?: string;

  profile?: {
    name?: string,
    gender?: string,
    location?: string,
    website?: string,
    picture?: string,
  };
}

export interface IUserModel extends IUser, Document {
  comparePassword?: (password: string) => any;
}

const userSchema: Schema = new Schema(
  {
    deleted: Boolean,
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
  },
  { timestamps: true },
);

/**
 * Password hash middleware.
 * Before saving user, we need to crypt his password
 */
userSchema.pre('save', function save(next) {
  const SALT = 10;

  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(SALT, (err, salt) => bcrypt.hash(this.password, salt, null, (error, hash) => {
    this.password = hash;
    return next();
  }));
});

/**
 * Helper method for validating user's password.
 * Because we are saving only crypted passwords, we need some methods to compare them
 */
userSchema.methods.comparePassword = function (candidatePassword: string) {
  return new Promise(
    (resolve, reject) => {
      return bcrypt.compare(candidatePassword, this.password, (err: any, isMatch: boolean) => resolve(isMatch));
    },
  );
};

const User: Model<IUserModel> = model<IUserModel>('User', userSchema);

export default User;
