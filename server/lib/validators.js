/* eslint-disable prettier/prettier */
import { isNotEmpty } from 'class-validator';
import { body, check, validationResult } from 'express-validator';
import { ErrorHandler } from '../utils/utility.js';

const registerValidator = () => [
  body('name', 'Username is Required')
    .isString()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),
  body('username', 'Please Enter Username')
    .isString()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('email', 'Please enter a valid Email')
    .isEmail()
    .notEmpty()
    .withMessage('Please enter a valid email'),
  body('password', 'Please enter Password')
    .isLength({ min: 6 })
    .notEmpty()
    .withMessage('Password must be at least 6 characters'),
    check('avatar','Please upload an Avatar').notEmpty()
];

const loginValidator = () => [
  body('email', 'Please enter a valid Email')
    .isEmail()
    .notEmpty()
    .withMessage('Please enter a valid email'),
  body('password', 'Please enter Password')
    .isLength({ min: 6 })
    .notEmpty()
    .withMessage('Password must be at least 6 characters'),
];

const validateHandler = (req, res, next) => {
  const errors = validationResult(req);
  const errorMessage = errors
    .array()
    .map((errors) => errors.msg)
    .join(', ');
  console.log(errorMessage);

  if (!errors.isEmpty()) {
    return next(new ErrorHandler(errorMessage, 400));
  }
  next();
};

export { registerValidator, validateHandler, loginValidator };
