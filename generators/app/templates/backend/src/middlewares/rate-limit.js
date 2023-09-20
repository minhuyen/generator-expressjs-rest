import rateLimit from "express-rate-limit";
import config from "../config";
import { utils } from "../helpers";
import iapService from "../api/iaps/iap.service";
import RedisStore from "rate-limit-redis";
import client from "../services/redis";

/**
 * Limit each user to <limit> requests per `window` <duration>
 * @param {number} limit: number of allowed requests
 * @param {number} duration (in seconds)
 * @returns middleware
 */
export const rateLimitByUser = (limit, duration) => {
  return rateLimit({
    windowMs: duration * 1000,
    max: limit,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    message: {
      message:
        "Too many request from this IP, please try again after an minutes",
      code: "429"
    },
    legacyHeaders: false // Disable the `X-RateLimit-*` headers
  });
};

export const rateLimitByUserPurchase = () => {
  return rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    // eslint-disable-next-line no-unused-vars
    keyGenerator: (request, response) => {
      const mode = request.body.mode;
      const deviceId = utils.getDeviceId(request);
      return `${mode}:${deviceId}`;
    },
    max: async (req, res) => {
      const deviceId = utils.getDeviceId(req);
      const checkPremium = await iapService.checkIapModel(deviceId);
      if (!checkPremium) return config.maxRequestGpt;
      return 0;
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    message: {
      message: "You've reached daily Limit",
      code: "429"
    },
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    store: new RedisStore({
      sendCommand: (...args) => client.sendCommand(args)
    })
  });
};
