import { Service } from "../../helpers/common";
import Iap, { PURCHASE_TYPE, PLATFORM_TYPE, STATUS_TYPE } from "./iap.model";
import logger from "../../services/logger";
import { utils, verifyReceiptHelper } from "../../helpers";

const { parseMillisecond } = utils;
class IapService extends Service {
  constructor() {
    super(Iap);
  }

  async checkIapModel(deviceId) {
    const countIap = await this._model
      .find({
        deviceId: deviceId,
        $or: [{ status: STATUS_TYPE.NEW }, { status: null }]
      })
      .count();
    if (countIap > 0) {
      return true;
    } else {
      return false;
    }
  }

  async verifyIosInAppPurchaseReceipt(data, userId, deviceId) {
    const receiptData = await verifyReceiptHelper.verifyIosInAppReceipt(data);
    logger.info("==== receiptData ==== %o", receiptData);
    const { item, environment } = receiptData;

    const {
      original_transaction_id,
      transaction_id,
      product_id,
      quantity,
      original_purchase_date_ms
    } = item;
    const iapObj = await this._model.findOneAndUpdate(
      {
        original_transaction_id,
        platform: PLATFORM_TYPE.IOS,
        environment
      },
      {
        deviceId,
        user: userId,
        platform: PLATFORM_TYPE.IOS,
        environment,
        product_id: product_id,
        transaction_id,
        original_transaction_id,
        quantity: quantity,
        start_date: parseMillisecond(original_purchase_date_ms),
        purchase_type: PURCHASE_TYPE.PREPAID
      },
      {
        upsert: true,
        new: true
      }
    );
    return iapObj;
  }

  async verifyAndroidInAppReceipt(data, userId, deviceId) {
    const { productId } = data;
    const receiptData = await verifyReceiptHelper.verifyAndroidInAppReceipt(
      data
    );
    // logger.info('==== receiptData ==== %o', receiptData);
    // const { item, environment } = receiptData;

    const { orderId, purchaseTimeMillis } = receiptData;

    const iapObj = await this._model.findOneAndUpdate(
      {
        original_transaction_id: orderId,
        platform: PLATFORM_TYPE.ANDROID
        // environment
      },
      {
        deviceId,
        user: userId,
        platform: PLATFORM_TYPE.ANDROID,
        // environment,
        product_id: productId,
        transaction_id: orderId,
        original_transaction_id: orderId,
        quantity: 1,
        start_date: parseMillisecond(purchaseTimeMillis),
        purchase_type: PURCHASE_TYPE.PREPAID
      },
      {
        upsert: true,
        new: true
      }
    );
    return iapObj;
  }

  async verifyIosSubscriptionReceipt(data, userId, deviceId) {
    // let result = '';
    const receiptData = await verifyReceiptHelper.verifyIosSubscribeReceipt(
      data
    );
    // logger.info("==== RESPONSE SUBSCRIPTION ==== %o", receiptData);
    // if (response.status === 0) {
    // const receipt = response['receipt'];
    const { environment, latest_receipt, item } = receiptData;
    // if (response['latest_receipt_info']) {
    // const latest_receipt_info = response['latest_receipt_info'][0];
    const {
      original_transaction_id,
      transaction_id,
      product_id,
      quantity,
      original_purchase_date_ms,
      expires_date,
      expires_date_ms
    } = item;
    // latest_receipt_info['original_transaction_id'];
    // const transaction_id = latest_receipt_info['transaction_id'];

    const iapObj = await this._model.findOneAndUpdate(
      {
        original_transaction_id,
        platform: PLATFORM_TYPE.IOS,
        environment
      },
      {
        user: userId,
        deviceId,
        platform: PLATFORM_TYPE.IOS,
        environment,
        product_id: product_id,
        transaction_id,
        original_transaction_id,
        quantity: quantity,
        start_date: parseMillisecond(original_purchase_date_ms),
        latest_receipt,
        end_date: expires_date ? parseMillisecond(expires_date_ms) : null,
        purchase_type: expires_date
          ? PURCHASE_TYPE.SUBSCRIPTION
          : PURCHASE_TYPE.PREPAID
      },
      {
        new: true,
        upsert: true
      }
    );
    return iapObj;
  }
}

export default new IapService();
