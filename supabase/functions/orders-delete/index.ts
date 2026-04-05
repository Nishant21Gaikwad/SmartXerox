import { getBearerToken, verifyToken } from '../_shared/auth.ts';
import { handleOptions } from '../_shared/cors.ts';
import { badRequest, forbidden, jsonResponse, notFound, serverError, unauthorized } from '../_shared/response.ts';
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

    const isAdmin = payload.role === 'admin';
    const isStudent = payload.role === 'student';

    if (!isAdmin && !isStudent) {
      return forbidden('Access denied', origin);
    }

    let studentPhone: string | null = null;
    if (isStudent) {
      if (!payload.id) {
        return unauthorized('Invalid token payload', origin);
      }

      const { data: student, error: studentError } = await supabaseAdmin
        .from('students')
        .select('phone')
        .eq('id', payload.id)
        .maybeSingle();

      if (studentError) {
        console.error('orders-delete student lookup error', studentError);
        return serverError('Failed to resolve student profile', origin);
      }

      if (!student?.phone) {
        return notFound('Student profile not found', origin);
      }

      studentPhone = student.phone;
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id')?.trim() ?? '';

    if (!id) {
      return badRequest('Order id is required', origin);
    }

    const { data: order, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('id, file_path, phone_number')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      console.error('fetch order error', fetchError);
      return serverError('Failed to fetch order', origin);
    }

    if (!order) {
      return notFound('Order not found', origin);
    }

    if (isStudent && order.phone_number !== studentPhone) {
      return forbidden('You can only delete your own orders', origin);
    }

    if (order.file_path) {
      await supabaseAdmin.storage
        .from(env.storageBucket)
        .remove([order.file_path]);
    }

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
