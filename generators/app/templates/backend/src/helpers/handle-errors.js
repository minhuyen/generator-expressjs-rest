import { isCelebrateError, Segments } from "celebrate";
import { logger } from "../services";
import Response from "./response";
import { NotFoundError } from "../core/error.response";

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
  } else if (error.name === "CastError" && error.kind === "ObjectId") {
    return Response.error(res, {
      // code: error.name,
      message: "malformatted id"
    });
  } else {
    // default to 500 server error
    // logger.error("%o", error);
    return Response.error(
      res,
      {
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : null,
        code: error.code
      },
      error.status
    );
  }
};

export const logErrors = (err, req, res, next) => {
  console.error(err.stack);
  next(err);
};

export const notFoundHandle = (req, res, next) => {
  const error = new NotFoundError();
  next(error);
};
