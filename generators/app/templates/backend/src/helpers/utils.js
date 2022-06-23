import moment from 'moment';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

export const randomInt = (low, high) => {
  return Math.floor(Math.random() * (high - low) + low);
};

export const randomVerifiedCode = () => {
  return randomInt(100000, 999999);
};

export const toNumber = (string) => {
  return Number(string) || string === '0' ? Number(string) : string
}

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export const parseMilisecond = ms => moment(parseInt(ms))

export const decodeToken = async (token) => {
  const decoded = jwt.decode(token, {complete: true});
  const { kid, alg } = decoded.header;
  const client = jwksClient({
    jwksUri: 'https://appleid.apple.com/auth/keys',
    requestHeaders: {}, // Optional
    timeout: 30000 // Defaults to 30s
  });
  const key = await client.getSigningKey(kid);
  const signingKey = key.getPublicKey() || key.rsaPublicKey();
  return jwt.verify(token, signingKey, {algorithms: alg})
}
