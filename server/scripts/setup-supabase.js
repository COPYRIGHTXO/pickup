import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[Setup] SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env');
  process.exit(1);
}

// Read the schema SQL file
const schemaPath = join(__dirname, '..', 'data', 'schema.sql');
const schemaSql = readFileSync(schemaPath, 'utf-8');

// Split the SQL into individual statements and run them via the Supabase REST SQL endpoint
// We'll use the PostgREST rpc endpoint or fall back to running statements individually
async function runSetup() {
  console.log('[Setup] Creating tables in Supabase...');
  console.log(`[Setup] Project URL: ${supabaseUrl}`);

  // Try using the Supabase SQL API (requires service_role key usually)
  // Instead, we'll create tables using the REST API by trying to use pg_catalog
  // Actually, the simplest approach: use the supabase-js client to run raw SQL via rpc
  
  // Since we can't run raw DDL with the anon key, let's try a different approach:
  // Create tables by attempting inserts - the tables need to be created via the Dashboard SQL Editor.
  
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║  Tables need to be created via the Supabase SQL Editor      ║');
  console.log('║                                                              ║');
  console.log('║  1. Go to: https://supabase.com/dashboard                   ║');
  console.log('║  2. Select your project                                      ║');
  console.log('║  3. Click "SQL Editor" in the left sidebar                   ║');
  console.log('║  4. Click "New Query"                                        ║');
  console.log('║  5. Copy & paste the SQL below, then click "Run"             ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('--- COPY FROM HERE ---');
  console.log(schemaSql);
  console.log('--- COPY TO HERE ---');
  console.log('');
  console.log('After running the SQL, come back and run:');
  console.log('  node server/scripts/seed-supabase.js');
}

runSetup();
