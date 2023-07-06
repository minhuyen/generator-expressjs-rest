import { Controller } from "../../helpers/common";
import deviceTokenService from "./deviceToken.service";
import { handleResponse as Response, utils, pushToken } from "../../helpers";

class DeviceTokenController extends Controller {
  constructor(service, name) {
    super(service, name);
  }

  async create(req, res, next) {
    try {
      const data = req.body;
      const deviceId = utils.getDeviceId(req);
      const user = req.user;
      const result = await this.service.createOrUpdate(deviceId, {
        ...data,
        deviceId,
        user
      });
      return Response.success(res, result);
    } catch (exception) {
      next(exception);
    }
  }

  async sendNotification(req, res, next) {
    try {
      const data = req.body;
      const result = await pushToken.sendNotificationToDeviceToken(data);
      return Response.success(res, result);
    } catch (exception) {
      next(exception);
    }
  }
  async sendNotificationByDeviceId(req, res, next) {
    try {
      const data = req.body;
      const result = await pushToken.sendNotificationToDeviceId(data);
      return Response.success(res, result);
    } catch (exception) {
      next(exception);
    }
  }
}

export default new DeviceTokenController(deviceTokenService, "DeviceToken");
