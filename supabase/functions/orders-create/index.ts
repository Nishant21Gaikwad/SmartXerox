import { getBearerToken, verifyToken } from '../_shared/auth.ts';
import { handleOptions } from '../_shared/cors.ts';
import { badRequest, forbidden, jsonResponse, notFound, serverError, unauthorized } from '../_shared/response.ts';
import { env } from '../_shared/env.ts';
import { supabaseAdmin } from '../_shared/supabase.ts';

const maxFileSize = 10 * 1024 * 1024;

const detectMimeType = (bytes: Uint8Array): string | null => {
  if (bytes.length >= 4 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return 'application/pdf';
  }

  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return 'image/png';
  }

  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }

  if (
    bytes.length >= 8 &&
    bytes[0] === 0xd0 &&
    bytes[1] === 0xcf &&
    bytes[2] === 0x11 &&
    bytes[3] === 0xe0 &&
    bytes[4] === 0xa1 &&
    bytes[5] === 0xb1 &&
    bytes[6] === 0x1a &&
    bytes[7] === 0xe1
  ) {
    return 'application/x-ole-storage';
  }

  if (bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04) {
    return 'application/zip';
  }

  return null;
};

const sanitizeFileExtension = (originalFileName: string) => {
  const ext = originalFileName.split('.').pop()?.toLowerCase() ?? '';
  if (!['pdf', 'png', 'jpg', 'jpeg', 'docx', 'ppt', 'pptx'].includes(ext)) {
    return null;
  }
  return ext;
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
      .select('name, phone')
      .eq('id', payload.id)
      .maybeSingle();

    if (studentError) {
      console.error('orders-create student lookup error', studentError);
      return serverError('Failed to resolve student profile', origin);
    }

    if (!student?.name || !student?.phone) {
      return notFound('Student profile not found', origin);
    }

    const formData = await req.formData();
    const copiesRaw = String(formData.get('copies') ?? '').trim();
    const colorType = String(formData.get('color_type') ?? '').trim();
    const note = String(formData.get('note') ?? '').trim().slice(0, 250);
    const file = formData.get('file');

    if (!copiesRaw || !colorType || !(file instanceof File)) {
      return badRequest('All fields are required: copies, color_type, and file', origin);
    }

    const copies = Number.parseInt(copiesRaw, 10);
    if (!Number.isInteger(copies) || copies < 1 || copies > 100) {
      return badRequest('Copies must be an integer between 1 and 100', origin);
    }

    if (!['B&W', 'Color'].includes(colorType)) {
      return badRequest('color_type must be either "B&W" or "Color"', origin);
    }

    const extension = sanitizeFileExtension(file.name);
    if (!extension) {
      return badRequest('Invalid file extension. Allowed: PDF, JPG, PNG, DOCX, PPT, PPTX', origin);
    }

    const fileBuffer = new Uint8Array(await file.arrayBuffer());
    if (fileBuffer.byteLength === 0 || fileBuffer.byteLength > maxFileSize) {
      return badRequest('File must be between 1 byte and 10MB', origin);
    }

    const detectedMime = detectMimeType(fileBuffer);
    const allowedMimePairs: Record<string, string[]> = {
      pdf: ['application/pdf'],
      png: ['image/png'],
      jpg: ['image/jpeg'],
      jpeg: ['image/jpeg'],
      docx: ['application/zip'],
      ppt: ['application/x-ole-storage'],
      pptx: ['application/zip'],
    };

    if (!detectedMime || !allowedMimePairs[extension].includes(detectedMime)) {
      return badRequest('File content does not match extension. Upload a valid PDF, JPG, PNG, DOCX, PPT, or PPTX file.', origin);
    }

    const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const filePath = `orders/${fileName}`;

    const uploadResult = await supabaseAdmin.storage
      .from(env.storageBucket)
      .upload(filePath, fileBuffer, {
        contentType: file.type || detectedMime,
        upsert: false,
      });

    if (uploadResult.error) {
      console.error('storage upload error', uploadResult.error);
      return serverError('Failed to upload file to storage', origin);
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(env.storageBucket)
      .getPublicUrl(filePath);

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        student_name: student.name,
        phone_number: student.phone,
        file_url: publicUrlData.publicUrl,
        file_path: filePath,
        file_size_bytes: fileBuffer.byteLength,
        copies,
        color_type: colorType,
        note: note || null,
        status: 'In Queue',
      })
      .select('*')
      .single();

    if (orderError || !order) {
      console.error('order create error', orderError);
      await supabaseAdmin.storage.from(env.storageBucket).remove([filePath]);
      return serverError('Failed to create order', origin);
    }

    return jsonResponse({
      success: true,
      message: 'Order created successfully',
      data: order,
    }, 201, origin);
  } catch (error) {
    console.error('orders-create error', error);
    return serverError('Internal server error', origin);
  }
});
