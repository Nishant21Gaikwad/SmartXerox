import { handleOptions } from '../_shared/cors.ts';
import { badRequest, jsonResponse, serverError } from '../_shared/response.ts';
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
    const phone = url.searchParams.get('phone')?.trim() ?? '';

    if (!/^\d{10}$/.test(phone)) {
      return badRequest('A valid 10-digit phone query parameter is required', origin);
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('phone_number', phone)
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
