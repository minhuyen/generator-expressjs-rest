import moment from "moment";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import client from "../services/redis";

export const randomInt = (low, high) => {
  return Math.floor(Math.random() * (high - low) + low);
};

export const randomVerifiedCode = () => {
  return randomInt(100000, 999999);
};

export const toNumber = string => {
  return Number(string) || string === "0" ? Number(string) : string;
};

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const parseMillisecond = ms => moment(parseInt(ms));

export const decodeToken = async token => {
  const decoded = jwt.decode(token, { complete: true });
  const { kid, alg } = decoded.header;
  const client = jwksClient({
    jwksUri: "https://appleid.apple.com/auth/keys",
    requestHeaders: {}, // Optional
    timeout: 30000 // Defaults to 30s
  });
  const key = await client.getSigningKey(kid);
  const signingKey = key.getPublicKey() || key.rsaPublicKey();
  return jwt.verify(token, signingKey, { algorithms: alg });
};

export const getDeviceId = req => {
  const deviceId = req.headers["device-id"] || req.params.deviceId || "NONE";
  return deviceId;
};

export const generateOtp = async email => {
  const otp = randomVerifiedCode();

  await Promise.all([
    client.set(`${email}_otp`, otp, {
      EX: 30,
      NX: false
    }),
    client.set(`${email}_attempts`, 0, {
      EX: 30,
      NX: false
    })
  ]);

  return otp;
};

export const compareOtp = async (email, otpRequest) => {
  const [numAttempts, otpStored] = await Promise.all([
    client.incr(`${email}_attempts`),
    client.get(`${email}_otp`)
  ]);

  if (!numAttempts || !otpStored) return false;

  if (parseInt(numAttempts) > 3) {
    console.log("Deleting OTP due to 3 failed attempts");
    await Promise.all([
      client.del(`${email}_otp`),
      client.del(`${email}_attempts`)
    ]);

    return false;
  }

  if (parseInt(otpStored) !== parseInt(otpRequest)) {
    return false;
  }

  await Promise.all([
    client.del(`${email}_otp`),
    client.del(`${email}_attempts`)
  ]);

  return true;
};

