import { Service } from '../../helpers/common';
import Packages from './packages.model';


class PackagesService extends Service {
  constructor() {
    super(Packages);
  }
}

export default new PackagesService();
