import { getBearerToken, verifyToken } from '../_shared/auth.ts';
import { handleOptions } from '../_shared/cors.ts';
import { badRequest, forbidden, jsonResponse, notFound, serverError, unauthorized } from '../_shared/response.ts';
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
    const url = new URL(req.url);
    const requestedPhone = url.searchParams.get('phone')?.trim() ?? '';

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

    let phoneToQuery = requestedPhone;

    if (payload.role === 'student') {
      if (!payload.id) {
        return unauthorized('Invalid token payload', origin);
      }

      const { data: student, error: studentError } = await supabaseAdmin
        .from('students')
        .select('phone')
        .eq('id', payload.id)
        .maybeSingle();

      if (studentError) {
        console.error('orders-by-phone student lookup error', studentError);
        return serverError('Failed to resolve student profile', origin);
      }

      if (!student?.phone) {
        return notFound('Student profile not found', origin);
      }

      if (requestedPhone && requestedPhone !== student.phone) {
        return forbidden('You can only fetch your own orders', origin);
      }

      phoneToQuery = student.phone;
    } else if (payload.role === 'admin') {
      if (!/^\d{10}$/.test(phoneToQuery)) {
        return badRequest('A valid 10-digit phone query parameter is required for admin requests', origin);
      }
    } else {
      return forbidden('Access denied', origin);
    }

    if (!/^\d{10}$/.test(phoneToQuery)) {
      return badRequest('Unable to resolve a valid phone number for this request', origin);
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('phone_number', phoneToQuery)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('orders-by-phone error', error);
      return serverError('Failed to fetch orders', origin);
    }

    return jsonResponse({ success: true, data: data ?? [] }, 200, origin);
  } catch (error) {
    console.error('orders-by-phone exception', error);
    return serverError('Internal server error', origin);
  }
});
