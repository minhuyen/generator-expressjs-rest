import { createClient } from "redis";
import config from "../config";
import logger from "./logger";

const client = createClient({ url: config.redis.url });

client.on("connect", () => {
  logger.info("Connected to Redis");
});

client.on("error", error => {
  logger.error("Redis Client Error %o", error);
});

client.connect();

export default client;
