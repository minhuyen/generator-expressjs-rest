import { logger } from "../services";
import { createAdminAccount } from "./user_seeder";
import User from "../api/users/users.model";

require("../services/mongoose");

(async () => {
  try {
    logger.info("=======seeding data===========");
    await createAdminAccount();
    await User.syncIndexes();
    logger.info("=======seeded data was successfully===========");
  } catch (error) {
    logger.error("==============error==========%j", error);
  }
})();
