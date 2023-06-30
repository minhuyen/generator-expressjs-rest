import { Controller } from "../../helpers/common";
import iapService from "./iap.service";
import { handleResponse as Response, utils } from "../../helpers";

class IapController extends Controller {
  constructor(service, name) {
    super(service, name);

    this.verifyIosInAppReceipt = this.verifyIosInAppReceipt.bind(this);
    this.verifyIosSubscriptionReceipt = this.verifyIosSubscriptionReceipt.bind(
      this
    );
    this.verifyAndroidInAppReceipt = this.verifyAndroidInAppReceipt.bind(this);
    this.checkIapModel = this.checkIapModel.bind(this);
  }

  async verifyIosInAppReceipt(req, res, next) {
    try {
      const data = req.body;
      let userId = null;
      const user = req.user;
      if (user) {
        userId = user._id;
      }
      const deviceId = utils.getDeviceId(req);
      const result = await this.service.verifyIosInAppPurchaseReceipt(
        data,
        userId,
        deviceId
      );
      return Response.success(res, result);
    } catch (exception) {
      next(exception);
    }
  }

  async verifyAndroidInAppReceipt(req, res, next) {
    try {
      const data = req.body;
      let userId = null;
      const user = req.user;
      if (user) {
        userId = user._id;
      }
      const deviceId = utils.getDeviceId(req);
      const result = await this.service.verifyAndroidInAppReceipt(
        data,
        userId,
        deviceId
      );
      return Response.success(res, result);
    } catch (exception) {
      next(exception);
    }
  }

  async verifyIosSubscriptionReceipt(req, res, next) {
    try {
      const data = req.body;
      let userId = null;
      const user = req.user;
      if (user) {
        userId = user._id;
      }
      const deviceId = utils.getDeviceId(req);
      const result = await this.service.verifyIosSubscriptionReceipt(
        data,
        userId,
        deviceId
      );
      return Response.success(res, result);
    } catch (exception) {
      next(exception);
    }
  }

  async checkIapModel(req, res, next) {
    try {
      // const user = req.user;
      const deviceId = utils.getDeviceId(req);
      const result = await this.service.checkIapModel(deviceId);
      return Response.success(res, { iap: result });
    } catch (exception) {
      next(exception);
    }
  }
}

export default new IapController(iapService, "Iap");
