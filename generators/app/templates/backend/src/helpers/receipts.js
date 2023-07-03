import axios from "axios";
import { google } from "googleapis";
import config from "../config";
import logger from "../services/logger";
import { AppError } from "./error";

const IOS_RECEIPT_STATUS = {
  "21000":
    "The request to the App Store didn’t use the HTTP POST request method.",
  "21001": "The App Store no longer sends this status code.",

  "21002":
    "The data in the receipt-data property is malformed or the service experienced a temporary issue. Try again.",

  "21003": "The system couldn’t authenticate the receipt.",

  "21004":
    "The shared secret you provided doesn’t match the shared secret on file for your account.",

  "21005":
    "The receipt server was temporarily unable to provide the receipt. Try again.",
  "21006":
    "This receipt is valid, but the subscription is in an expired state. When your server receives this status code, the system also decodes and returns receipt data as part of the response. This status only returns for iOS 6-style transaction receipts for auto-renewable subscriptions.",
  "21007":
    "This receipt is from the test environment, but you sent it to the production environment for verification.",
  "21008":
    "This receipt is from the production environment, but you sent it to the test environment for verification.",
  "21009": "Internal data access error. Try again later.",
  "21010":
    "The system can’t find the user account or the user account has been deleted."
};

const auth = new google.auth.GoogleAuth({
  // keyFile: '/path/to/your-secret-key.json',
  scopes: ["https://www.googleapis.com/auth/androidpublisher"]
});

export const verifyIosReceipt = async data => {
  // logger.info("======verify_receipt_data========%o", data);
  const { receiptData, password } = data;
  const options = {
    method: "post",
    url: config.iap.IOS.VERIFY_RECEIPT_URL,
    data: {
      "receipt-data": receiptData,
      password: password,
      "exclude-old-transactions": true
    }
  };
  try {
    let response = await axios(options);
    let result = response.data;
    // logger.info("======verify_receipt_ios========%o", result);
    if (result["status"] === 21007) {
      // logger.info("======verify_receipt_ios==SANDBOX======");
      options.url = config.iap.IOS.SANDBOX_VERIFY_RECEIPT_URL;
      response = await axios(options);
      result = response.data;
      // logger.info("======verify_receipt_ios==sandbox======%o", result);
    }
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const verifyIosSubscribeReceipt = async data => {
  // logger.info("======verify_receipt_data========%o", data);
  const receiptData = await verifyIosReceipt(data);
  const {
    status,
    environment,
    latest_receipt,
    latest_receipt_info
  } = receiptData;
  if (status === 0) {
    // const latestReceiptInfo = latest_receipt['latest_receipt_info'];
    latest_receipt_info.sort((a, b) => {
      return a.purchase_date_ms - b.purchase_date_ms;
    });
    const item = latest_receipt_info.pop();
    return { environment, item, latest_receipt };
  } else {
    const message = IOS_RECEIPT_STATUS[`${status}`];
    throw new AppError(message, status);
  }
};

export const verifyIosInAppReceipt = async data => {
  const receiptData = await verifyIosReceipt(data);
  const { status, environment, receipt } = receiptData;
  if (status === 0) {
    const inApps = receipt["in_app"];
    inApps.sort((a, b) => {
      return a.purchase_date_ms - b.purchase_date_ms;
    });
    const item = inApps.pop();
    return { environment, item };
  } else {
    const message = IOS_RECEIPT_STATUS[`${status}`];
    throw new AppError(message, status);
  }
};

export const verifyAndroidInAppReceipt = async data => {
  // console.log('=====verifyAndroidReceipt=====', data);
  const { packageName, productId, purchaseToken } = data;
  const authClient = await auth.getClient();
  google.options({ auth: authClient });
  let purchaseResponse = {};
  let purchases = google.androidpublisher({ version: "v3" }).purchases;
  try {
    //products
    purchaseResponse = await purchases.products.get({
      packageName: packageName,
      productId: productId,
      token: purchaseToken
    });
    // console.log('purchaseResponse: ', purchaseResponse);
    return purchaseResponse.data;
  } catch (error) {
    // console.log("purchaseResponse error: ", error);
    throw new Error(error);
  }
};

export const verifyAndroidSubReceipt = async data => {
  // console.log('=====verifyAndroidReceipt=====', data);
  const { packageName, subscriptionId, purchaseToken } = data;
  const authClient = await auth.getClient();
  google.options({ auth: authClient });
  let purchaseResponse = {};
  let purchases = google.androidpublisher({ version: "v3" }).purchases;
  try {
    //products
    purchaseResponse = await purchases.subscriptions.get({
      packageName: packageName,
      subscriptionId: subscriptionId,
      token: purchaseToken
    });
    // console.log('purchaseResponse: ', purchaseResponse);
    return purchaseResponse.data;
  } catch (error) {
    // console.log("purchaseResponse error: ", error);
    throw new Error(error);
  }
};
