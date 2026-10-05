import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (payload: object, expiresIn: string = '1h') => {
  const secret = process.env.JWT_SECRET || 'secret';
  return jwt.sign(payload, secret, { expiresIn: expiresIn as any });
};

export const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET || 'secret';
  return jwt.verify(token, secret);
};
