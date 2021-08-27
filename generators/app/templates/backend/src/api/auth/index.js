import express from 'express';
import { celebrate } from 'celebrate';
import * as authController from './auth.controller';
import * as authValidation from './auth.validation';
import AuthService, {
  authFacebookToken,
  authLocal,
  authGoogleToken
} from '../../middlewares/auth';

const router = express.Router();

/**
 * @swagger
 *
 *responses:
 *  Error:
 *    description: Bad request
 *    schema:
 *      $ref: '#/definitions/Error'
 *  Unauthorized:
 *    description: Unauthorized
 *    schema:
 *      $ref: '#/definitions/Error'
 *  NotFound:
 *    description: The specified resource was not found
 *    schema:
 *      $ref: '#/definitions/Error'
 *
 * parameters:
 *    pageParam:
 *      in: query
 *      name: page
 *      type: integer
 *      minimum: 1
 *      default: 1
 *    limitParam:
 *      in: query
 *      name: limit
 *      type: integer
 *      minimum: 1
 *      maximum: 100
 *      default: 25
 *      description: The numbers of items to return.
 *
 * definitions:
 *  Error:
 *    type: object
 *    required:
 *      - code
 *      - message
 *    properties:
 *      code:
 *        type: string
 *      message:
 *        type: string
 *  NewUser:
 *    type: object
 *    required:
 *      - firstName
 *      - lastName
 *      - email
 *      - password
 *      - accountType
 *      - gender
 *      - birthday
 *      - username
 *    properties:
 *      firstName:
 *        type: string
 *      lastName:
 *        type: string
 *      email:
 *        type: string
 *        format: email
 *      password:
 *        type: string
 *        format: password
 *      accountType:
 *        type: string,
 *        enum: [caller, receive_call, both]
 *      gender:
 *        type: string
 *        enum: [female, male, unknown]
 *      birthday:
 *        type: string
 *        format: date
 *      username:
 *        type: string
 *      about:
 *        type: string
 *  User:
 *    type: object
 *    required: true
 *      - name
 *      - email
 *    properties:
 *      name:
 *        type: string
 *      email:
 *        type: string
 *        format: email
 *      username:
 *        type: string
 *      about:
 *        type: string
 *      birthday:
 *        type: string
 *        format: date
 *      gender:
 *        type: string
 *      price:
 *        type: number
 *      photos:
 *        type: array
 *        items:
 *          type: object
 *          properties:
 *            url:
 *              type: string
 *              format: uri
 *            position:
 *              type: number
 *      isPremium:
 *        type: boolean
 *        default: false
 *      onlyPremium:
 *        type: boolean
 *        default: false
 *      credits:
 *        type: number
 *
 *  ArrayOfUsers:
 *      type: array
 *      items:
 *        $ref: '#/definitions/User'
 *
 *  Login:
 *    type: object
 *    properties:
 *      token:
 *        type: string
 *      user:
 *        $ref: '#/definitions/User'
 */

/**
 * @swagger
 *
 * /auth/signup:
 *   post:
 *     tags: [auth]
 *     description: Creates a user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         description: User object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/NewUser'
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/User'
 *       400:
 *         $ref: '#/responses/Error'
 */
router.post(
  '/signup',
  celebrate({
    body: authValidation.signupValidationSchema
  }),
  authController.signup
);

/**
 * @swagger
 *
 * /auth/login:
 *   post:
 *     tags: [auth]
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         description: login infor
 *         required: true
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/User'
 */
router.post(
  '/login',
  celebrate({ body: authValidation.loginValidationSchema }),
  authLocal,
  authController.login
);
/**
 * @swagger
 *
 * /auth/logout:
 *   post:
 *     tags: [auth]
 *     description: logout to the application
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         description: logout api
 *         required: true
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.post(
  '/logout',
  AuthService.required,
  celebrate({ body: authValidation.logoutValidationSchema }),
  authController.logout
);
/**
 * @swagger
 *
 * /auth/check-email:
 *   post:
 *     tags: [auth]
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         description: check email is valid
 *         required: true
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/check-email', authController.checkEmail);
/**
 * @swagger
 *
 * /auth/check-username:
 *   post:
 *     tags: [auth]
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         description: check username is valid
 *         required: true
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.post('/check-username', authController.checkUsername);
/**
 * @swagger
 *
 * /auth/forgot-password:
 *   post:
 *     tags: [auth]
 *     description: forgot password
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         description: forgot password
 *         required: true
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *     responses:
 *       200:
 *         description: OK
 */
router.post(
  '/forgot-password',
  celebrate({ body: authValidation.forgotPasswordSchema }),
  authController.forgotPassword
);

/**
 * @swagger
 *
 * /auth/verify-code:
 *   post:
 *     tags: [auth]
 *     description: verify passcode
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         description: forgot password
 *         required: true
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *             passcode:
 *               type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.post(
  '/verify-code',
  celebrate({ body: authValidation.verifyCodeValidationSchema }),
  authController.verifyCode
);

/**
 * @swagger
 *
 * /auth/reset-password:
 *   post:
 *     tags: [auth]
 *     description: reset your password
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         description: reset password
 *         required: true
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             newPassword:
 *               type: string
 *               format: password
 *             confirmNewPassword:
 *               type: string
 *               format: password
 *     responses:
 *       200:
 *         description: OK
 */
router.post(
  '/reset-password',
  AuthService.required,
  celebrate({ body: authValidation.resetPasswordSchema }),
  authController.resetPassword
);

router.post(
  '/refresh-token',
  celebrate({ body: authValidation.refreshTokenSchema }),
  authController.refreshToken
);
router.post('/facebook', authFacebookToken, authController.login);
router.post('/google', authGoogleToken, authController.login);
router.post('/apple', authController.loginWithApple);

export default router;
