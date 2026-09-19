import { createClient } from '@supabase/supabase-js'

/**
 * Singleton Supabase client for the whole app. The URL and publishable (anon)
 * key are read from Vite env vars at build time; the publishable key is
 * client-safe by design — RLS on the database is what actually protects data.
 *
 * Session persistence + token auto-refresh are on by default, so a signed-in
 * admin stays signed in across reloads.
 */
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env.local and fill in your Supabase project values.',
  )
}

export const supabase = createClient(url, anonKey)
