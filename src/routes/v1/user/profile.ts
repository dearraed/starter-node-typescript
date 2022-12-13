import express from 'express';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import role from '../../../helpers/role';
import _ from 'lodash';
import authentication from '../../../auth/authentication';
import authorization from '../../../auth/authorization';
import { getMyProfile, updateProfile } from '../../../controllers/profileController';
import { RoleCode } from '../../../database/model/Role';
import { getAllUsers } from '../../../controllers/userController';

const router = express.Router();

/*-------------------------------------------------------------------------*/
// Below all APIs are private APIs protected for Access Token
router.use('/', authentication);
/*-------------------------------------------------------------------------*/

router.get(
  '/my',
   getMyProfile
);

router.put(
  '/',
  validator(schema.profile),
  updateProfile
);

router.use('/', role(RoleCode.ADMIN), authorization);

export default router;
