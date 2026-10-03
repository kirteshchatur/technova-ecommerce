import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5001;
export const JWT_SECRET = process.env.JWT_SECRET || 'technova-super-secret-jwt-key-2026-production';
export const JWT_EXPIRES_IN = '7d';
export const NODE_ENV = process.env.NODE_ENV || 'development';
