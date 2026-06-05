import { createClient } from '@supabase/supabase-js'

export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key_for_build',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
