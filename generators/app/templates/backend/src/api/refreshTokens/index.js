import express from 'express';
import { celebrate } from 'celebrate';
import refreshTokenController from './refreshToken.controller';
import AuthService from '../../middlewares/auth';
import {
  createValidationSchema,
  updateValidationSchema,
  customPaginateValidateSchema,
} from './refreshToken.validation';

const router = express.Router();
/**
 * @swagger
 *
 * definitions:
 *   RefreshToken:
 *     type: object
 *     required:
 *       - field1
 *       - field2
 *     properties:
 *       field1:
 *         type: string
 *       field2:
 *         type: string
 *
 *   ArrayOfRefreshTokens:
 *      type: array
 *      items:
 *        $ref: '#/definitions/RefreshToken'
 */

/**
 * @swagger
 *
 * /refreshTokens:
 *   post:
 *     tags: [refreshTokens]
 *     description: create a refreshToken
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         schema:
 *          $ref: '#/definitions/RefreshToken'
 *
 *     responses:
 *      200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/RefreshToken'
 *      400:
 *        $ref: '#/responses/Error'
 *      401:
 *        $ref: '#/responses/Unauthorized'
 */

router.post(
  '/',
  [AuthService.required, celebrate({ body: createValidationSchema })],
  refreshTokenController.create
);

/**
 * @swagger
 *
 * /refreshTokens:
 *   put:
 *     tags: [refreshTokens]
 *     description: create a refreshToken
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         schema:
 *          $ref: '#/definitions/RefreshToken'
 *
 *     responses:
 *      200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/RefreshToken'
 *      400:
 *        $ref: '#/responses/Error'
 *      401:
 *        $ref: '#/responses/Unauthorized'
 */

router.put(
  '/:id',
  [AuthService.required],
  celebrate({ body: updateValidationSchema }),
  refreshTokenController.update
);

/**
 * @swagger
 *
 * /refreshTokens:
 *   get:
 *     tags: [refreshTokens]
 *     description: get all refreshTokens
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#/parameters/pageParam'
 *       - $ref: '#/parameters/limitParam'
 *     responses:
 *        200:
 *         description: OK
 *         schema:
 *           type: object
 *           properties:
 *              page:
 *                type: integer
 *                format: int32
 *              pages:
 *                type: integer
 *                format: int32
 *              limit:
 *                type: integer
 *                format: int32
 *              total:
 *                type: integer
 *                format: int32
 *              data:
 *                $ref: '#/definitions/ArrayOfRefreshTokens'
 *        401:
 *          $ref: '#/responses/Unauthorized'
 */
router.get(
  '/',
  AuthService.optional,
  celebrate({ query: customPaginateValidateSchema }),
  refreshTokenController.findAll
);

/**
 * @swagger
 *
 * /refreshTokens/{id}:
 *   get:
 *     tags: [refreshTokens]
 *     description: get detail refreshToken
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: refreshToken id
 *         required: true
 *         type: string
 *     responses:
 *      200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/RefreshToken'
 *      400:
 *        $ref: '#/responses/Error'
 *      401:
 *        $ref: '#/responses/Unauthorized'
 */
router.get('/:id', refreshTokenController.findOne);

/**
 * @swagger
 *
 * /refreshTokens/{id}:
 *   delete:
 *     tags: [refreshTokens]
 *     description: delete a refreshToken
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: refreshTokens id
 *         required: true
 *         type: string
 *     responses:
 *      200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/RefreshToken'
 *      400:
 *        $ref: '#/responses/Error'
 *      401:
 *        $ref: '#/responses/Unauthorized'
 */
router.delete('/:id', AuthService.required, refreshTokenController.remove);


export default router;
