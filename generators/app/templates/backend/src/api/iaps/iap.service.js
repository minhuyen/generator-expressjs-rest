import { Service } from "../../helpers/common";
import Iap, { PURCHASE_TYPE, PLATFORM_TYPE } from "./iap.model";
import { utils, verifyReceiptHelper } from "../../helpers";
import InAppPurchaseNotification from "../inAppPurchaseNotifications/inAppPurchaseNotification.model";

const IOS_NOTIFICATION_SUCCESS = ["DID_RENEW", "SUBSCRIBED"];
const IOS_NOTIFICATION_FAILED = [
  "DID_FAIL_TO_RENEW",
  "EXPIRED",
  "GRACE_PERIOD_EXPIRED",
  "REFUND"
];

const ANDROID_NOTIFICATION_SUCCESS = {
  1: "SUBSCRIPTION_RECOVERED",
  2: "SUBSCRIPTION_RENEWED",
  7: "SUBSCRIPTION_RESTARTED"
};
const ANDROID_NOTIFICATION_FAILED = {
  3: "SUBSCRIPTION_CANCELED",
  10: "SUBSCRIPTION_PAUSED",
  12: "SUBSCRIPTION_REVOKED", // Refunding the purchase
  13: "SUBSCRIPTION_EXPIRED"
};
const ANDROID_NOTIFICATION_OTHER = {
  4: "SUBSCRIPTION_PURCHASED",
  5: "SUBSCRIPTION_ON_HOLD",
  6: "SUBSCRIPTION_IN_GRACE_PERIOD",
  8: "SUBSCRIPTION_PRICE_CHANGE_CONFIRMED",
  9: "SUBSCRIPTION_DEFERRED",
  11: "SUBSCRIPTION_PAUSE_SCHEDULE_CHANGED",
  20: "SUBSCRIPTION_PENDING_PURCHASE_CANCELED"
};

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
            purchaseType: { $ne: PURCHASE_TYPE.LIFETIME },
            expiresDate: { $gte: new Date() }
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

  async verifyIOSReceipt(data, userId, deviceId, purchaseType) {
    const { receiptData } = data;
    const extractTransactionId = await verifyReceiptHelper.extractTransactionIdFromAppReceipt(
      receiptData
    );

    const {
      signedTransactionInfo
    } = await verifyReceiptHelper.getTransactionInfo(extractTransactionId);

    const decodeTransaction = await verifyReceiptHelper.verifyAndDecodeTransaction(
      signedTransactionInfo
    );

    const {
      environment,
      originalTransactionId,
      transactionId,
      expiresDate
    } = decodeTransaction;

    let result = null;

    //#region LIFE TIME
    if (purchaseType === PURCHASE_TYPE.LIFETIME) {
      result = await this._model.findOneAndUpdate(
        {
          originalTransactionId,
          platform: PLATFORM_TYPE.IOS,
          environment
        },
        {
          deviceId,
          user: userId,
          transactionIds: [transactionId],
          type: PURCHASE_TYPE.LIFETIME,
          purchaseType: PURCHASE_TYPE.LIFETIME,
          ...decodeTransaction
        },
        {
          upsert: true,
          new: true
        }
      );
    }
    //#endregion

    //#region SUBS
    if (purchaseType === PURCHASE_TYPE.SUBSCRIPTION) {
      result = await this._model.findOne({
        originalTransactionId,
        platform: PLATFORM_TYPE.IOS,
        environment
      });
      if (result) {
        if (result.transactionIds.includes(transactionId) === false) {
          result.transactionIds.push(transactionId);
          Object.assign(result, decodeTransaction);
        }
        // Check if the new expiration date is greater than the old expiration date.
        const currentExpiresDate = new Date(result.expiresDate);
        const newExpiresDate = new Date(expiresDate);
        result.expiresDate =
          newExpiresDate > currentExpiresDate
            ? newExpiresDate
            : currentExpiresDate;
        result.deviceId = deviceId;
        result = await result.save();
      } else {
        result = await this._model.create({
          user: userId,
          platform: PLATFORM_TYPE.IOS,
          deviceId,
          transactionIds: [transactionId],
          type: PURCHASE_TYPE.SUBSCRIPTION,
          purchaseType: PURCHASE_TYPE.SUBSCRIPTION,
          ...decodeTransaction
        });
      }
    }
    //#endregion

    return result;
  }

  async handleIOSWebhook(body) {
    const { signedPayload } = body;
    const decodeNotification = await verifyReceiptHelper.verifyAndDecodeNotification(
      signedPayload
    );

    // Save to notification model
    const { notificationUUID } = decodeNotification;
    await InAppPurchaseNotification.findOneAndUpdate(
      { notificationUUID },
      {
        ...decodeNotification,
        platform: "iOS"
      },
      {
        upsert: true
      }
    );

    // Process notification to handle premium feature
    console.log("===== WEBHOOK: NOTIFICATION IOS =====");
    console.log(decodeNotification);

    const { notificationType, data } = decodeNotification;

    //#region RENEWAL
    if (IOS_NOTIFICATION_SUCCESS.includes(notificationType)) {
      const { signedTransactionInfo } = data;
      const decodeTransaction = await verifyReceiptHelper.verifyAndDecodeTransaction(
        signedTransactionInfo
      );

      console.log("===== RENEW =====");
      console.log(decodeTransaction);

      const {
        transactionId,
        environment,
        originalTransactionId,
        expiresDate
      } = decodeTransaction;

      // Update iap
      const iap = await this._model.findOne({
        originalTransactionId,
        platform: PLATFORM_TYPE.IOS,
        environment
      });

      if (iap === null) return;

      if (iap.transactionIds.includes(transactionId) === false) {
        iap.transactionIds.push(transactionId);
        Object.assign(iap, decodeTransaction);
      }

      // Check if the new expiration date is greater than the old expiration date.
      const currentExpiresDate = new Date(iap.expiresDate);
      const newExpiresDate = new Date(expiresDate);
      iap.expiresDate =
        newExpiresDate > currentExpiresDate
          ? newExpiresDate
          : currentExpiresDate;
      await iap.save();
    }
    //#endregion

    //#region EXPIRED, RENEW_FAIL
    if (IOS_NOTIFICATION_FAILED.includes(notificationType)) {
      const { signedTransactionInfo } = data;
      const decodeTransaction = await verifyReceiptHelper.verifyAndDecodeTransaction(
        signedTransactionInfo
      );

      console.log("===== EXPIRED, RENEW_FAIL,... =====");
      console.log(decodeTransaction);

      const {
        environment,
        transactionId,
        originalTransactionId
      } = decodeTransaction;

      // Update iap
      const iap = await this._model.findOne({
        originalTransactionId,
        platform: PLATFORM_TYPE.IOS,
        environment
      });

      if (iap === null) return;

      if (iap.transactionIds.includes(transactionId) === false) {
        iap.transactionIds.push(transactionId);
        Object.assign(iap, decodeTransaction);
      }
      iap.expiresDate = new Date();
      iap.reason = notificationType;

      await iap.save();

      // Handling when expired
    }
    //#endregion
    return;
  }

  async verifyAndroidInAppReceipt(data, userId, deviceId) {
    const { productId } = data;
    const receiptData = await verifyReceiptHelper.verifyAndroidInAppReceipt(
      data
    );
    const { orderId } = receiptData;

    const iapObj = await this._model.findOneAndUpdate(
      {
        originalTransactionId: orderId,
        platform: PLATFORM_TYPE.ANDROID
      },
      {
        deviceId,
        user: userId,
        platform: PLATFORM_TYPE.ANDROID,
        productId: productId,
        transactionIds: [orderId],
        originalTransactionId: orderId,
        quantity: 1,
        type: PURCHASE_TYPE.LIFETIME,
        purchaseType: PURCHASE_TYPE.LIFETIME
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
    const { orderId, startTimeMillis, expiryTimeMillis, kind } = receiptData;
    const originalTransactionId = orderId.split("..")[0];

    let iapObj = await this._model.findOne({
      originalTransactionId: originalTransactionId,
      platform: PLATFORM_TYPE.ANDROID
    });
    if (iapObj) {
      if (iapObj.transactionIds.includes(orderId) === false) {
        iapObj.transactionIds.push(orderId);
      }
      // Check if the new expiration date is greater than the old expiration date.
      const currentExpiresDate = new Date(iapObj.expiresDate);
      const newExpiresDate = new Date(Number(expiryTimeMillis));
      iapObj.expiresDate =
        newExpiresDate > currentExpiresDate
          ? newExpiresDate
          : currentExpiresDate;
      iapObj.deviceId = deviceId;
      iapObj = await iapObj.save();
    } else {
      iapObj = await this._model.create({
        user: userId,
        deviceId,
        platform: PLATFORM_TYPE.ANDROID,
        productId: subscriptionId,
        transactionIds: [orderId],
        originalTransactionId: originalTransactionId,
        quantity: 1,
        purchaseDate: startTimeMillis,
        expiresDate: expiryTimeMillis,
        type: PURCHASE_TYPE.SUBSCRIPTION,
        subscriptionGroupIdentifier: kind,
        purchaseType: PURCHASE_TYPE.SUBSCRIPTION
      });
    }
    return iapObj;
  }

  async handleAndroidWebhook(body) {
    console.log("===== WEBHOOK: NOTIFICATION ANDROID =====");
    console.log("===== RECEIVE DATA =====");
    console.log(body);
    // Decode the Base64
    console.log("===== DECODE DATA =====");
    const { data, messageId } = body.message;
    const decodedData = Buffer.from(data, "base64").toString("utf-8");
    const jsonDecodedData = JSON.parse(decodedData);
    console.log(jsonDecodedData);

    const { subscriptionNotification, packageName } = jsonDecodedData;
    const {
      version,
      notificationType,
      purchaseToken,
      subscriptionId
    } = subscriptionNotification;

    // Save to notification model
    await InAppPurchaseNotification.findOneAndUpdate(
      { notificationUUID: messageId },
      {
        platform: PLATFORM_TYPE.ANDROID,
        version,
        notificationType:
          ANDROID_NOTIFICATION_SUCCESS[notificationType] ||
          ANDROID_NOTIFICATION_FAILED[notificationType] ||
          ANDROID_NOTIFICATION_OTHER[notificationType],
        data: subscriptionNotification
      },
      {
        upsert: true
      }
    );

    //#region RENEWAL
    if (ANDROID_NOTIFICATION_SUCCESS[notificationType]) {
      console.log("===== RENEW =====");
      const receiptData = await verifyReceiptHelper.verifyAndroidSubReceipt({
        packageName,
        purchaseToken,
        subscriptionId
      });
      console.log(receiptData);

      const { orderId, expiryTimeMillis } = receiptData;
      const originalTransactionId = orderId.split("..")[0];

      // Update iap
      const iap = await this._model.findOne({
        originalTransactionId,
        platform: PLATFORM_TYPE.ANDROID
      });

      if (iap === null) return;

      if (iap.transactionIds.includes(orderId) === false) {
        iap.transactionIds.push(orderId);
      }

      // Check if the new expiration date is greater than the old expiration date.
      const currentExpiresDate = new Date(iap.expiresDate);
      const newExpiresDate = new Date(Number(expiryTimeMillis));
      iap.expiresDate =
        newExpiresDate > currentExpiresDate
          ? newExpiresDate
          : currentExpiresDate;
      await iap.save();
    }
    //#endregion

    //#region EXPIRED, RENEW_FAIL
    if (ANDROID_NOTIFICATION_FAILED[notificationType]) {
      console.log("===== EXPIRED, RENEW_FAIL,... =====");
      const receiptData = await verifyReceiptHelper.verifyAndroidSubReceipt({
        packageName,
        purchaseToken,
        subscriptionId
      });
      console.log(receiptData);

      const { orderId } = receiptData;
      const originalTransactionId = orderId.split("..")[0];

      // Update iap
      const iap = await this._model.findOne({
        originalTransactionId,
        platform: PLATFORM_TYPE.ANDROID
      });

      if (iap === null) return;

      if (iap.transactionIds.includes(orderId) === false) {
        iap.transactionIds.push(orderId);
      }
      iap.expiresDate = new Date();
      iap.reason = ANDROID_NOTIFICATION_FAILED[notificationType];

      await iap.save();

      // Handling when expired
    }
    //#endregion
    return;
  }
}

export default new IapService();
