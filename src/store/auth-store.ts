import { create } from 'zustand'
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
}

// Helper pour mapper Supabase User vers notre User
async function mapSupabaseUserToUser(supabaseUser: SupabaseUser | null): Promise<User | null> {
  if (!supabaseUser) return null
  // Supabase peut retourner un user sans email (cas rares). Nos checks (admins/profiles) en dépendent.
  if (!supabaseUser.email) {
    console.warn('[AuthStore] Supabase user has no email; cannot map to app user')
    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.full_name || 'User',
      email: '',
      role: 'customer' as User['role'],
      avatar: undefined,
      createdAt: supabaseUser.created_at || new Date().toISOString(),
    }
  }

  // PRIORITÉ 1 : Vérifier si l'utilisateur est un admin dans la table admins
  // Cette vérification DOIT être faite en premier et prioritaire
  // Les admins ont accès au dashboard, donc on doit les identifier avant tout
  let isAdmin = false
  let adminData: any = null
  
  // Fonction helper pour vérifier l'admin avec gestion des AbortError
  const checkAdmin = async (): Promise<{ admin: any; error: any }> => {
    try {
      const { data: admin, error: adminError } = await (supabase as any)
        .from('admins')
        .select('*')
        .eq('email', supabaseUser.email)
        .maybeSingle()

      return { admin, error: adminError }
    } catch (error: any) {
      // Si c'est une AbortError (React Strict Mode), on la retourne pour réessayer
      if (error?.message?.includes('AbortError') || error?.message?.includes('aborted')) {
        return { admin: null, error: { message: 'AbortError', code: 'ABORTED' } }
      }
      return { admin: null, error }
    }
  }

  // Essayer de vérifier l'admin (avec retry si AbortError)
  let adminCheckResult = await checkAdmin()
  
  // Si AbortError, réessayer plusieurs fois avec des délais croissants
  let retryCount = 0
  const maxRetries = 3
  while ((adminCheckResult.error?.message === 'AbortError' || adminCheckResult.error?.code === 'ABORTED') && retryCount < maxRetries) {
    retryCount++
    const delay = 300 * retryCount // 300ms, 600ms, 900ms
    console.log(`[Auth] Admin check aborted (React Strict Mode), retrying ${retryCount}/${maxRetries} after ${delay}ms...`)
    await new Promise(resolve => setTimeout(resolve, delay))
    adminCheckResult = await checkAdmin()
    
    // Si on trouve un admin, sortir de la boucle
    if (adminCheckResult.admin && !adminCheckResult.error) {
      break
    }
  }

  const { admin, error: adminError } = adminCheckResult

  // Si on trouve un admin, le retourner IMMÉDIATEMENT (priorité absolue)
  if (admin && !adminError) {
    console.log('[AuthStore] Admin found:', admin.email)
    isAdmin = true
    adminData = admin
    
    // Mettre à jour last_login_at (en arrière-plan, ne pas bloquer si ça échoue)
    ;(supabase as any)
      .from('admins')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', admin.id)
      .then(() => {}, (err: unknown) => console.warn('Error updating last_login_at:', err))

    // Retourner un User avec role='admin' - C'EST LA PRIORITÉ
    const adminUser = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: 'admin' as User['role'],
      avatar: admin.avatar_url || undefined,
      createdAt: admin.created_at,
    }
    
    console.log('[AuthStore] Returning admin user (PRIORITY):', adminUser)
    return adminUser
  }

  // Log pour déboguer si l'admin n'est pas trouvé (mais ne pas bloquer)
  if (adminError) {
    // PGRST116 = no rows returned (normal si l'utilisateur n'est pas admin)
    // Ignorer les AbortError (déjà gérées ci-dessus)
    if (adminError.code !== 'PGRST116' && adminError.message !== 'AbortError' && adminError.code !== 'ABORTED') {
      console.warn('[Auth] Error checking admin table:', {
        code: adminError.code,
        message: adminError.message,
        details: adminError.details,
        hint: adminError.hint,
      })
    } else if (adminError.code === 'PGRST116') {
      console.log('[AuthStore] No admin found for email:', supabaseUser.email, '(normal if not admin)')
    }
  } else if (!admin) {
    // Pas d'erreur mais pas d'admin trouvé non plus
    console.log('[AuthStore] No admin found for email:', supabaseUser.email, '(checking profile next)')
  }

  // PRIORITÉ 2 : Récupérer le profil depuis la table profiles
  // Seulement si ce n'est PAS un admin (les admins ont déjà été retournés ci-dessus)
  // Utiliser maybeSingle() pour éviter l'erreur si le profil n'existe pas
  let profile = null
  let profileError = null
  
  // Fonction helper pour vérifier le profil avec gestion des AbortError
  const checkProfile = async (): Promise<{ profile: any; error: any }> => {
    try {
      const { data: profile, error: profileError } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle()

      return { profile, error: profileError }
    } catch (error: any) {
      // Si c'est une AbortError (React Strict Mode), on la retourne pour réessayer
      if (error?.message?.includes('AbortError') || error?.message?.includes('aborted')) {
        return { profile: null, error: { message: 'AbortError', code: 'ABORTED' } }
      }
      return { profile: null, error }
    }
  }

  // Essayer de vérifier le profil (avec retry si AbortError)
  let profileCheckResult = await checkProfile()
  
  // Si AbortError, réessayer une fois après un court délai
  if (profileCheckResult.error?.message === 'AbortError' || profileCheckResult.error?.code === 'ABORTED') {
    console.log('[Auth] Profile check aborted (React Strict Mode), retrying after 300ms...')
    await new Promise(resolve => setTimeout(resolve, 300))
    profileCheckResult = await checkProfile()
  }

  profile = profileCheckResult.profile
  profileError = profileCheckResult.error

  // Si le profil existe, le retourner (mais seulement si ce n'est pas un admin)
  if (profile && !isAdmin) {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role as User['role'],
      avatar: profile.avatar_url || undefined,
      createdAt: profile.created_at,
    }
  }

  // IMPORTANT : Si c'est un admin, on ne devrait PAS essayer de créer le profil
  // Les admins ont déjà été retournés ci-dessus. Si on arrive ici, c'est qu'il y a un problème.
  if (isAdmin && adminData) {
    console.warn('[Auth] Admin detected but reached profile creation - this should not happen')
    // Retourner l'admin immédiatement
    return {
      id: adminData.id,
      name: adminData.name,
      email: adminData.email,
      role: 'admin' as User['role'],
      avatar: adminData.avatar_url || undefined,
      createdAt: adminData.created_at,
    }
  }

  // Si le profil n'existe pas, essayer de le créer
  // Note: Le trigger devrait normalement créer le profil automatiquement,
  // mais on essaie quand même au cas où le trigger n'a pas fonctionné
  // SEULEMENT pour les utilisateurs non-admin
  if (!profile && profileError) {
    // PGRST116 = no rows returned (normal si le profil n'existe pas)
    // Si c'est une autre erreur, on la log mais on continue quand même
    if (profileError.code !== 'PGRST116') {
      console.warn('[Auth] Error fetching profile:', profileError)
    }
  }

  // Essayer de créer le profil (le trigger devrait l'avoir fait, mais on essaie quand même)
  // SEULEMENT si ce n'est PAS un admin
  if (!isAdmin) {
    try {
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

    // Si la création réussit, retourner le nouveau profil
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

    // Si l'erreur indique que le profil existe déjà (duplicate key), réessayer de le récupérer
    if (createError) {
      // 23505 = unique_violation (profil déjà existant)
      if (createError.code === '23505' || createError.message?.includes('duplicate') || createError.message?.includes('already exists')) {
        console.log('[Auth] Profile already exists, retrying fetch...')
        // Réessayer de récupérer le profil après un court délai
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
        } else {
          // Autre erreur (RLS, permissions, etc.)
          // Ne logger que si l'erreur a des détails
          if (createError.code || createError.message) {
            console.error('[Auth] Error creating profile:', {
              code: createError.code,
              message: createError.message,
              details: createError.details,
              hint: createError.hint,
            })
          } else {
            // Si l'erreur est vide, c'est probablement un problème de RLS
            console.warn('[Auth] Error creating profile (empty error object - likely RLS issue)')
            console.warn('[Auth] This might be because:')
            console.warn('[Auth] 1. RLS policies are blocking the insert')
            console.warn('[Auth] 2. The user is an admin and should not have a profile')
            console.warn('[Auth] 3. The profile trigger should have created it automatically')
            console.warn('[Auth] Checking if user is admin before continuing...')
            
            // Réessayer la vérification admin une dernière fois avant de continuer
            const finalAdminCheck = await checkAdmin()
            if (finalAdminCheck.admin && !finalAdminCheck.error) {
              console.log('[Auth] Admin found on final check! Returning admin user')
              return {
                id: finalAdminCheck.admin.id,
                name: finalAdminCheck.admin.name,
                email: finalAdminCheck.admin.email,
                role: 'admin' as User['role'],
                avatar: finalAdminCheck.admin.avatar_url || undefined,
                createdAt: finalAdminCheck.admin.created_at,
              }
            }
          }
          // Ne pas retourner null, continuer pour retourner un utilisateur minimal
        }
    }
    } catch (error) {
      console.error('[Auth] Unexpected error creating profile:', error)
      // Ne pas retourner null, continuer pour retourner un utilisateur minimal
    }
  } else {
    // Si c'est un admin, on ne devrait pas créer de profil
    console.log('[Auth] Skipping profile creation for admin user')
  }

  // Si on arrive ici, on n'a pas pu créer/récupérer le profil
  // PRIORITÉ ABSOLUE : Si c'est un admin (détecté plus haut), retourner avec role='admin'
  // même si le profil n'a pas pu être créé/récupéré
  if (isAdmin && adminData) {
    console.warn('[Auth] Could not fetch profile but admin detected, returning admin user')
    return {
      id: adminData.id,
      name: adminData.name,
      email: adminData.email,
      role: 'admin' as User['role'],
      avatar: adminData.avatar_url || undefined,
      createdAt: adminData.created_at,
    }
  }
  
  // Pour les autres utilisateurs (non-admin), retourner un utilisateur minimal avec role='customer'
  console.warn('[Auth] Could not create/fetch profile, using minimal user data (customer)')
  return {
    id: supabaseUser.id,
    name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
    email: supabaseUser.email || '',
    role: 'customer' as User['role'],
    avatar: undefined,
    createdAt: supabaseUser.created_at || new Date().toISOString(),
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  supabaseUser: null,
  loading: false,
  initialized: false,

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
        
        // Log pour déboguer
        console.log('[AuthStore] User mapped after signIn:', user)
        console.log('[AuthStore] User role:', user?.role)
        console.log('[AuthStore] User email:', user?.email)
        
        // Si l'utilisateur est null, c'est un problème
        if (!user) {
          console.error('[AuthStore] mapSupabaseUserToUser returned null for user:', data.user.email)
          set({ loading: false })
          return { error: new Error('Failed to map user data') }
        }
        
        // S'assurer que le store est mis à jour AVANT de retourner
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
        // Le profil sera créé automatiquement par le trigger dans la DB
        // Attendre un peu pour que le trigger s'exécute, puis récupérer le profil
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Essayer de créer le profil si le trigger n'a pas fonctionné
        // Le trigger devrait normalement créer le profil automatiquement
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

        // Si l'insertion échoue, vérifier le type d'erreur
        if (profileError) {
          // 23505 = unique_violation (profil déjà existant) - c'est OK, le trigger a fonctionné
          // Autres erreurs peuvent indiquer un problème de RLS ou de permissions
          if (profileError.code === '23505' || profileError.message?.includes('duplicate') || profileError.message?.includes('already exists')) {
            console.log('[Auth] Profile already exists (trigger worked)')
          } else {
            console.warn('[Auth] Error creating profile during signup:', {
              code: profileError.code,
              message: profileError.message,
              details: profileError.details,
              hint: profileError.hint,
            })
          }
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
      // Ne pas mettre loading: true ici car onAuthStateChange va gérer la mise à jour
      // On met à jour immédiatement l'état pour une réponse plus rapide
      set({
        user: null,
        supabaseUser: null,
        loading: false,
        initialized: true, // Garder initialized à true car l'initialisation a déjà eu lieu
      })
    } catch (error) {
      console.error('[AuthStore] Unexpected error signing out:', error)
    }
  },

  initialize: async () => {
    if (get().initialized) return

    set({ loading: true })
    try {
      // Récupérer la session actuelle
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Error getting session:', error)
        set({ loading: false, initialized: true })
        return
      }

      if (session?.user) {
        try {
          const user = await mapSupabaseUserToUser(session.user)
          set({
            user,
            supabaseUser: session.user,
            loading: false,
            initialized: true,
          })
        } catch (error) {
          console.error('Error mapping user:', error)
          // En cas d'erreur, initialiser quand même pour ne pas bloquer
          set({
            user: null,
            supabaseUser: session.user,
            loading: false,
            initialized: true,
          })
        }
      } else {
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
          console.log('[AuthStore] User signed in, mapping user...')
          try {
            const user = await mapSupabaseUserToUser(session.user)
            console.log('[AuthStore] User mapped in onAuthStateChange:', user)
            console.log('[AuthStore] Setting user in store:', { email: user?.email, role: user?.role })
            
            if (!user) {
              console.error('[AuthStore] mapSupabaseUserToUser returned null in onAuthStateChange')
            }
            
            set({
              user,
              supabaseUser: session.user,
              loading: false,
              initialized: true,
            })
          } catch (error) {
            console.error('[AuthStore] Error mapping user in onAuthStateChange:', error)
            // En cas d'erreur, initialiser quand même pour ne pas bloquer
            set({
              user: null,
              supabaseUser: session.user,
              loading: false,
              initialized: true,
            })
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('[AuthStore] User signed out via onAuthStateChange')
          set({
            user: null,
            supabaseUser: null,
            loading: false,
            initialized: true, // Garder initialized à true
          })
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('[AuthStore] Token refreshed, mapping user...')
          const user = await mapSupabaseUserToUser(session.user)
          set({
            user,
            supabaseUser: session.user,
          })
        }
      })
    } catch (error) {
      console.error('Error initializing auth:', error)
      set({ loading: false, initialized: true })
    }
  },

  refreshSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession()

      if (error) {
        console.error('Error refreshing session:', error)
        return
      }

      if (session?.user) {
        const user = await mapSupabaseUserToUser(session.user)
        set({
          user,
          supabaseUser: session.user,
        })
      }
    } catch (error) {
      console.error('Error refreshing session:', error)
    }
  },
}))
