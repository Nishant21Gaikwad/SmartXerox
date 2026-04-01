import { getBearerToken, verifyToken } from '../_shared/auth.ts';
import { handleOptions } from '../_shared/cors.ts';
import { badRequest, forbidden, jsonResponse, serverError, unauthorized } from '../_shared/response.ts';
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

    if (payload.role !== 'admin') {
      return forbidden('Admin access required', origin);
    }

    const url = new URL(req.url);
    const status = url.searchParams.get('status')?.trim();

    let query = supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('admin-orders error', error);
      return serverError('Failed to fetch orders', origin);
    }

    return jsonResponse({ success: true, data: data ?? [] }, 200, origin);
  } catch (error) {
    console.error('admin-orders exception', error);
    return serverError('Internal server error', origin);
  }
});
