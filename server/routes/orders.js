import express from 'express';
import multer from 'multer';
import { fileTypeFromBuffer } from 'file-type';
import { supabaseAdmin } from '../services/supabaseClient.js';

const router = express.Router();
const storageBucket = process.env.SUPABASE_STORAGE_BUCKET || 'smartxerox-files';

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf', 
      'image/jpeg', 
      'image/jpg', 
      'image/png',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-powerpoint', // .ppt
      'application/vnd.openxmlformats-officedocument.presentationml.presentation' // .pptx
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, PNG, DOCX, PPT, and PPTX files are allowed.'));
    }
  }
});

// POST /api/orders - Create new order with file upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { student_name, phone_number, copies, color_type, note } = req.body;
    const file = req.file;
    const orderNote = typeof note === 'string' ? note.trim().slice(0, 250) : '';

    // Validation
    if (!student_name || !phone_number || !copies || !color_type || !file) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: student_name, phone_number, copies, color_type, and file'
      });
    }

    if (!['B&W', 'Color'].includes(color_type)) {
      return res.status(400).json({
        success: false,
        message: 'color_type must be either "B&W" or "Color"'
      });
    }

    if (orderNote.length > 250) {
      return res.status(400).json({
        success: false,
        message: 'Note must be 250 characters or less'
      });
    }

    // Additional file validation - check actual file type (magic numbers)
    try {
      const fileType = await fileTypeFromBuffer(file.buffer);
      const allowedMimeTypes = [
        'application/pdf', 
        'image/jpeg', 
        'image/png',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.ms-powerpoint', // .ppt
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' // .pptx
      ];
      
      // DOCX/PPTX are ZIP-based Office formats, so validate as ZIP when detectable.
      if (
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ) {
        if (fileType && fileType.mime !== 'application/zip') {
          return res.status(400).json({
            success: false,
            message: 'Invalid Office Open XML file format detected.'
          });
        }
        // If it's a ZIP or detection fails, allow it.
      } else if (file.mimetype === 'application/vnd.ms-powerpoint') {
        // Legacy PPT is OLE Compound File format.
        if (fileType && fileType.mime !== 'application/x-cfb') {
          return res.status(400).json({
            success: false,
            message: 'Invalid PPT file format detected.'
          });
        }
      } else {
        // For other file types, strict validation
        if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid file format detected. Only genuine PDF, JPG, PNG, DOCX, PPT, and PPTX files are allowed.'
          });
        }
      }
    } catch (validationError) {
      // If file-type can't detect the type, reject it (unless Office format where MIME + extension checks already passed)
      if (
        file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
        file.mimetype !== 'application/vnd.openxmlformats-officedocument.presentationml.presentation' &&
        file.mimetype !== 'application/vnd.ms-powerpoint'
      ) {
        return res.status(400).json({
          success: false,
          message: 'Could not validate file type. Please ensure you are uploading a valid file.'
        });
      }
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `orders/${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from(storageBucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload file to storage'
      });
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin
      .storage
      .from(storageBucket)
      .getPublicUrl(filePath);

    // Create order in database
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          student_name,
          phone_number,
          file_url: urlData.publicUrl,
          file_path: filePath,
          copies: parseInt(copies),
          color_type,
          note: orderNote || null,
          status: 'In Queue'
        }
      ])
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      // Clean up uploaded file
      await supabaseAdmin.storage.from(storageBucket).remove([filePath]);
      return res.status(500).json({
        success: false,
        message: 'Failed to create order'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: orderData
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

// GET /api/orders/:phoneNumber - Get orders by phone number
router.get('/:phoneNumber', async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('phone_number', phoneNumber)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch orders'
      });
    }

    res.json({
      success: true,
      data: data || []
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// DELETE /api/orders/:id - Delete an order
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get order details to find file path
    const { data: order, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('file_path')
      .eq('id', id)
      .single();

    if (fetchError || !order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Delete file from storage
    await supabaseAdmin.storage
      .from(storageBucket)
      .remove([order.file_path]);

    // Delete order from database
    const { error: deleteError } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting order:', deleteError);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete order'
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
