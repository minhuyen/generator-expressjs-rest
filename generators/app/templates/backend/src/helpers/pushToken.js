import admin from "firebase-admin";

export const sendNotificationToIosDevice = async ({ token, title, body }) => {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
  const ios = {
    headers: {
      "apns-priority": 10,
      "apns-expiration": 360000
    },
    payload: {
      aps: {
        alert: {
          title: title,
          body: body
        },
        badge: 1,
        sound: "default"
      }
    }
  };
  let message = {
    apns: ios,
    token: token
  };
  const response = await admin.messaging().send(message);
  return response;
};

export const sendNotificationToDevice = async ({
  token,
  title,
  body,
  data = {}
}) => {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
  const android = {
    notification: {
      title: title,
      body: body
    }
  };

  const apns = {
    payload: {
      aps: {
        alert: {
          title: title,
          body: body
        },
        badge: 1,
        sound: "default"
      }
    }
  };

  const message = {
    notification: {
      title: title,
      body: body
    },
    data: data,
    android: android,
    apns: apns,
    token: token
  };
  try {
    const response = await admin.messaging().send(message);
    return response;
  } catch (error) {
    console.error(error);
  }
};
