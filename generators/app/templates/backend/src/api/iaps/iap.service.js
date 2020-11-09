import { Service } from '../../helpers/common';
import Iap, { PURCHASE_TYPE } from './iap.model';
import request from 'request-promise';
import config from '../../config'
import Packages from "../packages/packages.model";
import logger from "../../services/logger";
import { parseMilisecond } from "../../helpers/utils";
import Users from '../users/users.model'
import _ from 'lodash'

class IapService extends Service {
  constructor() {
    super(Iap);
  }

  async verifyReceipt(data) {
    logger.info('======verify_receipt_data========%o', data);
    const options = {
      method: 'POST',
      uri: config.iap.IOS.VERIFY_RECEIPT_PRODUCT_URL,
      body: {
        'receipt-data': data['receipt-data'],
        password: data['password'],
        'exclude-old-transactions': true
      },
      json: true
    };
    try {
      let result = await request(options);
      logger.info('======verify_receipt_ios========%o', result);
      if (result['status'] === 21007) {
        logger.info('======verify_receipt_ios==SANDBOX======');
        options.uri = config.iap.IOS.VERIFY_RECEIPT_SANDBOX_URL;
        result = await request(options);
        logger.info('======verify_receipt_ios==sandbox======%o', result);
      }
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createAndUpdateUserCredit(user, data) {
    let result = '';
    const response = await this.verifyReceipt(data);
    logger.info("==== RESPONSE ==== %o", response)
    if (response.status === 0) {
      const receipt = response['receipt'];
      const environment = response['environment'];
      const latest_receipt = response['latest_receipt']
      if (receipt['in_app']) {
        const in_app = receipt['in_app'][0];
        const original_transaction_id = in_app['original_transaction_id'];
        const transaction_id = in_app['transaction_id'];
        const iapCount = await this._model.findOne({
          original_transaction_id,
          platform: 'IOS',
          environment
        });
        if (!iapCount) {
          const iapObj = new Iap({
            user: user._id,
            platform: 'IOS',
            environment,
            product_id: in_app['product_id'],
            transaction_id,
            original_transaction_id,
            quantity: in_app['quantity'],
            start_date: parseMilisecond(in_app['original_purchase_date_ms']),
            purchase_type: PURCHASE_TYPE.PREPAID,
            latest_receipt
          });
          if (in_app['expires_date']) {
            iapObj['end_date'] = parseMilisecond(in_app['expires_date_ms']);
            iapObj['purchase_type'] = PURCHASE_TYPE.SUBSCRIPTION;
          }
          logger.info('=========storePurchaseObj========%o', iapObj);
          const iap = await iapObj.save();
          result = await Iap.populate(iap, {
            path: 'user'
          });
          return result;
        } else {
          throw new Error('The receipt has not been server!!!');
        }
      }
    }
    else {
      function AppleVerifyErr(message) {
        this.name = 'CustomError'
        this.message = message;
        this.errors = response
      }
      throw new AppleVerifyErr('The receipt is not valid!!!');
    }
  }

  async handleSubscription(user, data) {
    let result = '';
    const response = await this.verifyReceipt(data);
    logger.info("==== RESPONSE SUBSCRIPTION ==== %o", response)
    if (response.status === 0) {
      const receipt = response['receipt'];
      const environment = response['environment'];
      const latest_receipt = response['latest_receipt']
      if (response['latest_receipt_info']) {
        const latest_receipt_info = response['latest_receipt_info'][0];
        const original_transaction_id = latest_receipt_info['original_transaction_id'];
        const transaction_id = latest_receipt_info['transaction_id'];

        const iapCount = await this._model.findOne({
          original_transaction_id,
          platform: 'IOS',
          environment
        });

        if (!iapCount) {
          const iapObj = new Iap({
            user: user._id,
            platform: 'IOS',
            environment,
            product_id: latest_receipt_info['product_id'],
            transaction_id,
            original_transaction_id,
            quantity: latest_receipt_info['quantity'],
            start_date: parseMilisecond(latest_receipt_info['original_purchase_date_ms']),
            purchase_type: PURCHASE_TYPE.PREPAID,
            latest_receipt
          });
          if (latest_receipt_info['expires_date']) {
            iapObj['end_date'] = parseMilisecond(latest_receipt_info['expires_date_ms']);
            iapObj['purchase_type'] = PURCHASE_TYPE.SUBSCRIPTION;
          }
          const iap = await iapObj.save();
          result = await Iap.populate(iap, {
            path: 'user'
          });
          return result;
        } else {
          if (iapCount.user.toString() !== user._id.toString()) {
            await Users.findByIdAndUpdate(iapCount.user, { isPremium: false })
            iapCount.user = user._id

            let packageObj = await Packages.findOne({
              product_id: latest_receipt_info['product_id']
            })

            if (packageObj) {
              user.isPremium = true
              await user.save()
            }
          }

          iapCount.end_date = parseMilisecond(latest_receipt_info['expires_date_ms'])
          iapCount.retry_number = 0

          let iap = await iapCount.save()

          logger.info("==== IAP object ==== %o ", iap)
          result = await Iap.populate(iap, {
            path: 'user'
          });

          logger.info("==== Result object ==== %o ", result)


          return result
        }
      }
    }
    else {
      function AppleVerifyErr(message) {
        this.name = 'CustomError'
        this.message = message;
        this.errors = response
      }
      throw new AppleVerifyErr('The receipt is not valid!!!');
    }
  }
}

export default new IapService();
