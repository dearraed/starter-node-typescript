import User, { UserModel } from '../model/User';
import Role, { RoleModel } from '../model/Role';
import { InternalError } from '../../core/ApiError';
import { TrigonometryExpressionOperator, Types } from 'mongoose';
import KeystoreRepo from './KeystoreRepo';
import Keystore from '../model/Keystore';
import { PaginationModel } from 'mongoose-paginate-ts';
import APIFeatures from '../../helpers/apiFeatures';
import { ApiOptions } from "app-request";
import uuid4 from "uuid4";



type pagingObj = {
  limit: number,
  page: number
}
export default class UserRepo {
  // contains critical information of the user
  public static findById(id: Types.ObjectId): Promise<User | null> {
    return UserModel.findOne({ _id: id, status: true })
      .select('+email +password +roles')
      .populate({
        path: 'roles',
        match: { status: true },
      })
      .lean<User>()
      .exec();
  }

  public static findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email: email, status: true })
      .select('+email +password +roles -verified -status')
      .populate({
        path: 'roles',
        match: { status: true },
        select: { code: 1 },
      })
      .lean<User>()
      .exec();
  }

  public static findProfileById(id: Types.ObjectId): Promise<User | null> {
    return UserModel.findOne({ _id: id, status: true })
      .select('+name +lastname +roles +email')
      .populate({
        path: 'roles',
        match: { status: true },
        select: { code: 1 },
      })
      .lean<User>()
      .exec();
  }

  public static findByObj(obj: object): Promise<User | null> {
    return UserModel.findOne(obj)
      .select('+roles +email')
      .populate({
        path: 'roles',
        match: { status: true },
        select: { code: 1 },
      })
      .lean<User>()
      .exec();
  }

  public static async findAll(paging: pagingObj, query: object, apiOptions: ApiOptions): Promise<PaginationModel<User>> {
    let findAllQuery = apiOptions.deleted 
             ? UserModel.find({ deletedAt: { $ne: null} }) 
             : UserModel.find({ deletedAt: null });
          
     const features = new APIFeatures(
        findAllQuery,
        query
      )
        .filter()
        .sort()
        .limitFields()
        .search(["name", "email"]);

      const options = {
        query: features.query,
        limit: paging.limit ? paging.limit : null,
        page: paging.page ? paging.page : null,
      };
                    
    return await UserModel.paginate(options) as PaginationModel<User>; 
    
  }

  public static async create(
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string,
    roleCode: string,
  ): Promise<{ user: User; keystore: Keystore }> {
    const now = new Date();

    const role = await RoleModel.findOne({ code: roleCode })
      .select('+email +password')
      .lean<Role>()
      .exec();
    if (!role) throw new InternalError('Role must be defined');

    user.roles = [role._id];
    user.createdAt = user.updatedAt = now;
    const createdUser = await UserModel.create(user);
    const keystore = await KeystoreRepo.create(createdUser._id, accessTokenKey, refreshTokenKey);
    return { user: createdUser.toObject(), keystore: keystore };
  }

  public static async update(
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string,
  ): Promise<{ user: User; keystore: Keystore }> {
    user.updatedAt = new Date();
    await UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
      .lean()
      .exec();
    const keystore = await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey);
    return { user: user, keystore: keystore };
  }

  public static updateInfo(user: User): Promise<any> {
    user.updatedAt = new Date();
    return UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
      .lean()
      .exec();
  }

  public static async deleteUser(user: User): Promise<any> {
    user.updatedAt = new Date();
    let email = user.email as string;
    let regex = '^old[0-9]+' + email;
    const deletedUsers = await UserModel.count({ email: { $regex: regex  }  });  
    return UserModel.findByIdAndUpdate( user._id, { $set: { email: `old${deletedUsers}${email}`, deletedAt: Date.now() } }, { new: true })
      .exec();
  }
}
