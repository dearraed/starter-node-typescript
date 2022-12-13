import asyncHandler from "../helpers/asyncHandler";
import { ProtectedRequest } from "app-request";
import UserRepo from "../database/repository/UserRepo";
import KeystoreRepo from "../database/repository/KeystoreRepo";
import { SuccessResponse } from "../core/ApiResponse";
import { BadRequestError } from '../core/ApiError';
import { Types } from 'mongoose';



export const getAllUsers = asyncHandler(async (req: ProtectedRequest, res) => {
    const { page, perPage, deleted } = req.query;
    const options = {
      page: parseInt(page as string, 10) || 1,
      limit: parseInt(perPage as string, 10) || 10,
    };
   
    const users = await UserRepo.findAll(options, req.query, {
        isPaging: true,
        deleted: deleted == 'true' ? true : false
    });
   
    const { docs, ...meta } = users; 
    new SuccessResponse('All users returned successfuly', {
        docs,
        meta
      }).send(res);

});

export const deleteUser = asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findByObj({ _id: new Types.ObjectId(req.params.id), status: true, deletedAt: null});
    if (!user) throw new BadRequestError('User not registered or deleted');

    await KeystoreRepo.remove(user._id);
    let deletedUser = await UserRepo.deleteUser(user);
    return new SuccessResponse(
      'User Deleted',
      deletedUser,
    ).send(res);
  });