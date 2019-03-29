import {
  required,
  minLength,
  maxLength,
  minValue,
  maxValue,
  number,
  regex,
  email,
  choices
} from 'react-admin';

const validateFirstName = [required(), minLength(2), maxLength(15)];
const validateEmail = email();
const validateAge = [number(), minValue(18), maxValue(100)];
const validateZipCode = regex(/^\d{5}$/, 'Must be a valid Zip Code');
const validateSex = choices(['M', 'F'], 'Must be Male or Female');

export {
  validateAge,
  validateEmail,
  validateFirstName,
  validateZipCode,
  validateSex
}