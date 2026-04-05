import { handleOptions } from '../_shared/cors.ts';
import { badRequest, jsonResponse, serverError, unauthorized } from '../_shared/response.ts';
import { env } from '../_shared/env.ts';
import { signToken } from '../_shared/auth.ts';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const BLOCK_MS = 15 * 60 * 1000;

type AttemptState = {
  count: number;
  windowStartedAt: number;
  blockedUntil: number;
};

const attemptsByKey = new Map<string, AttemptState>();

const getClientIp = (req: Request) => {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (forwarded) {
    return forwarded;
  }

  const cfIp = req.headers.get('cf-connecting-ip')?.trim();
  if (cfIp) {
    return cfIp;
  }

  return 'unknown';
};

const getAttemptKey = (req: Request, email: string) => `${getClientIp(req)}:${email}`;

const getRemainingBlockMs = (key: string, now: number) => {
  const state = attemptsByKey.get(key);
  if (!state) {
    return 0;
  }

  if (state.blockedUntil > now) {
    return state.blockedUntil - now;
  }

  if (state.windowStartedAt + WINDOW_MS <= now) {
    attemptsByKey.delete(key);
  }

  return 0;
};

const registerFailedAttempt = (key: string, now: number) => {
  const current = attemptsByKey.get(key);

  if (!current || current.windowStartedAt + WINDOW_MS <= now) {
    attemptsByKey.set(key, {
      count: 1,
      windowStartedAt: now,
      blockedUntil: 0,
    });
    return;
  }

  const nextCount = current.count + 1;
  const shouldBlock = nextCount >= MAX_ATTEMPTS;
  attemptsByKey.set(key, {
    count: shouldBlock ? 0 : nextCount,
    windowStartedAt: shouldBlock ? now : current.windowStartedAt,
    blockedUntil: shouldBlock ? now + BLOCK_MS : 0,
  });
};

const clearAttemptState = (key: string) => {
  attemptsByKey.delete(key);
};

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');

  if (req.method === 'OPTIONS') {
    return handleOptions(origin);
  }

  if (req.method !== 'POST') {
    return badRequest('Method not allowed', origin);
  }

  try {
    const body = await req.json();
    const email = String(body?.email ?? '').trim().toLowerCase();
    const password = String(body?.password ?? '');

    if (!email || !password) {
      return badRequest('Email and password are required', origin);
    }

    const now = Date.now();
    const attemptKey = getAttemptKey(req, email);
    const remainingBlockMs = getRemainingBlockMs(attemptKey, now);
    if (remainingBlockMs > 0) {
      console.warn('admin-login temporarily blocked', { email, ip: getClientIp(req) });
      const remainingMinutes = Math.ceil(remainingBlockMs / 60000);
      return unauthorized(`Too many failed attempts. Try again in ${remainingMinutes} minute(s).`, origin);
    }

    if (email !== env.adminEmail.toLowerCase() || password !== env.adminPassword) {
      console.warn('admin-login failed attempt', { email, ip: getClientIp(req) });
      registerFailedAttempt(attemptKey, now);
      return unauthorized('Invalid credentials', origin);
    }

    clearAttemptState(attemptKey);

    const token = await signToken({ email, role: 'admin' }, '24h');

    return jsonResponse({
      success: true,
      message: 'Login successful',
      data: { token, email, role: 'admin' },
    }, 200, origin);
  } catch (error) {
    console.error('admin-login error', error);
    return serverError('Internal server error', origin);
  }
});
