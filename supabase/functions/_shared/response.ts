import { getCorsHeaders } from './cors.ts';

export const jsonResponse = (
  payload: Record<string, unknown>,
  status: number,
  origin: string | null,
) => {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...getCorsHeaders(origin),
      'Content-Type': 'application/json',
    },
  });
};

export const badRequest = (message: string, origin: string | null) =>
  jsonResponse({ success: false, message }, 400, origin);

export const unauthorized = (message: string, origin: string | null) =>
  jsonResponse({ success: false, message }, 401, origin);

export const forbidden = (message: string, origin: string | null) =>
  jsonResponse({ success: false, message }, 403, origin);

export const notFound = (message: string, origin: string | null) =>
  jsonResponse({ success: false, message }, 404, origin);

export const serverError = (message: string, origin: string | null) =>
  jsonResponse({ success: false, message }, 500, origin);
