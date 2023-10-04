import { isCelebrateError, Segments } from "celebrate";
import httpStatus from "http-status";
import { logger } from "../services";
import Response from "./response";
import { AppError } from "./error";

// eslint-disable-next-line no-unused-vars
export const errorHandle = (error, req, res, next) => {
  if (typeof error === "string") {
    // custom application error
    return Response.error(res, { message: error });
  } else if (isCelebrateError(error)) {
    const bodyCelebrateError = error.details.get(Segments.BODY);
    const headerCelebrateError = error.details.get(Segments.HEADERS);

    const response = {
      message: "Invalid request data. Please review the request and try again.",
      code: []
    };

    if (bodyCelebrateError) {
      response.code = response.code.concat(
        bodyCelebrateError.details.map(({ message, type }) => ({
          message: message.replace(/['"]/g, ""),
          code: type
        }))
      );
    }

    if (headerCelebrateError) {
      response.code = response.code.concat(
        headerCelebrateError.details.map(({ message, type }) => ({
          message: message.replace(/['"]/g, ""),
          code: type
        }))
      );
    }

    return Response.error(res, response);
  } else if (error instanceof AppError) {
    return Response.error(res, {
      message: error.message,
      code: error.code
    });
  } else if (error.name === "CastError" && error.kind === "ObjectId") {
    return Response.error(res, {
      // code: error.name,
      message: "malformatted id"
    });
  } else if (error.name === "ValidationError") {
    return Response.error(res, {
      message: error.message
    });
  } else if (error.name === "Error") {
    return Response.error(res, {
      message: error.message
    });
  } else if (error.name === "CustomError") {
    return Response.error(res, error);
  }
  // default to 500 server error
  logger.error("%o", error);
  return Response.error(
    res,
    {
      message: error.message,
      stack: error.stack
    },
    httpStatus.INTERNAL_SERVER_ERROR
  );
};

export const logErrors = (err, req, res, next) => {
  console.error(err.stack);
  next(err);
};

export const notFoundHandle = (req, res, next) => {
  return Response.error(
    res,
    {
      code: "NotFound",
      message: "Page Not Found"
    },
    404
  );
};
