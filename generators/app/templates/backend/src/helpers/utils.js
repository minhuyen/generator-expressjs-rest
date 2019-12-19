export const randomInt = (low, high) => {
  return Math.floor(Math.random() * (high - low) + low);
};

export const randomVerfiedCode = () => {
  return randomInt(100000, 999999);
};
