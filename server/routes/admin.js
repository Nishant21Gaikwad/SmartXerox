import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '../services/supabaseClient.js';
import { authMiddleware, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// POST /api/admin/login - Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Simple admin authentication (in production, use database)
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        email,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/admin/orders - Get all orders (protected route)
router.get('/orders', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { status } = req.query;

    let query = supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

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

// PUT /api/admin/orders/:id/status - Update order status (protected route)
router.put('/orders/:id/status', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['In Queue', 'Printing', 'Ready', 'Delivered'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update order status'
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/admin/stats - Get order statistics (protected route)
router.get('/stats', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { data: allOrders, error } = await supabaseAdmin
      .from('orders')
      .select('status, color_type, copies');

    if (error) {
      console.error('Error fetching stats:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics'
      });
    }

    const stats = {
      total: allOrders.length,
      byStatus: {
        'In Queue': allOrders.filter(o => o.status === 'In Queue').length,
        'Printing': allOrders.filter(o => o.status === 'Printing').length,
        'Ready': allOrders.filter(o => o.status === 'Ready').length,
        'Delivered': allOrders.filter(o => o.status === 'Delivered').length,
      },
      byColorType: {
        'B&W': allOrders.filter(o => o.color_type === 'B&W').length,
        'Color': allOrders.filter(o => o.color_type === 'Color').length,
      },
      totalCopies: allOrders.reduce((sum, o) => sum + o.copies, 0)
    };

    res.json({
      success: true,
      data: stats
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
