import { check } from 'express-validator/check';

export const createValidation = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('Name should not be empty !')
];
