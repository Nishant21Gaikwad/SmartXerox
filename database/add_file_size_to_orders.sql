-- Migration: store uploaded file size for usage analytics in admin dashboard
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS file_size_bytes BIGINT;

COMMENT ON COLUMN orders.file_size_bytes IS 'Uploaded file size in bytes (used for daily usage analytics)';
