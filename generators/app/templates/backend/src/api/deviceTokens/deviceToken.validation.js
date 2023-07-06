import Joi from "joi";
import { schemas } from "../../helpers";

const { paginateValidationSchema, ObjectId } = schemas;

export const headerValidationSchema = schemas.headerValidationSchema;

export const customPaginateValidateSchema = paginateValidationSchema.keys();

export const createValidationSchema = Joi.object({
  platform: Joi.string().valid("iOS", "android"),
  token: Joi.string().required()
});

export const updateValidationSchema = Joi.object({
  platform: Joi.string().optional(),
  token: Joi.string().optional()
}).unknown(true);
