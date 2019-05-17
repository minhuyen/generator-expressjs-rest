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
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           $ref: '#/definitions/NewUser'
 *     security:
 *       - Bearer: []
 */
router.get('/', authJwt, findAll);

/**
 * @swagger
 *
 * /users/{id}:
 *   get:
 *     tags: [users]
 *     description: Get User by ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ID of user
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           $ref: '#/definitions/NewUser'
 *     security:
 *       - Bearer: []
 */
router.get('/:id', authJwt, findOne);
router.delete('/:id', authJwt, deleteUser);
router.put('/:id/avatar', authJwt, updateAvatar);

export default router;
