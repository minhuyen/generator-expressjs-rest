import express from "express";
import { celebrate } from "celebrate";
import deviceTokenController from "./deviceToken.controller";
import AuthService from "../../middlewares/auth";
import {
  createValidationSchema,
  updateValidationSchema,
  customPaginateValidateSchema,
  headerValidationSchema
} from "./deviceToken.validation";

const router = express.Router();
/**
 * @swagger
 *
 * definitions:
 *   DeviceToken:
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
 *   ArrayOfDeviceTokens:
 *      type: array
 *      items:
 *        $ref: '#/definitions/DeviceToken'
 */

/**
 * @swagger
 *
 * /deviceTokens:
 *   post:
 *     tags: [deviceTokens]
 *     description: create a deviceToken
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         schema:
 *          $ref: '#/definitions/DeviceToken'
 *
 *     responses:
 *      200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/DeviceToken'
 *      400:
 *        $ref: '#/responses/Error'
 *      401:
 *        $ref: '#/responses/Unauthorized'
 */

router.post(
  "/",
  [
    AuthService.optional,
    celebrate({ body: createValidationSchema, headers: headerValidationSchema })
  ],
  deviceTokenController.create
);

router.post(
  "/send",
  [
    AuthService.optional
    // celebrate({ body: createValidationSchema, headers: headerValidationSchema })
  ],
  deviceTokenController.sendNotification
);

router.post(
  "/sendToDeviceId",
  [
    AuthService.optional
    // celebrate({ body: createValidationSchema, headers: headerValidationSchema })
  ],
  deviceTokenController.sendNotificationByDeviceId
);

/**
 * @swagger
 *
 * /deviceTokens:
 *   put:
 *     tags: [deviceTokens]
 *     description: create a deviceToken
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         schema:
 *          $ref: '#/definitions/DeviceToken'
 *
 *     responses:
 *      200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/DeviceToken'
 *      400:
 *        $ref: '#/responses/Error'
 *      401:
 *        $ref: '#/responses/Unauthorized'
 */

router.put(
  "/:id",
  [AuthService.required],
  celebrate({ body: updateValidationSchema }),
  deviceTokenController.update
);

/**
 * @swagger
 *
 * /deviceTokens:
 *   get:
 *     tags: [deviceTokens]
 *     description: get all deviceTokens
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
 *                $ref: '#/definitions/ArrayOfDeviceTokens'
 *        401:
 *          $ref: '#/responses/Unauthorized'
 */
router.get(
  "/",
  [AuthService.required, AuthService.isAdmin()],
  celebrate({ query: customPaginateValidateSchema }),
  deviceTokenController.findAll
);

/**
 * @swagger
 *
 * /deviceTokens/{id}:
 *   get:
 *     tags: [deviceTokens]
 *     description: get detail deviceToken
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: deviceToken id
 *         required: true
 *         type: string
 *     responses:
 *      200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/DeviceToken'
 *      400:
 *        $ref: '#/responses/Error'
 *      401:
 *        $ref: '#/responses/Unauthorized'
 */
router.get("/:id", deviceTokenController.findOne);

/**
 * @swagger
 *
 * /deviceTokens/{id}:
 *   delete:
 *     tags: [deviceTokens]
 *     description: delete a deviceToken
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: deviceTokens id
 *         required: true
 *         type: string
 *     responses:
 *      200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/DeviceToken'
 *      400:
 *        $ref: '#/responses/Error'
 *      401:
 *        $ref: '#/responses/Unauthorized'
 */
router.delete(
  "/:id",
  [AuthService.required, AuthService.isAdmin()],
  deviceTokenController.remove
);

export default router;
