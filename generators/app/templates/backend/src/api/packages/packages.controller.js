import { Controller } from '../../helpers/common';
import packagesService from './packages.service';
import { handleResponse as Response } from '../../helpers';

class PackagesController extends Controller {
  constructor(service, name) {
    super(service, name);
  }
}

export default new PackagesController(packagesService, 'Packages');
