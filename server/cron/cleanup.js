import cron from 'node-cron';
import { supabaseAdmin } from '../services/supabaseClient.js';
const storageBucket = process.env.SUPABASE_STORAGE_BUCKET || 'smartxerox-files';

// Logger utility - only logs in development or when errors occur
const log = (message, data = null) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(message, data || '');
  }
};

/**
 * Cleanup job that runs every hour to delete:
 * 1. Orders older than 24 hours
 * 2. Their associated files from storage
 */
export const cleanupExpiredOrders = async () => {
  try {
    log('🧹 Starting cleanup job...');

    // Calculate 24 hours ago timestamp
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Fetch orders older than 24 hours
    const { data: expiredOrders, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('id, file_path, student_name')
      .lt('created_at', twentyFourHoursAgo);

    if (fetchError) {
      console.error('❌ Error fetching expired orders:', fetchError.message);
      return;
    }

    if (!expiredOrders || expiredOrders.length === 0) {
      log('✅ No expired orders to clean up');
      return;
    }

    log(`📋 Found ${expiredOrders.length} expired order(s) to delete`);

    // Delete files from storage
    const filePaths = expiredOrders.map(order => order.file_path);
    const { error: storageError } = await supabaseAdmin
      .storage
      .from(storageBucket)
      .remove(filePaths);

    if (storageError) {
      console.error('❌ Error deleting files from storage:', storageError.message);
    } else {
      log(`🗑️  Deleted ${filePaths.length} file(s) from storage`);
    }

    // Delete orders from database
    const orderIds = expiredOrders.map(order => order.id);
    const { error: deleteError } = await supabaseAdmin
      .from('orders')
      .delete()
      .in('id', orderIds);

    if (deleteError) {
      console.error('❌ Error deleting orders from database:', deleteError.message);
    } else {
      log(`✅ Deleted ${orderIds.length} order(s) from database`);
    }

    log('🧹 Cleanup job completed successfully');

  } catch (error) {
    // Always log errors, even in production
    console.error('❌ Cleanup job failed:', error.message);
  }
};

/**
 * Start the cleanup cron job
 * Runs every hour at minute 0
 */
export const startCleanupJob = () => {
  // Run every hour at the start of the hour
  cron.schedule('0 * * * *', async () => {
    log(`\n⏰ Cron job triggered at ${new Date().toLocaleString()}`);
    await cleanupExpiredOrders();
  });

  log('✅ Cleanup cron job scheduled (runs every hour)');

  // Optional: Run cleanup immediately on server start
  // Uncomment the line below if you want immediate cleanup on startup
  // cleanupExpiredOrders();
};

// Export for manual execution
export default cleanupExpiredOrders;
