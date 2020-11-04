import moment from 'moment'
import jwttoken from 'jsonwebtoken'

export const randomInt = (low, high) => {
  return Math.floor(Math.random() * (high - low) + low);
};

export const randomVerfiedCode = () => {
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

export const decodeToken = function (token) {
  return jwttoken.decode(token)
}
