import Joi from "joi";

// password and confirmPassword must contain the same value
export const signupValidationSchema = Joi.object({
  fullName: Joi.string().optional(),
  email: Joi.string()
    .email()
    .lowercase()
    .required(),
  password: Joi.string()
    .min(4)
    .required()
    .strict()
});

export const loginValidationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(4)
    .max(255)
    .required()
});

export const compareOtpValidationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  otpRequest: Joi.string()
    .length(6)
    .regex(/\d/)
    .required()
});

export const requestOtpLoginValidationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
});


export const logoutValidationSchema = Joi.object({
  token: Joi.string().optional()
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
    .min(4)
    .max(255)
    .required(),
  confirmNewPassword: Joi.string()
    .required()
    .valid(Joi.ref("newPassword"))
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().optional()
});

export const getProfileSchema = Joi.object({
  access_token: Joi.string().optional(),
  id_token: Joi.when("access_token", {
    is: null,
    then: Joi.string().required(),
    otherwise: Joi.string()
  })
}).or("access_token", "id_token");
