import { createClient } from "redis";
import config from "../config";
import logger from "./logger";

const client = createClient({ url: config.redis.url });

client.on("error", function (error) {
  logger.error(error);
});

client.connect();

export default client;
