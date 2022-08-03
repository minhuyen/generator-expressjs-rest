import { isCelebrate } from 'celebrate';
import httpStatus from 'http-status';
import { logger } from '../services';
import Response from './response';

export const errorHandle = (error, req, res, next) => {
  if (typeof error === 'string') {
    // custom application error
    return Response.error(res, { message: error });
  } else if (isCelebrate(error)) {
    // logger.error('isCelebrate %s', isCelebrate(error));
    const { joi } = error;
    return Response.error(res, {
      message: 'Invalid request data. Please review request and try again.',
      code: joi.name,
      errors: joi.details.map(({ message, type }) => ({
        message: message.replace(/['"]/g, ''),
        type
      }))
    });
  } else if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return Response.error(res, {
      // code: error.name,
      message: 'malformatted id'
    });
  } else if (error.name === 'ValidationError') {
    return Response.error(res, {
      message: error.message
    });
  } else if (error.name === 'Error') {
    return Response.error(res, {
      message: error.message
    });
  } else if (error.name === 'CustomError') {
    return Response.error(res, error);
  }
  // default to 500 server error
  logger.debug('%o', error);
  return Response.error(
    res,
    {
      message: error.message
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
      code: 'NotFound',
      message: 'Page Not Found'
    },
    404
  );
};
