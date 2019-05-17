import Joi from '@hapi/joi';

// accepts a valid UUID v4 string as id
export const ObjectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

export const objectIdSchema = Joi.object({
  id: ObjectId.required()
});
