import Joi from "joi";
import { schemas } from "../../helpers";

const { paginateValidationSchema } = schemas;

export const headerValidationSchema = schemas.headerValidationSchema;

export const customPaginateValidateSchema = paginateValidationSchema.keys();

export const createValidationSchema = Joi.object({
  field: Joi.string().optional(),
  field2: Joi.string().required()
});

export const iosIapReceiptValidationSchema = Joi.object({
  "receipt-data": Joi.string().required(),
  password: Joi.string().optional()
});

export const androidIapReceiptValidationSchema = Joi.object({
  packageName: Joi.string().required(),
  productId: Joi.string().required(),
  purchaseToken: Joi.string().required()
});

export const updateValidationSchema = Joi.object({
  field: Joi.string().optional(),
  field2: Joi.string().required()
}).unknown(true);
