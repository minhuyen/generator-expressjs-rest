import { Controller } from "../../helpers/common";
import iapService from "./iap.service";
import { PURCHASE_TYPE } from "./iap.model";
import { handleResponse as Response, utils } from "../../helpers";

class IapController extends Controller {
  constructor(service, name) {
    super(service, name);

    this.verifyIosInAppReceipt = this.verifyIosInAppReceipt.bind(this);
    this.verifyIosSubscriptionReceipt = this.verifyIosSubscriptionReceipt.bind(
      this
    );
    this.verifyAndroidInAppReceipt = this.verifyAndroidInAppReceipt.bind(this);
    this.verifyAndroidSubReceipt = this.verifyAndroidSubReceipt.bind(this);
    this.checkIapModel = this.checkIapModel.bind(this);
    this.handleIOSWebhook = this.handleIOSWebhook.bind(this);
    this.handleAndroidWebhook = this.handleAndroidWebhook.bind(this);
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
      const result = await this.service.verifyIOSReceipt(
        data,
        userId,
        deviceId,
        PURCHASE_TYPE.LIFETIME
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
      const result = await this.service.verifyIOSReceipt(
        data,
        userId,
        deviceId,
        PURCHASE_TYPE.SUBSCRIPTION
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

  async verifyAndroidSubReceipt(req, res, next) {
    try {
      const data = req.body;
      let userId = null;
      const user = req.user;
      if (user) {
        userId = user._id;
      }
      const deviceId = utils.getDeviceId(req);
      const result = await this.service.verifyAndroidSubReceipt(
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

  async handleIOSWebhook(req, res, next) {
    try {
      const data = req.body;
      const result = await this.service.handleIOSWebhook(data);
      return Response.success(res, result);
    } catch (exception) {
      next(exception);
    }
  }

  async handleAndroidWebhook(req, res, next) {
    try {
      const data = req.body;
      const result = await this.service.handleAndroidWebhook(data);
      return Response.success(res, result);
    } catch (exception) {
      next(exception);
    }
  }
}

export default new IapController(iapService, "Iap");
