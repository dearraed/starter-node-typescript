import express from 'express';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import { login, logout, refreshToken, signup } from '../../../controllers/authController';
import authentication from '../../../auth/authentication';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Access
 *   description: The Access managing API
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                   $ref: '#/components/schemas/Login'
 *     tags: [Access]
 *     responses:
 *       200:
 *         description: Login
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   user:
 *                      $ref: '#/components/schemas/User'
 *                   tokens: 
 *                      $ref: '#/components/schemas/Tokens'
 *
 */
router.post(
  '/login',
  validator(schema.userCredential),
  login
);

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register
 *     requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                   $ref: '#/components/schemas/CreateUser'
 *     tags: [Access]
 *     responses:
 *       200:
 *         description: The list of the register
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   user:
 *                      $ref: '#/components/schemas/User'
 *                   tokens: 
 *                      $ref: '#/components/schemas/Tokens'
 *
 */

router.post(
  '/signup',
  validator(schema.signup),
  signup
);

/**
 * @swagger
 * /refresh:
 *   post:
 *     summary: Register
 *     tags: [Access]
 *     requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                   $ref: '#/components/schemas/RefreshToken'
 *     responses:
 *       200:
 *         description: The list of the register
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Tokens'
 *     security:
 *      - bearerAuth: []  
 *
 */

/*-------------------------------------------------------------------------*/
// Below all APIs are private APIs protected for Access Token
router.use('/', authentication);
/*-------------------------------------------------------------------------*/

router.post(
  '/refresh',
  validator(schema.auth, ValidationSource.HEADER),
  validator(schema.refreshToken),
  refreshToken
);

/**
 * @swagger
 * /logout:
 *   delete:
 *     summary: Logout
 *     tags: [Access]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   message: 
 *                      default: Logout success
 * 
 *     security:
 *      - bearerAuth: []  
 *
 */
router.delete(
  '/logout',
  logout
);

export default router;
