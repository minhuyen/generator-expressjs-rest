import { check } from 'express-validator/check';

export const createValidation = [
  check('recipe')
    .not()
    .isEmpty()
    .withMessage('recipe should not be empty !')
    .isMongoId()
    .withMessage('recipe should be primary key Id !'),
  check('meal_date')
    .not()
    .isEmpty()
    .withMessage('meal date should not be empty!'),
  check('meal_type')
    .not()
    .isEmpty()
    .withMessage('meal type should not be empty!')
];
