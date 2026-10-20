import 'dotenv/config';

const required = ['SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY'];
const missing = required.filter((name) => !process.env[name]?.trim());

if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT) || 3000,
  corsOrigins: Object.freeze(
    (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
      .split(',')
      .map((origin) => origin.trim()),
  ),
  supabaseUrl: process.env.SUPABASE_URL.trim(),
  supabaseKey: process.env.SUPABASE_PUBLISHABLE_KEY.trim(),
});