-- SmartXerox Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  copies INTEGER NOT NULL DEFAULT 1 CHECK (copies > 0),
  color_type TEXT NOT NULL CHECK (color_type IN ('B&W', 'Color')),
  status TEXT NOT NULL DEFAULT 'In Queue' CHECK (status IN ('In Queue', 'Printing', 'Ready', 'Delivered')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_phone_number ON orders(phone_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Add comments for documentation
COMMENT ON TABLE orders IS 'Stores all print orders submitted by students';
COMMENT ON COLUMN orders.student_name IS 'Name of the student who placed the order';
COMMENT ON COLUMN orders.phone_number IS 'Contact number for order tracking (10 digits)';
COMMENT ON COLUMN orders.file_url IS 'Public URL of the uploaded file in Supabase Storage';
COMMENT ON COLUMN orders.file_path IS 'Storage path for file deletion';
COMMENT ON COLUMN orders.copies IS 'Number of copies to print';
COMMENT ON COLUMN orders.color_type IS 'Print type: B&W or Color';
COMMENT ON COLUMN orders.status IS 'Current order status';
COMMENT ON COLUMN orders.created_at IS 'Timestamp when order was created';

-- Create a view for order statistics (optional)
CREATE OR REPLACE VIEW order_statistics AS
SELECT 
  COUNT(*) as total_orders,
  SUM(CASE WHEN status = 'In Queue' THEN 1 ELSE 0 END) as in_queue,
  SUM(CASE WHEN status = 'Printing' THEN 1 ELSE 0 END) as printing,
  SUM(CASE WHEN status = 'Ready' THEN 1 ELSE 0 END) as ready,
  SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) as delivered,
  SUM(CASE WHEN color_type = 'B&W' THEN 1 ELSE 0 END) as bw_orders,
  SUM(CASE WHEN color_type = 'Color' THEN 1 ELSE 0 END) as color_orders,
  SUM(copies) as total_copies
FROM orders
WHERE created_at > NOW() - INTERVAL '24 hours';

-- Function to clean up expired orders (alternative to cron job)
CREATE OR REPLACE FUNCTION cleanup_expired_orders()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM orders 
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- Sample data (optional - for testing)
-- Uncomment to insert test data
/*
INSERT INTO orders (student_name, phone_number, file_url, file_path, copies, color_type, status) VALUES
  ('John Doe', '9876543210', 'https://example.com/file1.pdf', 'orders/file1.pdf', 2, 'B&W', 'In Queue'),
  ('Jane Smith', '9876543211', 'https://example.com/file2.pdf', 'orders/file2.pdf', 1, 'Color', 'Printing'),
  ('Bob Johnson', '9876543212', 'https://example.com/file3.pdf', 'orders/file3.pdf', 3, 'B&W', 'Ready');
*/

-- Grant necessary permissions (adjust based on your setup)
-- These are typically handled automatically by Supabase, but included for reference
-- GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO authenticated;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO service_role;
