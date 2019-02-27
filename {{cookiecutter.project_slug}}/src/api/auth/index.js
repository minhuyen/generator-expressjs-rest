import express from 'express';
import { signup, login } from './controller';
import { signupValidation } from './validation';
import {
  authFacbookToken,
  authLocal,
  authGoogleToken
} from '../../services/passport';

const router = express.Router();

/**
 * @swagger
 *
 * definitions:
 *   NewUser:
 *     type: object
 *     required:
 *       - username
 *       - password
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *   User:
 *     allOf:
 *       - $ref: '#/definitions/NewUser'
 *       - required:
 *         - id
 *       - properties:
 *         id:
 *           type: integer
 *           format: int64
 */

/**
 * @swagger
 *
 * /auth/signup:
 *   post:
 *     tags: [auth]
 *     description: Creates a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         description: User object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/NewUser'
 *     responses:
 *       200:
 *         description: users
 *         schema:
 *           $ref: '#/definitions/User'
 */
router.post('/signup', signupValidation, signup);

/**
 * @swagger
 *
 * /auth/login:
 *   post:
 *     tags: [auth]
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         description: login infor
 *         required: true
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: login
 */
router.post('/login', authLocal, login);
router.post('/facebook', authFacbookToken, login);
router.post('/google', authGoogleToken, login);

export default router;
