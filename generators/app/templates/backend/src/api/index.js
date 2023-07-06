import { Router } from "express";
import auth from "./auth";
import users from "./users";
import uploads from "./uploads";
import configs from "./configs";
import iaps from "./iaps";

const router = new Router();

router.use("/auth", auth);
router.use("/users", users);
router.use("/uploads", uploads);
router.use("/configs", configs);
router.use("/iaps", iaps);
router.use("/device-tokens", deviceTokens);

export default router;
