import { Document, Model, model, Schema } from 'mongoose';

export interface IUser {
  deleted?: boolean;
  // TODO pls update this interface with your model
}

export interface IUserModel extends IUser, Document {
}

const userSchema: Schema = new Schema(
  {
    deleted: Boolean,
  },
  { timestamps: true },
);

const User: Model<IUserModel> = model<IUserModel>('User', userSchema);

export default User;
