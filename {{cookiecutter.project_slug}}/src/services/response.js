// https://github.com/cryptlex/rest-api-response-format
export const successResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

export const errorResponse = function(res, status, content) {
  res.status(status);
  res.json({
    message: content.message,
    code: content.code,
    errors: content.errors
  });
};

export const errorFormatter = ({
  location,
  msg,
  param,
  value,
  nestedErrors
}) => {
  // Build your resulting errors however you want! String, object, whatever - it works!
  return `${location}[${param}]: ${msg}`;
};
