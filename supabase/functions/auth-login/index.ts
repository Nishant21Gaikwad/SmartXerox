import bcrypt from 'npm:bcryptjs@2.4.3';
import { handleOptions } from '../_shared/cors.ts';
import { badRequest, jsonResponse, serverError, unauthorized } from '../_shared/response.ts';
import { supabaseAdmin } from '../_shared/supabase.ts';
import { signToken } from '../_shared/auth.ts';

const findAuthUserByEmail = async (email: string) => {
  const perPage = 1000;
  const maxPages = 50;

  for (let page = 1; page <= maxPages; page += 1) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });

    if (error) {
      return { user: null, error };
    }

    const users = data?.users ?? [];
    const matched = users.find((candidate) => String(candidate.email ?? '').toLowerCase() === email);
    if (matched) {
      return { user: matched, error: null };
    }

    if (users.length < perPage) {
      break;
    }
  }

  return { user: null, error: null };
};

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');

  if (req.method === 'OPTIONS') {
    return handleOptions(origin);
  }

  if (req.method !== 'POST') {
    return badRequest('Method not allowed', origin);
  }

  try {
    const body = await req.json();
    const email = String(body?.email ?? '').trim().toLowerCase();
    const password = String(body?.password ?? '');

    if (!email || !password) {
      return badRequest('Email and password are required', origin);
    }

    const { data: user, error } = await supabaseAdmin
      .from('students')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error || !user) {
      return unauthorized('Invalid email or password', origin);
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return unauthorized('Invalid email or password', origin);
    }

    const { user: authUser, error: authUserError } = await findAuthUserByEmail(email);

    if (authUserError) {
      console.error('auth user lookup error', authUserError);
      return serverError('Server error during login', origin);
    }

    if (!authUser?.email_confirmed_at) {
      return unauthorized('Please verify your email before logging in', origin);
    }

    const token = await signToken({ id: user.id, email: user.email, role: 'student' }, '7d');

    return jsonResponse({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    }, 200, origin);
  } catch (error) {
    console.error('auth-login error', error);
    return serverError('Server error during login', origin);
  }
});
