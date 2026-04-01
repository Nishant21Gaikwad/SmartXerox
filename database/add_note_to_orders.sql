-- Migration: add optional note column for each uploaded file/order
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS note TEXT;

COMMENT ON COLUMN orders.note IS 'Optional note from student to print shop owner for this specific file';
