import { getBearerToken, verifyToken } from '../_shared/auth.ts';
import { handleOptions } from '../_shared/cors.ts';
import { badRequest, forbidden, jsonResponse, notFound, serverError, unauthorized } from '../_shared/response.ts';
import { supabaseAdmin } from '../_shared/supabase.ts';

const validStatuses = ['In Queue', 'Printing', 'Ready', 'Delivered'];

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');

  if (req.method === 'OPTIONS') {
    return handleOptions(origin);
  }

  if (req.method !== 'PUT') {
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

    const body = await req.json();
    const id = String(body?.id ?? '').trim();
    const status = String(body?.status ?? '').trim();

    if (!id || !status) {
      return badRequest('id and status are required', origin);
    }

    if (!validStatuses.includes(status)) {
      return badRequest(`Status must be one of: ${validStatuses.join(', ')}`, origin);
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('admin-order-status error', error);
      return serverError('Failed to update order status', origin);
    }

    if (!data) {
      return notFound('Order not found', origin);
    }

    return jsonResponse({
      success: true,
      message: 'Order status updated successfully',
      data,
    }, 200, origin);
  } catch (error) {
    console.error('admin-order-status exception', error);
    return serverError('Internal server error', origin);
  }
});
