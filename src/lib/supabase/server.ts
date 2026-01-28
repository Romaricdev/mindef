import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types.generated'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/** Client Supabase pour Server Components, Route Handlers, Server Actions. */
export function createServerClient() {
  return createClient<Database>(supabaseUrl ?? '', supabaseAnonKey ?? '')
}
