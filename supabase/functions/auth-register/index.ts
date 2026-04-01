import { handleOptions } from '../_shared/cors.ts';
import { badRequest, jsonResponse, serverError } from '../_shared/response.ts';
import { supabaseAdmin, supabaseAnon } from '../_shared/supabase.ts';
import bcrypt from 'npm:bcryptjs@2.4.3';

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
    const name = String(body?.name ?? '').trim();
    const email = String(body?.email ?? '').trim().toLowerCase();
    const password = String(body?.password ?? '');
    const phone = String(body?.phone ?? '').trim();

    if (!name || !email || !password || !phone) {
      return badRequest('All fields are required', origin);
    }

    if (password.length < 6) {
      return badRequest('Password must be at least 6 characters long', origin);
    }

    if (!/^\d{10}$/.test(phone)) {
      return badRequest('Phone number must be exactly 10 digits', origin);
    }

    const { data: existingEmail } = await supabaseAdmin
      .from('students')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingEmail) {
      return badRequest('Email already registered', origin);
    }

    const { data: existingPhone } = await supabaseAdmin
      .from('students')
      .select('id')
      .eq('phone', phone)
      .maybeSingle();

    if (existingPhone) {
      return badRequest('Phone number already registered', origin);
    }

    const redirectTo = origin && /^https?:\/\//i.test(origin) ? origin : undefined;

    const { data: signupData, error: signupError } = await supabaseAnon.auth.signUp({
      email,
      password,
      options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
    });

    if (signupError) {
      console.error('supabase sign up error', signupError);
      return badRequest(signupError.message || 'Unable to start email verification', origin);
    }

    if (!signupData?.user?.id) {
      return badRequest('Unable to create auth account', origin);
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const { data: createdUser, error: createError } = await supabaseAdmin
      .from('students')
      .insert({
        name,
        email,
        password: hashedPassword,
        phone,
      })
      .select('id, name, email, phone')
      .single();

    if (createError || !createdUser) {
      console.error('create user error', createError);
      // Roll back auth account if profile row creation failed.
      await supabaseAdmin.auth.admin.deleteUser(signupData.user.id);
      return serverError('Failed to create user', origin);
    }

    return jsonResponse({
      success: true,
      message: 'Registration successful. Please verify your email before logging in.',
      requiresEmailVerification: true,
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        phone: createdUser.phone,
      },
    }, 201, origin);
  } catch (error) {
    console.error('auth-register error', error);
    return serverError('Server error during registration', origin);
  }
});
