import Joi from '@hapi/joi';
import { JoiAuthBearer } from '../../../helpers/validator';

  /**
 * @swagger
 * components:
 *   securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - email 
 *         - password 
 *       properties:
 *         email:
 *           type: string
 *           description: Email address
 *         password:
 *           type: string
 *           description: Minimum of 8 characters long
 *     RefreshToken:
 *       type: object
 *       required:
 *         - refreshToken 
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: refresh token
 *     Tokens:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: access token
 *         refreshToken:
 *           type: string
 *           description: refreshToken
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The username
 *         lastname:
 *           type: string
 *           description: The last name
 *         email:
 *           type: string
 *           description: Email address
 *         profilePicUrl:
 *           type: string
 *           description: piture profile
 *         verified:
 *           type: string
 *           description: verification of account
 *         status:
 *           type: string
 *           description: user status active or not
 *     CreateUser:
 *       type: object
 *       required:
 *         - name
 *         - lastname 
 *         - email 
 *       properties:
 *         name:
 *           type: string
 *           description: The username
 *         lastname:
 *           type: string
 *           description: The last name
 *         email:
 *           type: string
 *           description: Email address
 *         password:
 *           type: string
 *           description: Minimum of 8 characters long
 *         profilePicUrl:
 *           type: string
 *           description: user picture profile
 */

export default {
  userCredential: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
  refreshToken: Joi.object().keys({
    refreshToken: Joi.string().required().min(1),
  }),
  auth: Joi.object()
    .keys({
      authorization: JoiAuthBearer().required(),
    })
    .unknown(true),
  signup: Joi.object().keys({
    name: Joi.string().required().min(1),
    lastname: Joi.string().required().min(1),
    email: Joi.string().required().email(),
    password: Joi.string().required().regex(/^[a-zA-Z0-9]{8,30}$/),
    profilePicUrl: Joi.string().optional().uri(),
  }),
};
