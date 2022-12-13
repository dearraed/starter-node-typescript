import { SuccessResponse, SuccessMsgResponse, TokenRefreshResponse } from '../core/ApiResponse';
import { ProtectedRequest, RoleRequest } from 'app-request';
import crypto from 'crypto';
import JWT from '../core/JWT';
import User from '../database/model/User';
import { RoleCode } from '../database/model/Role';
import UserRepo from '../database/repository/UserRepo';
import { BadRequestError, AuthFailureError } from '../core/ApiError';
import KeystoreRepo from '../database/repository/KeystoreRepo';
import { validateTokenData, createTokens, getAccessToken } from '../auth/authUtils';
import asyncHandler from '../helpers/asyncHandler';
import bcryptjs from 'bcryptjs';
import { Types } from 'mongoose';
import _ from 'lodash';

export const login = asyncHandler(async (req, res) => {
    let user = await UserRepo.findByEmail(req.body.email);
    if (!user) throw new BadRequestError('User not registered');
    if (!user.password) throw new BadRequestError('Credential not set');

    const match = await bcryptjs.compare(req.body.password, user.password);
    
    if (!match) throw new AuthFailureError('Authentication failure');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);
    const { password, ...filtredUser } = user;
    new SuccessResponse('Login Success', {
      filtredUser,
      tokens: tokens,
    }).send(res);
  })

  export const logout = asyncHandler(async (req: ProtectedRequest, res) => {
    await KeystoreRepo.remove(req.keystore._id);
    new SuccessMsgResponse('Logout success').send(res);
  })

  export const signup = asyncHandler(async (req: RoleRequest, res) => {
    let user = await UserRepo.findByEmail(req.body.email);
    if (user) throw new BadRequestError('User already registered');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');
    
    const { user: createdUser, keystore } = await UserRepo.create(
      { ...req.body } as User,
      accessTokenKey,
      refreshTokenKey,
      RoleCode.USER,
    );

    const tokens = await createTokens(createdUser, keystore.primaryKey, keystore.secondaryKey);
    new SuccessResponse('Signup Successful', {
      user: _.pick(createdUser, ['_id', 'name', 'email', 'roles', 'profilePicUrl']),
      tokens: tokens,
    }).send(res);
  })

  export const refreshToken = asyncHandler(async (req: ProtectedRequest, res) => {
    req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

    const accessTokenPayload = await JWT.decode(req.accessToken);
    validateTokenData(accessTokenPayload);

    const user = await UserRepo.findById(new Types.ObjectId(accessTokenPayload.sub));
    if (!user) throw new AuthFailureError('User not registered');
    req.user = user;

    const refreshTokenPayload = await JWT.validate(req.body.refreshToken);
    validateTokenData(refreshTokenPayload);

    if (accessTokenPayload.sub !== refreshTokenPayload.sub)
      throw new AuthFailureError('Invalid access token');

    const keystore = await KeystoreRepo.find(
      req.user._id,
      accessTokenPayload.prm,
      refreshTokenPayload.prm,
    );

    if (!keystore) throw new AuthFailureError('Invalid access token');
    await KeystoreRepo.remove(keystore._id);

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    await KeystoreRepo.create(req.user._id, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(req.user, accessTokenKey, refreshTokenKey);

    new TokenRefreshResponse('Token Issued', tokens.accessToken, tokens.refreshToken).send(res);
  });
