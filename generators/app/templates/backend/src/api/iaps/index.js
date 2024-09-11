import express from "express";
import { celebrate } from "celebrate";
import AuthService from "../../middlewares/auth";
import iapController from "./iap.controller";
import * as iapValidation from "./iap.validation";

const router = express.Router();

router.post(
  "/in-app/ios",
  [
    AuthService.optional,
    celebrate({
      headers: iapValidation.headerValidationSchema,
      body: iapValidation.iosIapReceiptValidationSchema
    })
  ],
  iapController.verifyIosInAppReceipt
);

router.post(
  "/in-app/android",
  [
    AuthService.optional,
    celebrate({
      headers: iapValidation.headerValidationSchema,
      body: iapValidation.androidIapReceiptValidationSchema
    })
  ],
  iapController.verifyAndroidInAppReceipt
);

router.post(
  "/in-app/check",
  [
    AuthService.optional,
    celebrate({
      headers: iapValidation.headerValidationSchema
    })
  ],
  iapController.checkIapModel
);

router.post(
  "/subs/ios",
  AuthService.optional,
  iapController.verifyIosSubscriptionReceipt
);

router.post(
  "/subs/android",
  AuthService.optional,
  iapController.verifyAndroidSubReceipt
);

router.post(
  "/webhook/ios",
  AuthService.optional,
  iapController.handleIOSWebhook
);

router.post(
  "/webhook/android",
  AuthService.optional,
  iapController.handleAndroidWebhook
);

router.post(
  "/",
  [AuthService.required, AuthService.isAdmin()],
  iapController.create
);

router.get(
  "/",
  [AuthService.required, AuthService.isAdmin()],
  iapController.findAll
);

router.get("/:id", iapController.findOne);

router.put(
  "/:id",
  [AuthService.required, AuthService.isAdmin()],
  iapController.update
);

router.delete(
  "/:id",
  AuthService.required,
  AuthService.isAdmin(),
  iapController.remove
);

export default router;
