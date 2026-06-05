import { createClient } from '@supabase/supabase-js'

// Use placeholder values if the environment variables are not defined.
// This prevents Next.js from crashing during build time when environment variables
// might not be injected in the build environment yet.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Warning: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. Using placeholders for build stability.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
