import Joi from '@hapi/joi';
import { schemas } from '../../helpers';

const { paginateValidationSchema } = schemas;

export const paginateUserValidateSchema = paginateValidationSchema.keys({
  email: Joi.string().optional()
}); // add more key

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

export const updateMeSchema = Joi.object({
  email: Joi.any().forbidden(),
  isPremium: Joi.any().forbidden(),
  role: Joi.any().forbidden(),
}).unknown(true);
