import { handleOptions } from '../_shared/cors.ts';
import { badRequest, jsonResponse } from '../_shared/response.ts';

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');

  if (req.method === 'OPTIONS') {
    return handleOptions(origin);
  }

  if (req.method !== 'GET') {
    return badRequest('Method not allowed', origin);
  }

  return jsonResponse({
    success: true,
    message: 'SmartXerox Supabase Edge API is running',
    timestamp: new Date().toISOString(),
  }, 200, origin);
});
