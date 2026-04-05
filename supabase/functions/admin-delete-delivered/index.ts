import { getBearerToken, verifyToken } from '../_shared/auth.ts';
import { handleOptions } from '../_shared/cors.ts';
import { forbidden, jsonResponse, serverError, unauthorized } from '../_shared/response.ts';
import { env } from '../_shared/env.ts';
import { supabaseAdmin } from '../_shared/supabase.ts';

type DeliveredOrder = {
  id: string;
  file_path: string | null;
};

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');

  if (req.method === 'OPTIONS') {
    return handleOptions(origin);
  }

  if (req.method !== 'DELETE') {
    return jsonResponse({ success: false, message: 'Method not allowed' }, 405, origin);
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

    const { data: deliveredOrders, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('id, file_path')
      .eq('status', 'Delivered');

    if (fetchError) {
      console.error('admin-delete-delivered fetch error', fetchError);
      return serverError('Failed to fetch delivered orders', origin);
    }

    const orders = (deliveredOrders ?? []) as DeliveredOrder[];
    if (orders.length === 0) {
      return jsonResponse({
        success: true,
        message: 'No delivered orders found to delete',
        data: { deletedOrders: 0, deletedFiles: 0 },
      }, 200, origin);
    }

    const filePaths = orders
      .map((order) => order.file_path)
      .filter((filePath): filePath is string => Boolean(filePath));

    if (filePaths.length > 0) {
      const { error: storageError } = await supabaseAdmin
        .storage
        .from(env.storageBucket)
        .remove(filePaths);

      if (storageError) {
        console.error('admin-delete-delivered storage error', storageError);
      }
    }

    const orderIds = orders.map((order) => order.id);
    const { error: deleteError } = await supabaseAdmin
      .from('orders')
      .delete()
      .in('id', orderIds);

    if (deleteError) {
      console.error('admin-delete-delivered delete error', deleteError);
      return serverError('Failed to delete delivered orders', origin);
    }

    return jsonResponse({
      success: true,
      message: `${orderIds.length} delivered order(s) deleted successfully`,
      data: {
        deletedOrders: orderIds.length,
        deletedFiles: filePaths.length,
      },
    }, 200, origin);
  } catch (error) {
    console.error('admin-delete-delivered exception', error);
    return serverError('Internal server error', origin);
  }
});
