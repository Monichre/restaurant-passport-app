import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Ensure required environment variables are set
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables must be set.');
  process.exit(1);
}

// Create a Supabase client for local development
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Database connection string for direct database operations if needed
export const databaseUrl = DATABASE_URL;

export default {
  supabase,
  databaseUrl,
  // Batch configuration
  batchSize: 100, // Number of items to process in a single batch
  delayBetweenBatches: 1000, // Milliseconds to wait between batches
};
