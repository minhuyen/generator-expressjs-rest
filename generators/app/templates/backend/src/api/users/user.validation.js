import Joi from '@hapi/joi';
import { schemas } from '../../helpers';

const { paginateValidationSchema } = schemas;

export const paginateUserValidateSchema = paginateValidationSchema;

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .min(4)
    .max(255)
    .default(" ")
    .optional(),
  newPassword: Joi.string()
    .required()
    .invalid(Joi.ref('password')),
  confirmNewPassword: Joi.string()
    .required()
    .valid(Joi.ref('newPassword'))
});
