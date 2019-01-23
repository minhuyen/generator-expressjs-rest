import { check } from 'express-validator/check';

export const createValidation = [
  check('recipe')
    .not()
    .isEmpty()
    .withMessage('recipe should not be empty !')
    .isMongoId()
    .withMessage('recipe should be primary key Id !')
];
