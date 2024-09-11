import express from "express";
import { celebrate } from "celebrate";
import inAppPurchaseNotificationController from "./inAppPurchaseNotification.controller";
import AuthService from "../../middlewares/auth";
import {
  createValidationSchema,
  updateValidationSchema,
  customPaginateValidateSchema
} from "./inAppPurchaseNotification.validation";

const router = express.Router();
/**
 * @swagger
 *
 * definitions:
 *   InApp Purchase Notification:
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
 *   ArrayOfInApp Purchase Notifications:
 *      type: array
 *      items:
 *        $ref: "#/definitions/InApp Purchase Notification"
 */

/**
 * @swagger
 *
 * /inAppPurchaseNotifications:
 *   post:
 *     tags: [inAppPurchaseNotifications]
 *     description: create a inAppPurchaseNotification
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         schema:
 *          $ref: "#/definitions/InApp Purchase Notification"
 *
 *     responses:
 *      200:
 *         description: OK
 *         schema:
 *           $ref: "#/definitions/InApp Purchase Notification"
 *      400:
 *        $ref: "#/responses/Error"
 *      401:
 *        $ref: "#/responses/Unauthorized"
 */

router.post(
  "/",
  [AuthService.required, celebrate({ body: createValidationSchema })],
  inAppPurchaseNotificationController.create
);

/**
 * @swagger
 *
 * /inAppPurchaseNotifications:
 *   put:
 *     tags: [inAppPurchaseNotifications]
 *     description: create a inAppPurchaseNotification
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         schema:
 *          $ref: "#/definitions/InApp Purchase Notification"
 *
 *     responses:
 *      200:
 *         description: OK
 *         schema:
 *           $ref: "#/definitions/InApp Purchase Notification"
 *      400:
 *        $ref: "#/responses/Error"
 *      401:
 *        $ref: "#/responses/Unauthorized"
 */

router.put(
  "/:id",
  [AuthService.required],
  celebrate({ body: updateValidationSchema }),
  inAppPurchaseNotificationController.update
);

/**
 * @swagger
 *
 * /inAppPurchaseNotifications:
 *   get:
 *     tags: [inAppPurchaseNotifications]
 *     description: get all inAppPurchaseNotifications
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: "#/parameters/pageParam"
 *       - $ref: "#/parameters/limitParam"
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
 *                $ref: "#/definitions/ArrayOfInApp Purchase Notifications"
 *        401:
 *          $ref: "#/responses/Unauthorized"
 */
router.get(
  "/",
  AuthService.optional,
  celebrate({ query: customPaginateValidateSchema }),
  inAppPurchaseNotificationController.findAll
);

/**
 * @swagger
 *
 * /inAppPurchaseNotifications/{id}:
 *   get:
 *     tags: [inAppPurchaseNotifications]
 *     description: get detail inAppPurchaseNotification
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: inAppPurchaseNotification id
 *         required: true
 *         type: string
 *     responses:
 *      200:
 *         description: OK
 *         schema:
 *           $ref: "#/definitions/InApp Purchase Notification"
 *      400:
 *        $ref: "#/responses/Error"
 *      401:
 *        $ref: "#/responses/Unauthorized"
 */
router.get("/:id", inAppPurchaseNotificationController.findOne);

/**
 * @swagger
 *
 * /inAppPurchaseNotifications/{id}:
 *   delete:
 *     tags: [inAppPurchaseNotifications]
 *     description: delete a inAppPurchaseNotification
 *     security:
 *       - BearerAuth: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: inAppPurchaseNotifications id
 *         required: true
 *         type: string
 *     responses:
 *      200:
 *         description: OK
 *         schema:
 *           $ref: "#/definitions/InApp Purchase Notification"
 *      400:
 *        $ref: "#/responses/Error"
 *      401:
 *        $ref: "#/responses/Unauthorized"
 */
router.delete(
  "/:id",
  AuthService.required,
  inAppPurchaseNotificationController.remove
);

export default router;
