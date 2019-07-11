import { isCelebrate } from 'celebrate';
import Response from './response';

export const errorHandle = (err, req, res, next) => {
  if (!isCelebrate(err)) {
    console.log('=======err=========', err);
    return Response.error(res, {
      code: err.name,
      message: err.message
    });
  } else {
    const { joi } = err;
    return Response.error(res, {
      message: 'Invalid request data. Please review request and try again.',
      code: joi.name,
      errors: joi.details.map(({ message, type }) => ({
        message: message.replace(/['"]/g, ''),
        type
      }))
    });
  }
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
