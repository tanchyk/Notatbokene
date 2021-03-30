require('dotenv').config();

export const COOKIE_NAME = 'qid';
export const __prod__ = process.env.NODE_ENV === 'production';
export const CLIENT = `${process.env.CORS_ORIGIN}`;
export const FORGET_PASSWORD_PREFIX = 'forget-password';