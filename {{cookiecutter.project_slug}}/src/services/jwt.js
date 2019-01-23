import jwt from 'jsonwebtoken';

export const sign = uid => {
  const token = jwt.sign({ uid: uid }, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24 * 30
  });
  return token;
};
