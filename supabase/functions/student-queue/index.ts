import { getBearerToken, verifyToken } from '../_shared/auth.ts';
import { handleOptions } from '../_shared/cors.ts';
import { badRequest, forbidden, jsonResponse, notFound, serverError, unauthorized } from '../_shared/response.ts';
import { supabaseAdmin } from '../_shared/supabase.ts';

type QueueRow = {
  id: string;
  phone_number: string;
  status: 'In Queue' | 'Printing' | 'Ready' | 'Delivered';
  created_at: string;
};

const queueStatuses = new Set(['In Queue', 'Printing']);
const activeStatuses = new Set(['In Queue', 'Printing', 'Ready']);

const denoRuntime = globalThis as typeof globalThis & {
  Deno: {
    serve: (handler: (req: Request) => Response | Promise<Response>) => void;
  };
};

denoRuntime.Deno.serve(async (req: Request) => {
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

    if (payload.role !== 'student' || !payload.id) {
      return forbidden('Student access required', origin);
    }

    const { data: student, error: studentError } = await supabaseAdmin
      .from('students')
      .select('id, phone')
      .eq('id', payload.id)
      .maybeSingle();

    if (studentError) {
      console.error('student-queue student lookup error', studentError);
      return serverError('Failed to fetch student profile', origin);
    }

    if (!student?.phone) {
      return notFound('Student profile not found', origin);
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('id, phone_number, status, created_at')
      .neq('status', 'Delivered')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('student-queue orders fetch error', error);
      return serverError('Failed to fetch queue data', origin);
    }

    const allOrders = (data ?? []) as QueueRow[];
    const activeOrders = allOrders.filter((order) => activeStatuses.has(order.status));
    const queueOrders = activeOrders.filter((order) => queueStatuses.has(order.status));
    const myOrders = activeOrders.filter((order) => order.phone_number === student.phone);

    const myQueue = myOrders
      .map((order) => {
        const queueIndex = queueOrders.findIndex((queueOrder) => queueOrder.id === order.id);
        return {
          id: order.id,
          status: order.status,
          submittedAt: order.created_at,
          queueNumber: queueIndex >= 0 ? queueIndex + 1 : null,
        };
      })
      .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());

    const timeline = queueOrders.slice(0, 40).map((order, index) => ({
      slot: index + 1,
      status: order.status,
      isMine: order.phone_number === student.phone,
    }));

    const stats = {
      totalActive: activeOrders.length,
      queueLength: queueOrders.length,
      inQueue: activeOrders.filter((order) => order.status === 'In Queue').length,
      printing: activeOrders.filter((order) => order.status === 'Printing').length,
      ready: activeOrders.filter((order) => order.status === 'Ready').length,
    };

    return jsonResponse({
      success: true,
      data: {
        stats,
        myQueue,
        timeline,
        refreshedAt: new Date().toISOString(),
      },
    }, 200, origin);
  } catch (error) {
    console.error('student-queue exception', error);
    return serverError('Internal server error', origin);
  }
});
