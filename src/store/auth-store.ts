import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { supabase } from '@/lib/supabase/client'
import type { User } from '@/types'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  supabaseUser: SupabaseUser | null
  loading: boolean
  initialized: boolean

  // Actions
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
  refreshSession: () => Promise<void>
  setUser: (user: User | null) => void
}

/**
 * Vérifie si une erreur est vide ou non significative
 */
function isEmptyOrAbortError(error: any): boolean {
  if (!error) return true
  
  if (
    error?.name === 'AbortError' ||
    error?.code === 'ABORTED' ||
    error?.message?.includes('aborted') ||
    error?.message?.includes('AbortError')
  ) {
    return true
  }
  
  if (typeof error === 'object') {
    const hasCode = error.code && error.code !== 'PGRST116'
    const hasMessage = error.message && error.message.length > 0
    if (!hasCode && !hasMessage) {
      return true
    }
  }
  
  return false
}

// Helper pour mapper Supabase User vers notre User
async function mapSupabaseUserToUser(supabaseUser: SupabaseUser | null): Promise<User | null> {
  if (!supabaseUser) return null
  
  if (!supabaseUser.email) {
    console.warn('[AuthStore] Supabase user has no email')
    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.full_name || 'User',
      email: '',
      role: 'customer' as User['role'],
      avatar: undefined,
      createdAt: supabaseUser.created_at || new Date().toISOString(),
    }
  }

  // PRIORITÉ 1 : Vérifier si l'utilisateur est un admin
  try {
    const { data: admin, error: adminError } = await (supabase as any)
      .from('admins')
      .select('*')
      .eq('email', supabaseUser.email)
      .maybeSingle()

    if (admin && !adminError) {
      console.log('[AuthStore] Admin found:', admin.email)
      
      ;(supabase as any)
        .from('admins')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', admin.id)
        .then(() => {}, () => {})

      return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: 'admin' as User['role'],
        avatar: admin.avatar_url || undefined,
        createdAt: admin.created_at,
      }
    }
    
    if (adminError && !isEmptyOrAbortError(adminError) && adminError.code !== 'PGRST116') {
      console.warn('[Auth] Admin check error:', adminError.message || adminError.code)
    }
  } catch (error: any) {
    if (!isEmptyOrAbortError(error)) {
      console.warn('[Auth] Admin check failed:', error?.message)
    }
  }

  // PRIORITÉ 2 : Récupérer le profil
  try {
    const { data: profile, error: profileError } = await (supabase as any)
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .maybeSingle()

    if (profile && !profileError) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role as User['role'],
        avatar: profile.avatar_url || undefined,
        createdAt: profile.created_at,
      }
    }
    
    if (!profile) {
      const { data: newProfile, error: createError } = await (supabase as any)
        .from('profiles')
        .insert({
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
          email: supabaseUser.email || '',
          role: 'customer',
        })
        .select()
        .maybeSingle()

      if (newProfile && !createError) {
        return {
          id: newProfile.id,
          name: newProfile.name,
          email: newProfile.email,
          role: newProfile.role as User['role'],
          avatar: newProfile.avatar_url || undefined,
          createdAt: newProfile.created_at,
        }
      }

      if (createError?.code === '23505') {
        await new Promise(resolve => setTimeout(resolve, 200))
        const { data: retryProfile } = await (supabase as any)
          .from('profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .maybeSingle()
        
        if (retryProfile) {
          return {
            id: retryProfile.id,
            name: retryProfile.name,
            email: retryProfile.email,
            role: retryProfile.role as User['role'],
            avatar: retryProfile.avatar_url || undefined,
            createdAt: retryProfile.created_at,
          }
        }
      }
      
      if (createError && !isEmptyOrAbortError(createError) && createError.code !== '23505') {
        console.warn('[Auth] Profile creation error:', createError.message || createError.code)
      }
    }
  } catch (error: any) {
    if (!isEmptyOrAbortError(error)) {
      console.warn('[Auth] Profile check failed:', error?.message)
    }
  }

  console.log('[Auth] Using minimal user data for:', supabaseUser.email)
  return {
    id: supabaseUser.id,
    name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
    email: supabaseUser.email || '',
    role: 'customer' as User['role'],
    avatar: undefined,
    createdAt: supabaseUser.created_at || new Date().toISOString(),
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      supabaseUser: null,
      loading: false,
      initialized: false,

      setUser: (user) => set({ user }),

      signIn: async (email: string, password: string) => {
        set({ loading: true })
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) {
            set({ loading: false })
            return { error }
          }

          if (data.user) {
            const user = await mapSupabaseUserToUser(data.user)
            
            console.log('[AuthStore] User mapped after signIn:', user?.email, 'role:', user?.role)
            
            if (!user) {
              set({ loading: false })
              return { error: new Error('Failed to map user data') }
            }
            
            set({
              user,
              supabaseUser: data.user,
              loading: false,
              initialized: true,
            })
            
            return { error: null }
          }

          set({ loading: false })
          return { error: new Error('No user data returned') }
        } catch (error) {
          set({ loading: false })
          return { error: error instanceof Error ? error : new Error('Unknown error') }
        }
      },

      signUp: async (email: string, password: string, fullName: string) => {
        set({ loading: true })
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
            },
          })

          if (error) {
            set({ loading: false })
            return { error }
          }

          if (data.user) {
            await new Promise(resolve => setTimeout(resolve, 500))
            
            const { error: profileError } = await (supabase as any)
              .from('profiles')
              .insert({
                id: data.user.id,
                name: fullName,
                email: email,
                role: 'customer',
              })
              .select()
              .maybeSingle()

            if (profileError && profileError.code !== '23505' && !isEmptyOrAbortError(profileError)) {
              console.warn('[Auth] Profile creation during signup:', profileError.message)
            }

            const user = await mapSupabaseUserToUser(data.user)
            set({
              user,
              supabaseUser: data.user,
              loading: false,
            })
            return { error: null }
          }

          set({ loading: false })
          return { error: new Error('No user data returned') }
        } catch (error) {
          set({ loading: false })
          return { error: error instanceof Error ? error : new Error('Unknown error') }
        }
      },

      signOut: async () => {
        console.log('[AuthStore] Signing out...')
        try {
          const { error } = await supabase.auth.signOut()
          
          if (error) {
            console.error('[AuthStore] Error signing out:', error)
            return
          }
          
          console.log('[AuthStore] Sign out successful')
          set({
            user: null,
            supabaseUser: null,
            loading: false,
            initialized: true,
          })
        } catch (error) {
          console.error('[AuthStore] Unexpected error signing out:', error)
        }
      },

      initialize: async () => {
        // Si déjà initialisé, ne pas ré-initialiser
        if (get().initialized && get().user) {
          console.log('[AuthStore] Already initialized with user:', get().user?.email)
          return
        }

        set({ loading: true })
        console.log('[AuthStore] Initializing...')
        
        try {
          const { data: { session }, error } = await supabase.auth.getSession()

          if (error) {
            console.error('[Auth] Error getting session:', error)
            set({ loading: false, initialized: true })
            return
          }

          if (session?.user) {
            console.log('[AuthStore] Session found for:', session.user.email)
            try {
              const user = await mapSupabaseUserToUser(session.user)
              console.log('[AuthStore] User mapped:', user?.email, 'role:', user?.role)
              set({
                user,
                supabaseUser: session.user,
                loading: false,
                initialized: true,
              })
            } catch (error) {
              console.error('[Auth] Error mapping user:', error)
              set({
                user: null,
                supabaseUser: session.user,
                loading: false,
                initialized: true,
              })
            }
          } else {
            console.log('[AuthStore] No session found')
            set({
              user: null,
              supabaseUser: null,
              loading: false,
              initialized: true,
            })
          }

          // Écouter les changements d'authentification
          supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('[AuthStore] Auth state changed:', event)
            
            if (event === 'SIGNED_IN' && session?.user) {
              try {
                const user = await mapSupabaseUserToUser(session.user)
                console.log('[AuthStore] User signed in:', user?.email, 'role:', user?.role)
                
                set({
                  user,
                  supabaseUser: session.user,
                  loading: false,
                  initialized: true,
                })
              } catch (error) {
                console.error('[AuthStore] Error mapping user:', error)
                set({
                  user: null,
                  supabaseUser: session.user,
                  loading: false,
                  initialized: true,
                })
              }
            } else if (event === 'SIGNED_OUT') {
              set({
                user: null,
                supabaseUser: null,
                loading: false,
                initialized: true,
              })
            } else if (event === 'TOKEN_REFRESHED' && session?.user) {
              const user = await mapSupabaseUserToUser(session.user)
              set({
                user,
                supabaseUser: session.user,
              })
            }
          })
        } catch (error) {
          console.error('[Auth] Error initializing:', error)
          set({ loading: false, initialized: true })
        }
      },

      refreshSession: async () => {
        console.log('[AuthStore] Refreshing session...')
        try {
          const { data: { session }, error } = await supabase.auth.getSession()

          if (error) {
            console.error('[Auth] Error refreshing session:', error)
            return
          }

          if (session?.user) {
            const user = await mapSupabaseUserToUser(session.user)
            console.log('[AuthStore] Session refreshed for:', user?.email)
            set({
              user,
              supabaseUser: session.user,
              initialized: true,
            })
          } else {
            console.log('[AuthStore] No session found during refresh')
            set({
              user: null,
              supabaseUser: null,
              initialized: true,
            })
          }
        } catch (error) {
          console.error('[Auth] Error refreshing session:', error)
        }
      },
    }),
    {
      name: 'mindef-auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Ne persister que user et initialized pour un chargement rapide
      partialize: (state) => ({
        user: state.user,
        initialized: state.initialized,
      }),
    }
  )
)
