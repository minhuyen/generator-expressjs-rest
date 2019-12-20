import Joi from '@hapi/joi';

// password and confirmPassword must contain the same value
export const signupValidationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string()
    .email()
    .lowercase()
    .required(),
  username: Joi.string()
    .min(5)
    .required(),
  password: Joi.string()
    .min(6)
    .required()
    .strict(),
  accountType: Joi.string()
    .valid('caller', 'receive_call', 'both')
    .required(),
  gender: Joi.string()
    .valid('female', 'male', 'unknown')
    .required(),
  birthday: Joi.date()
    .greater('1-1-1900')
    .required(),
  about: Joi.string()
    .allow('')
    .optional()
});

export const loginValidationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(6)
    .max(255)
    .required()
});

export const logoutValidationSchema = Joi.object({
  token: Joi.string().required()
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
});

export const verifyCodeValidationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  code: Joi.string()
    .length(6)
    .regex(/\d/)
    .required()
});

export const resetPasswordSchema = Joi.object({
  newPassword: Joi.string()
    .min(6)
    .max(255)
    .required(),
  confirmNewPassword: Joi.string()
    .required()
    .valid(Joi.ref('newPassword'))
});
