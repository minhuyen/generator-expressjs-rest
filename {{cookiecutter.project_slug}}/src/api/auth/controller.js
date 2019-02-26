import User from '../users/model';
import { validationResult } from 'express-validator/check';
import httpStatus from 'http-status';
import logger from '../../services/logger';
import { sign } from '../../services/jwt';
import { successResponse, errorResponse } from '../../services/response';

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
export const signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = errors.array({ onlyFirstError: true });
    return res.status(httpStatus.BAD_REQUEST).json(error);
  }
  User.create(req.body)
    .then(user => {
      const token = sign(user._id);
      successResponse(res, httpStatus.CREATED, {
        user: user,
        token: token
      });
    })
    .catch(err => {
      logger.error('=======err===== %o', err);
      if (err.name === 'MongoError' && err.code === 11000) {
        errorResponse(res, httpStatus.BAD_REQUEST, {
          code: 11000,
          message: 'email already registered'
        });
      }
    });
};

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
export const login = function(req, res) {
  const user = req.user;
  const token = sign(user._id);
  // return the information including token as JSON
  return successResponse(res, httpStatus.OK, { user, token });
};
