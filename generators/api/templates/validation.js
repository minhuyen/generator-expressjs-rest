import Joi from '@hapi/joi';
import { schemas } from '../../helpers';

const { paginateValidationSchema, ObjectId } = schemas;


export const customPaginateValidateSchema = paginateValidationSchema.keys({});

export const createValidationSchema = Joi.object({
  field: Joi.string().options(),
  field2: Joi.string().required()
});

export const updateCountryValidationSchema = Joi.object({
  field: Joi.string().options(),
  field2: Joi.string().required()
}).unknown(true);