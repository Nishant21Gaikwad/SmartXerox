import { getBearerToken, verifyToken } from '../_shared/auth.ts';
import { handleOptions } from '../_shared/cors.ts';
import { badRequest, forbidden, jsonResponse, serverError, unauthorized } from '../_shared/response.ts';
import { supabaseAdmin } from '../_shared/supabase.ts';

type OrderRow = {
  status: 'In Queue' | 'Printing' | 'Ready' | 'Delivered';
  color_type: 'B&W' | 'Color';
  copies: number;
};

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

    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('status, color_type, copies');

    if (error) {
      console.error('admin-stats error', error);
      return serverError('Failed to fetch statistics', origin);
    }

    const rows = (data ?? []) as OrderRow[];

    const stats = {
      total: rows.length,
      byStatus: {
        'In Queue': rows.filter((row) => row.status === 'In Queue').length,
        Printing: rows.filter((row) => row.status === 'Printing').length,
        Ready: rows.filter((row) => row.status === 'Ready').length,
        Delivered: rows.filter((row) => row.status === 'Delivered').length,
      },
      byColorType: {
        'B&W': rows.filter((row) => row.color_type === 'B&W').length,
        Color: rows.filter((row) => row.color_type === 'Color').length,
      },
      totalCopies: rows.reduce((sum, row) => sum + Number(row.copies || 0), 0),
    };

    return jsonResponse({ success: true, data: stats }, 200, origin);
  } catch (error) {
    console.error('admin-stats exception', error);
    return serverError('Internal server error', origin);
  }
});
