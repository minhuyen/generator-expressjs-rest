import { ReasonPhrases, StatusCodes } from "http-status-codes";

export class AppError extends Error {
  constructor(message, status, code) {
    // Calling parent constructor of base Error class.
    super(message);

    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name;

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);

    // You can use any additional properties you want.
    // I'm going to use preferred HTTP status for this error types.
    // `500` is the default value if not specified.
    this.status = status;
    this.code = code;
  }
}

export class NotFoundError extends AppError {
  constructor(
    message = ReasonPhrases.NOT_FOUND,
    code = "NOT_FOUND",
    status = StatusCodes.NOT_FOUND
  ) {
    super(message, status, code);
  }
}

export class BadRequestError extends AppError {
  constructor(
    message = ReasonPhrases.BAD_REQUEST,
    code = "BAD_REQUEST",
    status = StatusCodes.BAD_REQUEST
  ) {
    super(message, status, code);
  }
}

export class InternalServerError extends AppError {
  constructor(
    message = ReasonPhrases.INTERNAL_SERVER_ERROR,
    code = "INTERNAL_SERVER_ERROR",
    status = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message, status, code);
  }
}

export class ForbiddenError extends AppError {
  constructor(
    message = ReasonPhrases.FORBIDDEN,
    code = "FORBIDDEN",
    status = StatusCodes.FORBIDDEN
  ) {
    super(message, status, code);
  }
}

export class UnAuthorizedError extends AppError {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    code = "UNAUTHORIZED",
    status = StatusCodes.UNAUTHORIZED
  ) {
    super(message, status, code);
  }
}
