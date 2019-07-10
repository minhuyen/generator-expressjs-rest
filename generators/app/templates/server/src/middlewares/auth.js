import passport from 'passport';
import Response from '../helpers/response';
import { getToken } from '../services/jwt';

export const authLocal = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return Response.error(
        res,
        {
          code: 'Unauthorized',
          message: 'Invalid Username or Password'
        },
        401
      );
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return next();
    });
  })(req, res, next);
};

export const isAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return Response.error(
        res,
        {
          code: 'Unauthorized',
          message: 'Invalid Token'
        },
        401
      );
    } else {
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        return next();
      });
    }
  })(req, res, next);
};

export const roleAuth = (roles = []) => {
  return (req, res, next) => {
    if (typeof roles === 'string') {
      roles = [roles];
    }
    if (roles.length && !roles.includes(req.user.role)) {
      // user's role is not authorized
      return Response.error(
        res,
        { message: 'Permission denied', code: 'Unauthorized' },
        401
      );
    }

    // authentication and authorization successful
    next();
  };
};

export const optionAuth = (req, res, next) => {
  const token = getToken(req);
  if (token) {
    return isAuth(req, res, next);
  } else {
    next();
  }
};

export const authFacbookToken = passport.authenticate('facebook-token');
export const authGoogleToken = passport.authenticate('google-token');
export const authByPhone = passport.authenticate('auth-phone');
