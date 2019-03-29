import User from '../users/users.model';
import { validationResult } from 'express-validator/check';
import httpStatus from 'http-status';
import logger from '../../services/logger';
import { sign } from '../../services/jwt';
import { successResponse, errorResponse } from '../../services/response';

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

export const login = function(req, res) {
  const user = req.user;
  const token = sign(user._id);
  // return the information including token as JSON
  return successResponse(res, httpStatus.OK, { user, token });
};
