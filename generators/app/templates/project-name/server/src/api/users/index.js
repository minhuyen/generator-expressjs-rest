import express from 'express';
import { authJwt } from '../../services/passport';
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
router.get('/', authJwt, findAll);

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
router.get('/:id', authJwt, findOne);
router.delete('/:id', authJwt, deleteUser);
router.put('/:id/avatar', authJwt, updateAvatar);

export default router;
