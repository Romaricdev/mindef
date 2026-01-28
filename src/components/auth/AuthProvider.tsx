'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth-store'

interface AuthProviderProps {
  children: React.ReactNode
}

/**
 * Provider pour initialiser l'authentification au niveau de l'application
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return <>{children}</>
}
