import { Controller } from '../../helpers/common';
import configService from './config.service';
import { handleResponse } from "../../helpers";
import Configs from './config.model'

class ConfigController extends Controller {
  constructor(service, name) {
    super(service, name);

    this.listConfigsForApp = this.listConfigsForApp.bind(this)
  }

  async listConfigsForApp(req, res) {
    let data = await this.service.listForApp()

    return handleResponse.success(res, data)
  }
}

export default new ConfigController(configService, 'Configs');
