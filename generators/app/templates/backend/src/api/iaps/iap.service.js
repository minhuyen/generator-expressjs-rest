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
        $or: [
          { purchaseType: PURCHASE_TYPE.LIFETIME },
          {
            purchaseType: PURCHASE_TYPE.SUBSCRIPTION,
            endDate: { $gte: new Date() }
          }
        ]
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
    // logger.info("==== receiptData ==== %o", receiptData);
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
        originalTransactionId: original_transaction_id,
        platform: PLATFORM_TYPE.IOS,
        environment
      },
      {
        deviceId,
        user: userId,
        platform: PLATFORM_TYPE.IOS,
        environment,
        productId: product_id,
        transactionId: transaction_id,
        originalTransactionId: original_transaction_id,
        quantity: quantity,
        startDate: parseMillisecond(original_purchase_date_ms),
        purchaseType: PURCHASE_TYPE.PREPAID
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

    const { orderId, purchaseTimeMillis } = receiptData;

    const originalTransactionId = orderId.split("..")[0];

    const iapObj = await this._model.findOneAndUpdate(
      {
        originalTransactionId: originalTransactionId,
        platform: PLATFORM_TYPE.ANDROID
      },
      {
        deviceId,
        user: userId,
        platform: PLATFORM_TYPE.ANDROID,
        productId: productId,
        transactionId: orderId,
        originalTransactionId: originalTransactionId,
        quantity: 1,
        startDate: parseMillisecond(purchaseTimeMillis),
        purchaseType: PURCHASE_TYPE.PREPAID
      },
      {
        upsert: true,
        new: true
      }
    );
    return iapObj;
  }

  async verifyAndroidSubReceipt(data, userId, deviceId) {
    const { subscriptionId } = data;
    const receiptData = await verifyReceiptHelper.verifyAndroidSubReceipt(data);
    logger.info("==== receiptData ==== %o", receiptData);

    const { orderId, startTimeMillis, expiryTimeMillis1 } = receiptData;

    const iapObj = await this._model.findOneAndUpdate(
      {
        originalTransactionId: orderId,
        platform: PLATFORM_TYPE.ANDROID
      },
      {
        deviceId,
        user: userId,
        platform: PLATFORM_TYPE.ANDROID,
        productId: subscriptionId,
        transactionId: orderId,
        originalTransactionId: orderId,
        quantity: 1,
        startDate: parseMillisecond(startTimeMillis),
        endDate: parseMillisecond(expiryTimeMillis),
        purchaseType: PURCHASE_TYPE.SUBSCRIPTION
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
    const { environment, latest_receipt, item } = receiptData;
    const {
      original_transaction_id,
      transaction_id,
      product_id,
      quantity,
      original_purchase_date_ms,
      expires_date,
      expires_date_ms
    } = item;

    const iapObj = await this._model.findOneAndUpdate(
      {
        originalTransactionId: original_transaction_id,
        platform: PLATFORM_TYPE.IOS,
        environment
      },
      {
        user: userId,
        deviceId,
        platform: PLATFORM_TYPE.IOS,
        environment,
        productId: product_id,
        transactionId: transaction_id,
        originalTransactionId: original_transaction_id,
        quantity: quantity,
        startDate: parseMillisecond(original_purchase_date_ms),
        latest_receipt,
        endDate: expires_date ? parseMillisecond(expires_date_ms) : null,
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
