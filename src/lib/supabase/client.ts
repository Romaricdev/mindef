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

/**
 * Clé de stockage fixe pour garantir le partage de session entre onglets
 */
const STORAGE_KEY = 'mindef-app-auth'

/**
 * Fetch personnalisé avec logging et sans AbortSignal
 */
const persistentFetch: typeof fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : (input as Request).url
  
  // Supprimer le signal d'annulation
  const newInit: RequestInit = {
    ...init,
    signal: undefined,
  }
  
  try {
    const response = await fetch(input, newInit)
    
    // Log les erreurs de réponse pour le débogage
    if (!response.ok && response.status >= 400) {
      console.warn(`[Supabase Fetch] ${response.status} for ${url.split('?')[0]}`)
    }
    
    return response
  } catch (error: any) {
    // Log les erreurs de réseau
    console.error(`[Supabase Fetch] Network error for ${url.split('?')[0]}:`, error?.message || error)
    throw error
  }
}

/** Client Supabase pour composants client (browser). */
export const supabase = createClient<Database>(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: STORAGE_KEY,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    flowType: 'pkce',
  },
  global: {
    fetch: persistentFetch,
  },
})

// Log l'initialisation du client
if (typeof window !== 'undefined') {
  console.log('[Supabase] Client initialized, checking session...')
  
  // Vérifier la session au chargement
  supabase.auth.getSession().then(({ data: { session }, error }) => {
    if (error) {
      console.error('[Supabase] Error getting initial session:', error)
    } else if (session) {
      console.log('[Supabase] Session found for:', session.user.email)
    } else {
      console.log('[Supabase] No session found (anonymous access)')
    }
  })

  // Écouter les changements de localStorage pour synchroniser entre onglets
  window.addEventListener('storage', async (event) => {
    if (event.key === STORAGE_KEY) {
      console.log('[Supabase] Storage changed in another tab, refreshing session...')
      try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log('[Supabase] Session after storage change:', session?.user.email || 'none')
      } catch (error) {
        console.warn('[Supabase] Error syncing session:', error)
      }
    }
  })
}

/**
 * Helper pour vérifier si le client est prêt (utile pour le débogage)
 */
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    // Simple query pour vérifier la connexion
    const { error } = await supabase.from('categories').select('id').limit(1)
    if (error) {
      console.error('[Supabase] Connection check failed:', error.message)
      return false
    }
    console.log('[Supabase] Connection check successful')
    return true
  } catch (error: any) {
    console.error('[Supabase] Connection check error:', error?.message || error)
    return false
  }
}
