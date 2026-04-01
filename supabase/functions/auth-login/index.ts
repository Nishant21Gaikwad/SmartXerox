import bcrypt from 'npm:bcryptjs@2.4.3';
import { handleOptions } from '../_shared/cors.ts';
import { badRequest, jsonResponse, serverError, unauthorized } from '../_shared/response.ts';
import { supabaseAdmin } from '../_shared/supabase.ts';
import { signToken } from '../_shared/auth.ts';

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

    const { data: listedUsers, error: authUserError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (authUserError) {
      console.error('auth user lookup error', authUserError);
      return serverError('Server error during login', origin);
    }

    const authUser = listedUsers?.users?.find((candidate) => {
      return String(candidate.email ?? '').toLowerCase() === email;
    });

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
