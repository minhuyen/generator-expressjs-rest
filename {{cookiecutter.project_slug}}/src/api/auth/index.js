import express from 'express';
import { signup, login } from './controller';
import { signupValidation } from './validation';
import {
  authFacbookToken,
  authLocal,
  authGoogleToken
} from '../../services/passport';

const router = express.Router();

router.post('/signup', signupValidation, signup);
router.post('/login', authLocal, login);
router.post('/facebook', authFacbookToken, login);
router.post('/google', authGoogleToken, login);

export default router;
