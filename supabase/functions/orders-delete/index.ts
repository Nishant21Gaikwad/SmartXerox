import { handleOptions } from '../_shared/cors.ts';
import { badRequest, jsonResponse, notFound, serverError } from '../_shared/response.ts';
import { env } from '../_shared/env.ts';
import { supabaseAdmin } from '../_shared/supabase.ts';

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');

  if (req.method === 'OPTIONS') {
    return handleOptions(origin);
  }

  if (req.method !== 'DELETE') {
    return badRequest('Method not allowed', origin);
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id')?.trim() ?? '';

    if (!id) {
      return badRequest('Order id is required', origin);
    }

    const { data: order, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('id, file_path')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      console.error('fetch order error', fetchError);
      return serverError('Failed to fetch order', origin);
    }

    if (!order) {
      return notFound('Order not found', origin);
    }

    await supabaseAdmin.storage
      .from(env.storageBucket)
      .remove([order.file_path]);

    const { error: deleteError } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('delete order error', deleteError);
      return serverError('Failed to delete order', origin);
    }

    return jsonResponse({ success: true, message: 'Order deleted successfully' }, 200, origin);
  } catch (error) {
    console.error('orders-delete exception', error);
    return serverError('Internal server error', origin);
  }
});
