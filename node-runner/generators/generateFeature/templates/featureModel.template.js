import { Document, Model, model, Schema } from 'mongoose';

export interface I_PLACEHOLDER_ {
  deleted?: boolean;
  // TODO pls update this interface with your model
}

export interface I_PLACEHOLDER_Model extends I_PLACEHOLDER_, Document {
}

const _PLACEHOLDERLOWER_Schema: Schema = new Schema(
  {
    deleted: Boolean,
  },
  { timestamps: true },
);

const _PLACEHOLDER_: Model<I_PLACEHOLDER_Model> = model<I_PLACEHOLDER_Model>('_PLACEHOLDER_', _PLACEHOLDERLOWER_Schema);

export default _PLACEHOLDER_;
