import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types.generated'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Copy .env.example to .env.local and fill values from Supabase Dashboard.'
  )
}

/** Client Supabase pour composants client (browser). */
export const supabase = createClient<Database>(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    // Sauvegarder la session dans localStorage pour qu’elle soit partagée entre onglets
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
