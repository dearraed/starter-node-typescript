import { model, Schema, Document } from 'mongoose';
import Role from './Role';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';
import bcrypt from 'bcryptjs';


export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export default interface User extends Document {
  name: string;
  lastName: string,
  email?: string;
  password: string;
  profilePicUrl?: string;
  roles: Role[];
  verified?: boolean;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    name: Schema.Types.String,
    lastame: Schema.Types.String,
    email: {
      type: Schema.Types.String,
      unique: true,
      trim: true,
    },
    password: {
      type: Schema.Types.String,
      select: false,
    },
    profilePicUrl: {
      type: Schema.Types.String,
      trim: true,
    },
    roles: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Role',
        },
      ],
      select: false,
    },
    verified: {
      type: Schema.Types.Boolean,
      default: false,
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      required: true,
      select: false,
    },
    updatedAt: {
      type: Date,
      required: true,
      select: false,
    },
    deletedAt: {
      type: Date,
      select: true,
    },
  },
  {
    versionKey: false,
  },
);

schema.plugin(mongoosePagination);
schema.pre("save", async function (this: User, next) {
  if(this.isModified("email"))
      this.email = this.email?.toLocaleLowerCase();

  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

schema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export const UserModel = model<User, Pagination<User>>(DOCUMENT_NAME, schema, COLLECTION_NAME);
