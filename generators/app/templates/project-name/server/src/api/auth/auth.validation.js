import Joi from '@hapi/joi';

// password and confirmPassword must contain the same value
export const signupValidationSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  password: Joi.string()
    .min(6)
    .required()
    .strict(),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .strict()
});

export const loginValidationSchema = Joi.object({
  username: Joi.string()
    .regex(/(0[0-9])+([0-9]{8})\b$/)
    .required(),
  password: Joi.string()
    .min(6)
    .max(255)
    .required()
});

export const registerUserNameSchema = Joi.object({
  username: Joi.string()
    .regex(/(0[0-9])+([0-9]{8})\b$/)
    .required()
});

export const verifyValidationSchema = Joi.object({
  username: Joi.string()
    .regex(/(0[0-9])+([0-9]{8})\b$/)
    .required(),
  code: Joi.string()
    .length(6)
    .regex(/\d/)
    .required()
});

export const createPasswordSchema = Joi.object({
  password: Joi.string()
    .min(6)
    .max(255)
    .required(),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref('password'))
});

export const changePasswordSchema = Joi.object({
  password: Joi.string()
    .min(6)
    .max(255)
    .required(),
  newPassword: Joi.string()
    .required()
    .invalid(Joi.ref('password')),
  confirmNewPassword: Joi.string()
    .required()
    .valid(Joi.ref('newPassword'))
});
