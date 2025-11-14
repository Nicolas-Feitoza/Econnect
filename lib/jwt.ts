import jwt, { Secret } from 'jsonwebtoken';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  type: 'PRODUCER' | 'COMPANY' | 'ADMIN';
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: JWT_EXPIRATION });
}

export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET as string) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export function extractToken(authHeader?: string): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}
