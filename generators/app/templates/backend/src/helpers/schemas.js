import Joi from "joi";

// accepts a valid UUID v4 string as id
export const ObjectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

export const objectIdSchema = Joi.object({
  id: ObjectId.required()
});

export const paginateValidationSchema = Joi.object({
  sort: Joi.string()
    .default("-createdAt")
    .optional(),
  page: Joi.number()
    .greater(0)
    .default(1)
    .positive()
    .optional(),
  limit: Joi.number()
    .greater(0)
    .default(25)
    .positive()
    .optional(),
  filter: Joi.string().optional()
});

export const headerValidationSchema = Joi.object({
  "device-id": Joi.string(),
  authorization: Joi.string()
})
  .or("authorization", "device-id")
  .unknown(true);

export const imageSchema = Joi.object({
  _id: ObjectId.optional(),
  src: Joi.string().required(),
  title: Joi.string().optional(),
  metadata: Joi.object().optional()
});
