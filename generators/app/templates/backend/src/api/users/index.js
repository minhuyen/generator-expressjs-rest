import express from 'express';
import AuthService from '../../middlewares/auth';
import { findAll, findOne, deleteUser, updateAvatar } from './users.controller';

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
router.get('/', AuthService.required, findAll);

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
router.get('/:id', AuthService.required, findOne);
router.delete('/:id', AuthService.required, deleteUser);
router.put('/:id/avatar', AuthService.required, updateAvatar);

export default router;
