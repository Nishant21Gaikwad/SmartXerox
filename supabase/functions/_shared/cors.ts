const rawOrigins = Deno.env.get('ALLOWED_ORIGINS') ?? '';

const configuredOrigins = rawOrigins
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
];

const allowedOrigins = configuredOrigins.length > 0 ? configuredOrigins : defaultOrigins;

export const getCorsHeaders = (origin: string | null) => {
  const isAllowed = !!origin && allowedOrigins.includes(origin);

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
};

export const handleOptions = (origin: string | null) => {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
};
