import express from 'express';
import AuthService from '../../middlewares/auth';
import UserController from './users.controller';

const userController = new UserController(User, 'User');

const router = express.Router();

/**
 * @swagger
 *
 * /users:
 *   get:
 *     tags: [users]
 *     description: List users
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/User'
 */
router.get('/', AuthService.required, userController.findAll);

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
router.get('/:id', AuthService.required, userController.findOne);
router.delete('/:id', AuthService.required, userController.remove);
router.put('/:id', AuthService.required, userController.update);
router.put('/:id/avatar', AuthService.required, userController.updateAvatar);

export default router;
