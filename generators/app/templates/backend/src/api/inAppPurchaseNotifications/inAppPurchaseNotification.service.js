import { Service } from "../../helpers/common";
import InAppPurchaseNotification from "./inAppPurchaseNotification.model";

class InAppPurchaseNotificationService extends Service {
  constructor() {
    super(InAppPurchaseNotification);
  }
}

export default new InAppPurchaseNotificationService();
