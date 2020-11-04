import { Service } from '../../helpers/common';
import Configs from './config.model';
import { toNumber } from '../../helpers/utils';

class ConfigService extends Service {
  constructor(model) {
    super(model);
  }

  async listForApp() {
    let data = {};
    let listConfigs = await Configs.find();
    for (let i = 0; i < listConfigs.length; i++) {
      if (
        listConfigs[i].name === 'managesubscriptionlink' &&
        (listConfigs[i].value == 0 || listConfigs[i].value == '')
      ) {
        listConfigs[i].value = null;
      }
      data = { ...data, [listConfigs[i].name]: toNumber(listConfigs[i].value) };
    }

    return data;
  }
}
export default new ConfigService(Configs);
