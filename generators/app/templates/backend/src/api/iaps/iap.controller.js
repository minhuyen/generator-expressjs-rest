import { Controller } from '../../helpers/common';
import iapService from './iap.service';
import { handleResponse as Response } from '../../helpers';

class IapController extends Controller {
  constructor(service, name) {
    super(service, name);

    this.verifyReceipt = this.verifyReceipt.bind(this)
    this.subscription = this.subscription.bind(this)
  }

  async verifyReceipt(req, res, next) {
    try {
      const data = req.body;
      const user = req.user;
      const result = await this.service.createAndUpdateUserCredit(user, data);
      return Response.success(res, result);
    } catch (exception) {
      next(exception);
    }
  }

  async subscription(req, res, next) {
    try {
      const data = req.body;
      const user = req.user;
      const result = await this.service.handleSubscription(user, data);
      return Response.success(res, result);
    } catch (exception) {
      next(exception);
    }
  }
}

export default new IapController(iapService, 'Iap');
