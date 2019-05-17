import { check } from 'express-validator/check';

export const signupValidation = [
  check('first_name')
    .not()
    .isEmpty()
    .withMessage('First name should not be empty !'),
  check('email')
    .not()
    .isEmpty()
    .withMessage('Email should not be empty!'),
  check('email')
    .isEmail()
    .withMessage('Email is invalid!'),
  check('password')
    .not()
    .isEmpty()
    .withMessage('Password should not be empty'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password should has 6 character as least!'),
  check('last_name')
    .not()
    .isEmpty()
    .withMessage('Last name should not be empty !')
];
