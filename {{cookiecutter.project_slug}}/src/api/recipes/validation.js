import { check } from 'express-validator/check';

export const createValidation = [
  check('category')
    .not()
    .isEmpty()
    .withMessage('category should not be empty !')
    .isMongoId()
    .withMessage('category should be primary key Id !'),
  check('name')
    .not()
    .isEmpty()
    .withMessage('Name should not be empty !'),
  // check('image')
  //   .not()
  //   .isEmpty()
  //   .withMessage('Image should not be empty!'),
  check('kcal')
    .not()
    .isEmpty()
    .withMessage('kcal should not be empty')
    .isInt()
    .withMessage('kcal should be int'),
  check('summary')
    .not()
    .isEmpty()
    .withMessage('Summary should not be empty!'),
  check('description')
    .not()
    .isEmpty()
    .withMessage('Description should not be empty!'),
  check('net_carbs')
    .not()
    .isEmpty()
    .withMessage('net_carbs should not be empty')
    .isInt()
    .withMessage('net_carbs should be int'),
  check('protein')
    .not()
    .isEmpty()
    .withMessage('protein should not be empty')
    .isInt()
    .withMessage('protein should be int'),
  check('fat')
    .not()
    .isEmpty()
    .withMessage('fat should not be empty')
    .isInt()
    .withMessage('fat should be int'),
  check('meal_type')
    .not()
    .isEmpty()
    .withMessage('meal_type should not be empty')
    .isIn(['breakfast', 'lunch', 'dinner', 'stack'])
    .withMessage('meal_type should be breakfast, lunch, dinner or stack'),
  check('owner')
    .optional()
    .isMongoId()
    .withMessage('owner should be primary key Id !')
];
