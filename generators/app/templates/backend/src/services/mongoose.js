import mongoose from "mongoose";
import { logger } from "../services";
import config from "../config";

mongoose
  .connect(config.mongodb.url, config.mongodb.options)
  .then(_ => logger.info("Successfully connected to the mongoDB database"))
  .catch(error => logger.error("MongoDB connection error: ", error));

export default mongoose;
