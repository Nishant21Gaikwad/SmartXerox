import { handleOptions } from '../_shared/cors.ts';
import { badRequest, jsonResponse, serverError } from '../_shared/response.ts';
import { supabaseAdmin } from '../_shared/supabase.ts';
import { signToken } from '../_shared/auth.ts';
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
      return serverError('Failed to create user', origin);
    }

    const token = await signToken({ id: createdUser.id, email: createdUser.email, role: 'student' }, '7d');

    return jsonResponse({
      success: true,
      message: 'Registration successful',
      token,
      user: createdUser,
    }, 201, origin);
  } catch (error) {
    console.error('auth-register error', error);
    return serverError('Server error during registration', origin);
  }
});
