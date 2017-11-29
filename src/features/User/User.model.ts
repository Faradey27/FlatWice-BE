import * as bcrypt from 'bcrypt-nodejs';
import { Model, model, Schema } from 'mongoose';
import { IUser, IUserModel } from './User.d';

class UserModel {
  public static schema: Schema = new Schema(
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

  private UserModel: Model<IUserModel>;

  constructor() {
    this.cryptPasswordBeforeSave();
    this.addComparePasswordsMethod();

    this.UserModel = model<IUserModel>('User', UserModel.schema);
  }

  public addUser = async (body: IUser): Promise<IUserModel> => {
    const newUser = new this.UserModel({ deleted: false, ...body, role: 'user' });

    const savedUser = await newUser.save();

    return savedUser;
  }

  public deleteUser = (id: string): Promise<IUserModel> => this.UserModel.findByIdAndRemove(id).exec();

  public updateUser = async (id: string, body: IUser): Promise<IUserModel> => {
    const user: IUserModel = await this.UserModel.findById(id).exec();

    Object.assign(user, body);

    const savedUser = await user.save();

    return savedUser;
  }

  public getUsers = async () => {
    const users = await this.UserModel.find({}).exec();
    const total = await this.UserModel.count({}).exec();

    return {
      users,
      total,
    };
  }

  public getUserByEmail = (email: string): Promise<IUserModel> => this.UserModel.findOne({ email: email.toLowerCase() }).exec();
  public findById = (id: string, done: any) => this.UserModel.findById(id, done);

  public drop = () => this.UserModel.remove({}).exec();

  private cryptPasswordBeforeSave = () => {
    UserModel.schema.pre('save', function save(next) {
      const SALT = 10;

      bcrypt.genSalt(SALT, (err, salt) => bcrypt.hash(this.password, salt, null, (error, hash) => {
        this.password = hash;
        return next();
      }));
    });
  }

  private addComparePasswordsMethod = () => {
    UserModel.schema.methods.comparePassword = function (candidatePassword: string) {
      return new Promise(
        (resolve, reject) => {
          return bcrypt.compare(candidatePassword, this.password, (err: any, isMatch: boolean) => resolve(isMatch));
        },
      );
    };
  }
}

const userModel: UserModel = new UserModel();

export default userModel;
