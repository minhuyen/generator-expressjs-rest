import User from '../users/users.model';
import httpStatus from 'http-status';
import logger from '../../services/logger';
import { sign } from '../../services/jwt';
import * as Response from '../../helpers/response';

export const signup = (req, res) => {
  User.create(req.body)
    .then(user => {
      const token = sign(user._id);
      return Response.success(
        res,
        {
          user: user,
          token: token
        },
        httpStatus.CREATED
      );
    })
    .catch(err => {
      logger.error('=======err===== %o', err);
      if (err.name === 'MongoError' && err.code === 11000) {
        return Response.error(res, {
          code: 11000,
          message: 'email already registered'
        });
      } else {
        return Response.error(res, err);
      }
    });
};

export const login = function(req, res) {
  const user = req.user;
  const token = sign(user._id);
  // return the information including token as JSON
  return Response.success(res, { user, token }, httpStatus.OK);
};
