import { getBearerToken, verifyToken } from '../_shared/auth.ts';
import { handleOptions } from '../_shared/cors.ts';
import { badRequest, jsonResponse, notFound, serverError, unauthorized } from '../_shared/response.ts';
import { supabaseAdmin } from '../_shared/supabase.ts';

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');

  if (req.method === 'OPTIONS') {
    return handleOptions(origin);
  }

  if (req.method !== 'GET') {
    return badRequest('Method not allowed', origin);
  }

  try {
    const token = getBearerToken(req.headers.get('authorization'));
    if (!token) {
      return unauthorized('Authentication required', origin);
    }

    let payload;
    try {
      payload = await verifyToken(token);
    } catch {
      return unauthorized('Invalid or expired token', origin);
    }

    if (!payload.id) {
      return unauthorized('Invalid token payload', origin);
    }

    const { data: user, error } = await supabaseAdmin
      .from('students')
      .select('id, name, email, phone, created_at')
      .eq('id', payload.id)
      .maybeSingle();

    if (error) {
      return serverError('Failed to fetch profile', origin);
    }

    if (!user) {
      return notFound('User not found', origin);
    }

    return jsonResponse({ success: true, user }, 200, origin);
  } catch (error) {
    console.error('auth-profile error', error);
    return serverError('Server error fetching profile', origin);
  }
});
