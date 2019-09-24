import passport from 'passport';
import Response from '../helpers/response';

export default class AuthService {
  static getTokenFromHeaders(req) {
    if (req.headers.authorization) {
      const re = /(\S+)\s+(\S+)/;
      const matches = req.headers.authorization.match(re);
      return matches && { scheme: matches[1], value: matches[2] };
    } else {
      return null;
    }
  }

  static required(req, res, next) {
    return passport.authenticate(
      'jwt',
      { session: false },
      (err, user, info) => {
        console.log('=======info==========', info);
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
      }
    )(req, res, next);
  }

  static roles(roles = []) {
    return (req, res, next) => {
      if (typeof roles === 'string') {
        roles = [roles];
      }
      if (roles.length && !roles.includes(req.user.role)) {
        // user's role is not authorized
        return Response.error(
          res,
          {
            message: 'Bạn không có quyền truy cập vào trang này',
            code: 'Unauthorized'
          },
          401
        );
      }

      // authentication and authorization successful
      next();
    };
  }

  static optional(req, res, next) {
    const token = AuthService.getTokenFromHeaders(req);
    if (token) {
      return AuthService.required(req, res, next);
    } else {
      next();
    }
  }
}

export const authLocal = passport.authenticate('local', { session: false });
export const authJwt = passport.authenticate('jwt', { session: false });
export const authFacebookToken = passport.authenticate('facebook-token');
export const authGoogleToken = passport.authenticate('google-token');
