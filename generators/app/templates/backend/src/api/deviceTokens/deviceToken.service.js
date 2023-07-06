import { Service } from "../../helpers/common";
import DeviceToken from "./deviceToken.model";

class DeviceTokenService extends Service {
  constructor() {
    super(DeviceToken);
    this.createOrUpdate = this.createOrUpdate.bind(this);
  }

  async createOrUpdate(deviceId, update) {
    const result = await this._model.findOneAndUpdate({ deviceId }, update, {
      new: true,
      upsert: true
    });
    return result;
  }
}

export default new DeviceTokenService();
