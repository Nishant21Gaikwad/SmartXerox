import { handleOptions } from '../_shared/cors.ts';
import { badRequest, jsonResponse, serverError, unauthorized } from '../_shared/response.ts';
import { env } from '../_shared/env.ts';
import { signToken } from '../_shared/auth.ts';

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

    if (email !== env.adminEmail.toLowerCase() || password !== env.adminPassword) {
      return unauthorized('Invalid credentials', origin);
    }

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
