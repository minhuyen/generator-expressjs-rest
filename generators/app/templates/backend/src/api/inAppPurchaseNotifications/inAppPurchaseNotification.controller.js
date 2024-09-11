import { Controller } from "../../helpers/common";
import inAppPurchaseNotificationService from "./inAppPurchaseNotification.service";
import { handleResponse as Response } from "../../helpers";

class InAppPurchaseNotificationController extends Controller {
  constructor(service, name) {
    super(service, name);
  }
}

export default new InAppPurchaseNotificationController(
  inAppPurchaseNotificationService,
  "InAppPurchaseNotification"
);
