import express from 'express';
import { celebrate } from 'celebrate';
import AuthService from '../../middlewares/auth';
import userController from './users.controller';
import { schemas } from '../../helpers';
import {
  paginateUserValidateSchema,
  changePasswordSchema,
  updateMeSchema,
} from './user.validation';

const { objectIdSchema, paginateValidationSchema } = schemas;

const router = express.Router();

/**
 * @swagger
 *
 * /users:
 *   get:
 *     tags: [users]
 *     description: get all users
 *     produces:
 *       - application/json
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - $ref: '#/parameters/pageParam'
 *       - $ref: '#/parameters/limitParam'
 *     responses:
 *        200:
 *         description: OK
 *         schema:
 *           type: object
 *           properties:
 *              page:
 *                type: integer
 *                format: int32
 *              pages:
 *                type: integer
 *                format: int32
 *              limit:
 *                type: integer
 *                format: int32
 *              total:
 *                type: integer
 *                format: int32
 *              data:
 *                $ref: '#/definitions/ArrayOfUsers'
 *        401:
 *          $ref: '#/responses/Unauthorized'
 */
router.get(
  '/',
  AuthService.required,
  celebrate({ query: paginateUserValidateSchema }),
  userController.findAll
);

router.get(
  '/me',
  AuthService.required,
  userController.getMe
);

/**
 * @swagger
 *
 * /users/{id}:
 *   get:
 *     tags: [users]
 *     description: Get User by ID
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ID of user
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *      200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/User'
 *      400:
 *        $ref: '#/responses/Error'
 *      401:
 *        $ref: '#/responses/Unauthorized'
 */
router.get(
  '/:id',
  AuthService.required,
  celebrate({ params: objectIdSchema }),
  userController.findOne
);

router.post(
  '/me/change-password',
  AuthService.required,
  celebrate({ body: changePasswordSchema }),
  userController.changePassword
);

/**
 * @swagger
 *
 * /users/{id}:
 *   delete:
 *     tags: [users]
 *     description: delete a user
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: users id
 *         required: true
 *         type: string
 *     responses:
 *      200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/User'
 *      400:
 *        $ref: '#/responses/Error'
 *      401:
 *        $ref: '#/responses/Unauthorized'
 */
router.delete(
  '/:id',
  AuthService.required,
  AuthService.isAdmin(),
  celebrate({ params: objectIdSchema }),
  userController.remove
);

router.put(
  '/me',
  celebrate({ body: updateMeSchema }),
  AuthService.required,
  userController.updateMe
);

/**
 * @swagger
 *
 * /users/{id}:
 *   put:
 *     tags: [users]
 *     description: update a user
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: user id
 *         required: true
 *         type: string
 *       - name: data
 *         in: body
 *         required: true
 *         schema:
 *          $ref: '#/definitions/User'
 *     responses:
 *      200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/User'
 *      400:
 *        $ref: '#/responses/Error'
 *      401:
 *        $ref: '#/responses/Unauthorized'
 */
router.put(
  '/:id',
  AuthService.required,
  AuthService.isAdmin(),
  celebrate({ params: objectIdSchema }),
  userController.update
);

export default router;
