import axios from "axios";
import { google } from "googleapis";
import config from "../config";
import { AppError } from "./error";
import { readFileSync } from "fs";
import {
  AppStoreServerAPIClient,
  Environment,
  ReceiptUtility,
  SignedDataVerifier,
  Order,
  ProductType,
  APIException
} from "@apple/app-store-server-library";

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

const issuerId = config.apple.issuerId;
const keyId = config.apple.keyId;
const bundleId = config.apple.bundleId;
const filePath = config.apple.privateKeyFilePath;
const encodedKey = readFileSync(filePath, {
  encoding: "utf8"
}); // Specific implementation may vary
const environment =
  process.env.NODE_ENV === "production"
    ? Environment.PRODUCTION
    : Environment.SANDBOX;

// console.log("=environment===", environment);
// console.log("=environment===", process.env.NODE_ENV);

const enableOnlineChecks = true;
const appAppleId = parseInt(config.apple.appAppleId, 10); // appAppleId is required when the environment is Production
const certs = [
  readFileSync("./certs/AppleIncRootCertificate.cer"),
  readFileSync("./certs/AppleComputerRootCertificate.cer"),
  readFileSync("./certs/AppleRootCA-G2.cer"),
  readFileSync("./certs/AppleRootCA-G3.cer")
];

const client = new AppStoreServerAPIClient(
  encodedKey,
  keyId,
  issuerId,
  bundleId,
  Environment.PRODUCTION
);

const clientSandbox = new AppStoreServerAPIClient(
  encodedKey,
  keyId,
  issuerId,
  bundleId,
  Environment.SANDBOX
);

const verifier = new SignedDataVerifier(
  certs,
  enableOnlineChecks,
  Environment.PRODUCTION,
  bundleId,
  appAppleId
);

const verifierSandbox = new SignedDataVerifier(
  certs,
  enableOnlineChecks,
  Environment.SANDBOX,
  bundleId,
  appAppleId
);

//#region IOS
export const extractTransactionIdFromAppReceipt = appReceipt => {
  const receiptUtil = new ReceiptUtility();
  const transactionId = receiptUtil.extractTransactionIdFromAppReceipt(
    appReceipt
  );
  return transactionId;
};

export const extractTransactionIdFromTransactionReceipt = transactionReceipt => {
  const receiptUtil = new ReceiptUtility();
  const transactionId = receiptUtil.extractTransactionIdFromTransactionReceipt(
    transactionReceipt
  );
  return transactionId;
};

export const sendTestNotification = async () => {
  try {
    await client.requestTestNotification();
  } catch (e) {
    console.error(e);
  }
};

export const getTransactionInfo = async transactionId => {
  try {
    const response = await client.getTransactionInfo(transactionId);
    return response;
  } catch (error) {
    if (
      error instanceof APIException &&
      (error?.apiError === 4040010 || error?.httpStatusCode === 401)
    ) {
      const response = await clientSandbox.getTransactionInfo(transactionId);
      return response;
    }
    throw error;
  }
};

export const getTransactionHistory = async transactionId => {
  const transactionHistoryRequest = {
    sort: Order.DESCENDING,
    revoked: false,
    productTypes: [
      // ProductType.AUTO_RENEWABLE,
      ProductType.CONSUMABLE,
      ProductType.NON_CONSUMABLE,
      ProductType.NON_RENEWABLE
    ]
  };
  let response = null;
  let transactions = [];
  do {
    const revisionToken =
      response !== null && response.revision !== null
        ? response.revision
        : null;
    response = await client.getTransactionHistory(
      transactionId,
      revisionToken,
      transactionHistoryRequest
    );
    if (response.signedTransactions) {
      transactions = transactions.concat(response.signedTransactions);
    }
  } while (response.hasMore);
  return transactions;
};

export const verifyAndDecodeTransaction = async signedTransactionInfo => {
  try {
    const decodedAppTransaction = await verifier.verifyAndDecodeTransaction(
      signedTransactionInfo
    );
    return decodedAppTransaction;
  } catch (error) {
    if (error.status === 2 || error.status === 3) {
      const decodedAppTransaction = await verifierSandbox.verifyAndDecodeTransaction(
        signedTransactionInfo
      );
      return decodedAppTransaction;
    }
    throw error;
  }
};

export const verifyAndDecodeNotification = async signedPayload => {
  try {
    const decodedNotification = await verifier.verifyAndDecodeNotification(
      signedPayload
    );
    return decodedNotification;
  } catch (error) {
    if (error.status === 2 || error.status === 3) {
      const decodedNotification = await verifierSandbox.verifyAndDecodeNotification(
        signedPayload
      );
      return decodedNotification;
    }
    throw error;
  }
};

export const verifyAndDecodeRenewalInfo = async signedRenewalInfo => {
  try {
    const decodedRenewalInfo = await verifier.verifyAndDecodeRenewalInfo(
      signedRenewalInfo
    );
    return decodedRenewalInfo;
  } catch (error) {
    if (error.status === 2 || error.status === 3) {
      const decodedRenewalInfo = await verifierSandbox.verifyAndDecodeRenewalInfo(
        signedRenewalInfo
      );
      return decodedRenewalInfo;
    }
    throw error;
  }
};

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
//#endregion

//#region ANDROID
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

export const getCustomerReviewAndroid = async (
  packageName,
  translationLanguage = "en"
) => {
  const authClient = await auth.getClient();
  google.options({ auth: authClient });
  let reviews = google.androidpublisher({ version: "v3" }).reviews;
  try {
    const reviewsResponse = await reviews.list({
      packageName: packageName,
      translationLanguage: translationLanguage
    });
    return reviewsResponse.data;
  } catch (error) {
    throw new AppError(error);
  }
};
//#endregion
