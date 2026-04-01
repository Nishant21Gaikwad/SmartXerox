import { getBearerToken, verifyToken } from '../_shared/auth.ts';
import { handleOptions } from '../_shared/cors.ts';
import { badRequest, forbidden, jsonResponse, serverError, unauthorized } from '../_shared/response.ts';
import { supabaseAdmin } from '../_shared/supabase.ts';

type OrderRow = {
  status: 'In Queue' | 'Printing' | 'Ready' | 'Delivered';
  color_type: 'B&W' | 'Color';
  copies: number;
  file_size_bytes: number | null;
  created_at: string;
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
      .select('status, color_type, copies, file_size_bytes, created_at');

    if (error) {
      console.error('admin-stats error', error);
      return serverError('Failed to fetch statistics', origin);
    }

    const rows = (data ?? []) as OrderRow[];

    // Business day window in IST (UTC+05:30), so daily total resets at IST midnight.
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const now = new Date();
    const nowInIst = new Date(now.getTime() + istOffsetMs);
    const startOfIstDayUtc = new Date(Date.UTC(
      nowInIst.getUTCFullYear(),
      nowInIst.getUTCMonth(),
      nowInIst.getUTCDate(),
      0,
      0,
      0,
      0,
    ) - istOffsetMs);

    const todayUploadBytes = rows.reduce((sum, row) => {
      const createdAt = new Date(row.created_at);
      if (Number.isNaN(createdAt.getTime()) || createdAt < startOfIstDayUtc) {
        return sum;
      }
      return sum + Number(row.file_size_bytes || 0);
    }, 0);

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
      todayUploadBytes,
    };

    return jsonResponse({ success: true, data: stats }, 200, origin);
  } catch (error) {
    console.error('admin-stats exception', error);
    return serverError('Internal server error', origin);
  }
});
