import passport from "passport";
import Response from "../helpers/response";
import { UnAuthorizedError } from "../core/error.response";

export default class AuthService {
  static getTokenFromHeaderOrQuerystring(req) {
    const re = /(\S+)\s+(\S+)/;
    if (req.headers.authorization) {
      const matches = req.headers.authorization.match(re);
      return matches && { scheme: matches[1], value: matches[2] };
    } else if (req.query && req.query.token) {
      const matches = req.query.token.match(re);
      return matches && { scheme: matches[1], value: matches[2] };
    } else {
      return null;
    }
  }

  static required(req, res, next) {
    return passport.authenticate(
      "jwt",
      { session: false },
      (err, user, info) => {
        // console.log('=======info==========', info);
        if (err) {
          return next(err);
        }
        if (!user) {
          throw new UnAuthorizedError("Invalid Token");
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
      if (typeof roles === "string") {
        roles = [roles];
      }
      if (roles.length && !roles.includes(req.user.role)) {
        throw new UnAuthorizedError(
          "You are not authorized to access this page!"
        );
      }

      // authentication and authorization successful
      next();
    };
  }

  static optional(req, res, next) {
    const token = AuthService.getTokenFromHeaderOrQuerystring(req);
    if (token) {
      return AuthService.required(req, res, next);
    } else {
      next();
    }
  }

  static isAdmin() {
    return AuthService.roles("admin");
  }
}

// export const authLocal = passport.authenticate('local', { session: false });
export const authLocal = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      throw new UnAuthorizedError("Your email or password is incorrect");
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return next();
    });
  })(req, res, next);
};
export const authJwt = passport.authenticate("jwt", { session: false });
export const authFacebookToken = passport.authenticate("facebook-token");
export const authGoogleToken = passport.authenticate("google-token");
