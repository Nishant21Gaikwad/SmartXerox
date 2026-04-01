import { SignJWT, jwtVerify } from 'npm:jose@5.9.6';
import { env } from './env.ts';

const encoder = new TextEncoder();
const jwtSecretKey = encoder.encode(env.jwtSecret);

type TokenPayload = {
  id?: string;
  email: string;
  role?: 'admin' | 'student';
};

const parseExpiresInToSeconds = (expiresIn: string) => {
  const trimmed = expiresIn.trim().toLowerCase();
  const match = trimmed.match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new Error(`Invalid token expiry format: ${expiresIn}`);
  }

  const value = Number(match[1]);
  const unit = match[2];

  const unitSeconds: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };

  return value * unitSeconds[unit];
};

export const signToken = async (payload: TokenPayload, expiresIn: string) => {
  const expiresAt = Math.floor(Date.now() / 1000) + parseExpiresInToSeconds(expiresIn);

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(jwtSecretKey);
};

export const verifyToken = async (token: string) => {
  const result = await jwtVerify(token, jwtSecretKey);
  return result.payload as TokenPayload;
};

export const getBearerToken = (authorizationHeader: string | null) => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
};
