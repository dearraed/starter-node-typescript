import express from 'express';
import role from '../../../helpers/role';
import authentication from '../../../auth/authentication';
import authorization from '../../../auth/authorization';
import { RoleCode } from '../../../database/model/Role';
import { deleteUser, getAllUsers } from '../../../controllers/userController';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';

const router = express.Router();

router.use('/', authentication, role(RoleCode.ADMIN), authorization);

/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [User]
 *     parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *        - in: query
 *          name: name
 *          schema:
 *            type: string
 *        - in: query
 *          name: lastname
 *          schema:
 *            type: string
 *        - in: query
 *          name: email
 *          schema:
 *            type: string
 *        - in: query
 *          name: sort
 *          schema:
 *            type: string
 *        - in: query
 *          name: deleted
 *          schema:
 *            type: string
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *        - in: query
 *          name: perPage
 *          schema:
 *            type: integer
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *     security:
 *      - bearerAuth: []
 */

router.get('/all',
   getAllUsers  
)

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by id
 *     tags: [User]
 *     parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: User deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 * 
 *     security:
 *      - bearerAuth: []
 */
router.delete('/:id',
   validator(schema.userId, ValidationSource.PARAM),
   deleteUser  
)
export default router;
