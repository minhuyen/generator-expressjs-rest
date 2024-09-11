import { Router } from "express";
import auth from "./auth";
import users from "./users";
import uploads from "./uploads";
import configs from "./configs";
import iaps from "./iaps";
import deviceTokens from "./deviceTokens";
import inAppPurchaseNotifications from "./inAppPurchaseNotifications";

const router = new Router();

router.use("/auth", auth);
router.use("/users", users);
router.use("/uploads", uploads);
router.use("/configs", configs);
router.use("/iaps", iaps);
router.use("/device-tokens", deviceTokens);
router.use("/inAppPurchaseNotifications", inAppPurchaseNotifications);

export default router;
