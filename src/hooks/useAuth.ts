'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'

/**
 * Hook pour utiliser l'authentification
 * Initialise automatiquement l'auth au montage
 */
export function useAuth() {
  const router = useRouter()
  const {
    user,
    supabaseUser,
    loading,
    initialized,
    signIn,
    signUp,
    signOut,
    initialize,
    refreshSession,
  } = useAuthStore()

  useEffect(() => {
    if (!initialized) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[useAuth] Initializing auth store...')
      }
      initialize()
    }
  }, [initialized, initialize])

  return {
    user,
    supabaseUser,
    loading,
    initialized, // S'assurer que initialized est retourné
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    refreshSession,
  }
}

/**
 * Hook pour protéger une route - redirige vers /login si non authentifié
 */
export function useRequireAuth(redirectTo: string = '/login') {
  const router = useRouter()
  const { user, loading, initialized } = useAuth()

  useEffect(() => {
    if (initialized && !loading && !user) {
      router.push(redirectTo)
    }
  }, [user, loading, initialized, router, redirectTo])

  return {
    user,
    loading: loading || !initialized,
    isAuthenticated: !!user,
  }
}

/**
 * Hook pour protéger une route admin - redirige si l'utilisateur n'est pas admin
 * Les admins sont dans la table `admins` séparée, mais utilisent aussi Supabase Auth
 */
export function useRequireAdmin(redirectTo: string = '/home') {
  const router = useRouter()
  const { user, loading, initialized } = useAuth()
  // Récupérer aussi initialized directement du store au cas où useAuth ne le retourne pas
  const storeInitialized = useAuthStore((state) => state.initialized)
  const finalInitialized = initialized ?? storeInitialized
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Ne pas rediriger plusieurs fois
    if (isRedirecting) {
      return
    }

    // Attendre que l'initialisation soit complète et qu'on ne soit plus en chargement
    if (finalInitialized && !loading) {
      // Attendre un peu pour que l'utilisateur soit complètement mappé (surtout pour les admins)
      // Cela évite les race conditions où le layout vérifie avant que mapSupabaseUserToUser soit terminé
      const checkTimer = setTimeout(() => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[useRequireAdmin] Checking access:', {
            hasUser: !!user,
            userRole: user?.role,
            isAdmin: user?.role === 'admin',
          })
        }

        if (!user) {
          if (process.env.NODE_ENV === 'development') {
            console.log('[useRequireAdmin] No user, redirecting to login')
          }
          setIsRedirecting(true)
          router.push('/login')
        } else if (user.role !== 'admin') {
          // Seuls les admins (de la table admins) peuvent accéder au dashboard
          if (process.env.NODE_ENV === 'development') {
            console.log('[useRequireAdmin] User is not admin (role:', user.role, '), redirecting to', redirectTo)
          }
          setIsRedirecting(true)
          router.push(redirectTo)
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log('[useRequireAdmin] User is admin, access granted')
          }
        }
      }, 1000) // Délai pour laisser le temps à mapSupabaseUserToUser de terminer

      return () => {
        clearTimeout(checkTimer)
      }
    }
    // Pas besoin de logger "Not ready yet" à chaque fois - c'est normal pendant l'initialisation
  }, [user, loading, finalInitialized, router, redirectTo, isRedirecting])

  // Si on redirige, on considère qu'on est toujours en chargement
  const isLoading = loading || !finalInitialized || isRedirecting

  return {
    user,
    loading: isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  }
}
