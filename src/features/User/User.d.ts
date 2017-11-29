import { Document } from 'mongoose';

export interface IAuthUser {
  email: string;
  password: string;
  confirmPassword?: string;
}

export type Roles = 'admin' | 'user';

export interface IUser {
  id?: string;
  deleted?: boolean;
  email: string;
  password: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;

  role?: Roles;

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
